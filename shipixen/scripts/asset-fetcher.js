const fs = require('fs');
const path = require('path');
const { overrides } = require('../data/config/product-overrides');
const { sanitizeName } = require('./sanitize-name');
const { outputDir } = require('./settings');
const { fetchWebsiteData } = require('./website-scraper');
const { acquireProductLogo, checkExistingLogo } = require('./favicon-extractor');
const {
  downloadImage,
  downloadMultipleImages,
  isOverridesImagePath,
  saveRaster,
} = require('./image-downloader');
const { ensureUsableBanner } = require('./lib/banner-fallback');
const { decodedSize, inspectMediaFile } = require('./lib/media-bytes');
const { pinnedPublicFiles } = require('./check-archive-media');

/**
 * outputDir is shipixen/public/static/images in production. Tests that pass a
 * bare temp directory are not publishing into the archived public tree.
 */
function publishingLayout(outputRoot) {
  const imagesDir = path.resolve(outputRoot);
  const staticDir = path.dirname(imagesDir);
  const publicRoot = path.dirname(staticDir);
  const shipixenRoot = path.dirname(publicRoot);
  const repoRoot = path.dirname(shipixenRoot);
  if (
    path.basename(imagesDir) !== 'images' ||
    path.basename(staticDir) !== 'static' ||
    path.basename(publicRoot) !== 'public' ||
    path.basename(shipixenRoot) !== 'shipixen' ||
    !fs.existsSync(path.join(shipixenRoot, 'archive'))
  ) {
    return null;
  }
  return { repoRoot, publicRoot };
}

function publicUrl(publicRoot, filePath) {
  return `/${path.relative(publicRoot, filePath).split(path.sep).join('/')}`;
}

/**
 * Official art configured under public/static/images/overrides/ is served from
 * that file. It is not copied onto the auto-fetched product path, which a
 * later run could replace with a locale og:image.
 */
function publicOverrideUrl(overridePath) {
  if (typeof overridePath !== 'string') return null;
  const normalized = overridePath.replace(/\\/g, '/');
  const marker = 'public/static/images/overrides/';
  if (!normalized.startsWith(marker) || normalized.includes('..')) return null;
  return `/${normalized.slice('public/'.length)}`;
}

/**
 * Archive pages pin some /static/images/product files. Those bytes stay put.
 * public/static/images/overrides is owner art and is never a write destination.
 */
function writableImage(preferred, layout, pinned) {
  const resolved = path.resolve(preferred);
  if (isOverridesImagePath(resolved)) {
    return { file: resolved, pinned: false, protected: true };
  }
  if (layout && pinned && pinned.has(resolved)) {
    return { file: resolved, pinned: true, protected: true };
  }
  return { file: resolved, pinned: false, protected: false };
}

async function hasDecodedPixels(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return false;
  try {
    const size = await decodedSize(fs.readFileSync(filePath));
    return Boolean(size);
  } catch {
    return false;
  }
}

/**
 * A pinned file, an overrides path, or an existing product image for a slug
 * listed in product-overrides.js is not replaced.
 */
async function writeLocked(choice, slugLocked) {
  if (!choice) return false;
  if (choice.protected || isOverridesImagePath(choice.file)) return true;
  if (slugLocked && (await hasDecodedPixels(choice.file))) return true;
  return false;
}

/**
 * Applies configured overrides for a product (logo, images, categories, etc.).
 *
 * @param {object} app - The app/product object
 * @param {string} productName - Sanitized product name
 * @param {string} appDir - Directory for the product's assets
 * @returns {object} - Override configuration if exists, null otherwise
 */
function applyOverrides(app, productName, appDir, publish, overrideMap) {
  const table = overrideMap || overrides;
  const override = table[productName];

  if (!override) {
    console.log(`[Asset Fetcher] 📋 No overrides found for ${productName}`);
    return null;
  }

  console.log(`[Asset Fetcher] 🎨 Applying overrides for ${productName}`);

  const locate = (fileName) => {
    if (!publish) return path.join(appDir, fileName);
    const chosen = publish.place(fileName);
    if (chosen.protected || isOverridesImagePath(chosen.file)) return null;
    fs.mkdirSync(path.dirname(chosen.file), { recursive: true });
    return chosen.file;
  };
  const expose = (fileName, filePath) => {
    if (publish) return publish.urlFor(filePath, fileName);
    return `/static/images/product/${productName}/${fileName}`;
  };
  const copyOverride = (sourcePath, destPath) => {
    if (!destPath || isOverridesImagePath(destPath)) {
      console.error(`[Asset Fetcher] ❌ Refusing to write a protected image for ${productName}`);
      return;
    }
    if (path.resolve(sourcePath) === path.resolve(destPath)) return;
    fs.copyFileSync(sourcePath, destPath);
  };

  if (override.logo) {
    const sourcePath = path.join(__dirname, '..', override.logo);
    const publicLogo = publicOverrideUrl(override.logo);
    if (!publicLogo) {
      console.error(
        `[Asset Fetcher] ❌ Override logo must stay under public/static/images/overrides: ${override.logo}`,
      );
    } else if (!fs.existsSync(sourcePath)) {
      console.error(
        `[Asset Fetcher] ❌ Official override logo is missing for ${productName}: ${override.logo}`,
      );
    } else {
      app.logo = publicLogo;
      if (publish) publish.logoFile = sourcePath;
      console.log(`[Asset Fetcher] ✅ Official override logo wins for ${productName}: ${app.logo}`);
    }
  }

  // A configured official image always wins. Do not replace it with an
  // auto-fetched og:image (those can be another language or a capture).
  const configuredImages =
    override.ogImages && Array.isArray(override.ogImages) && override.ogImages.length > 0
      ? override.ogImages
      : override.ogImage
        ? [override.ogImage]
        : [];
  const officialUrls = configuredImages.map((imagePath) => publicOverrideUrl(imagePath));
  if (configuredImages.length > 0 && officialUrls.every(Boolean)) {
    const missing = configuredImages.filter((imagePath) => {
      return !fs.existsSync(path.join(__dirname, '..', imagePath));
    });
    if (missing.length > 0) {
      console.error(
        `[Asset Fetcher] ❌ Official override image is missing for ${productName}: ${missing.join(', ')}`,
      );
    } else {
      app.images = officialUrls;
      console.log(
        `[Asset Fetcher] ✅ Official override banner wins for ${productName}: ${officialUrls.join(', ')}`,
      );
    }
  } else if (
    override.ogImages &&
    Array.isArray(override.ogImages) &&
    override.ogImages.length > 0
  ) {
    console.log(`[Asset Fetcher] 📸 Copying ${override.ogImages.length} override OG images...`);
    app.images = [];
    override.ogImages.forEach((imagePath, index) => {
      try {
        const fileName =
          index === 0 ? 'og-image.png' : `og-image-${index + 1}.png`;
        const ogImagePath = locate(fileName);
        const sourcePath = path.join(__dirname, '..', imagePath);
        if (!ogImagePath) {
          console.error(`[Asset Fetcher]   ❌ Refusing to replace a protected image: ${fileName}`);
          return;
        }
        copyOverride(sourcePath, ogImagePath);
        app.images.push(expose(fileName, ogImagePath));
        console.log(`[Asset Fetcher]   ✅ Copied image ${index + 1}/${override.ogImages.length}: ${fileName}`);
      } catch (error) {
        console.error(`[Asset Fetcher]   ❌ Failed to copy image ${index + 1}:`, error.message);
      }
    });
    console.log(`[Asset Fetcher] ✅ Successfully copied ${app.images.length}/${override.ogImages.length} override OG images`);
  } else if (override.ogImage) {
    try {
      console.log(`[Asset Fetcher] 📸 Copying single override OG image...`);
      const ogImagePath = locate('og-image.png');
      const sourcePath = path.join(__dirname, '..', override.ogImage);
      if (!ogImagePath) {
        console.error(`[Asset Fetcher] ❌ Refusing to replace a protected OG image for ${productName}`);
      } else {
        copyOverride(sourcePath, ogImagePath);
        app.images = [expose('og-image.png', ogImagePath)];
      }
      console.log(`[Asset Fetcher] ✅ Override OG image copied: ${app.images[0]}`);
    } catch (error) {
      console.error(`[Asset Fetcher] ❌ Failed to copy override OG image:`, error.message);
    }
  }

  if (override.categories) {
    console.log(`[Asset Fetcher] 📂 Overriding categories:`, override.categories);
    app.categories = override.categories;
  }
  if (override.subcategories) {
    console.log(`[Asset Fetcher] 📁 Overriding subcategories:`, override.subcategories);
    app.subcategories = override.subcategories;
  }

  return override;
}

/**
 * Downloads and processes images for a product.
 *
 * @param {object} app - The app/product object
 * @param {string} productName - Sanitized product name
 * @param {string} appDir - Directory for the product's assets
 * @param {string[]} imageUrls - Array of image URLs to download
 */
async function processProductImages(app, productName, appDir, imageUrls, publish, downloadImages) {
  if (imageUrls.length === 0) {
    console.log(`[Asset Fetcher] 📋 No images to download for ${productName}`);
    return;
  }

  console.log(`[Asset Fetcher] 📥 Downloading ${imageUrls.length} image(s) for ${productName}...`);

  const saveImages = downloadImages || downloadMultipleImages;
  const downloadedImages = await saveImages(
    imageUrls,
    appDir,
    productName,
    publish
      ? {
          placeFile: (imageName) => {
            const chosen = publish.place(imageName);
            if (chosen.protected || isOverridesImagePath(chosen.file)) return null;
            fs.mkdirSync(path.dirname(chosen.file), { recursive: true });
            return chosen.file;
          },
          publicPath: (imageName, imagePath) => publish.urlFor(imagePath, imageName),
        }
      : undefined,
  );

  if (downloadedImages.length > 0) {
    app.images = downloadedImages;
    console.log(
      `[Asset Fetcher] ✅ Successfully downloaded ${downloadedImages.length}/${imageUrls.length} image(s) for ${productName}`,
    );
  } else {
    console.warn(`[Asset Fetcher] ⚠️  Failed to download any images for ${productName}`);
  }
}

/**
 * Downloads and processes the logo/favicon for a product.
 *
 * @param {object} app - The app/product object
 * @param {string} productName - Sanitized product name
 * @param {string} appDir - Directory for the product's assets
 * @param {string} faviconUrl - URL of the favicon to download
 */
function rememberUsableBanner(app, productName, banner, bannerPublic) {
  if (!bannerPublic) bannerPublic = `/static/images/product/${productName}/og-image.png`;
  const others = (app.images || []).filter((image) => image !== bannerPublic);
  if (banner && banner.inspection && banner.inspection.ok) {
    app.images = [bannerPublic, ...others];
    if (banner.source === 'website-screenshot') {
      app.bannerSource = 'website-screenshot';
      console.log(`[Asset Fetcher] 📸 Using a website screenshot as the banner for ${productName}`);
    }
    return;
  }
  app.images = others;
  const reason = banner && banner.inspection ? banner.inspection.reason : 'missing';
  console.warn(`[Asset Fetcher] ⚠️  No usable banner for ${productName}: ${reason}`);
}

async function requireUsableLogo(app, productName, appDir, logoFile) {
  const file = logoFile || path.join(appDir, 'logo.png');
  const inspection = await inspectMediaFile(file, 'logo');
  if (!inspection.ok) {
    throw new Error(`No usable logo.png for ${productName}: ${inspection.reason}`);
  }
  if (!app.logo) app.logo = `/static/images/product/${productName}/logo.png`;
  return inspection;
}

async function processProductLogo(app, productName, appDir, faviconUrl) {
  const keepExisting = async () => {
    const existingLogo = await checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
      return;
    }
    console.warn(`[Asset Fetcher] ❌ No logo available for ${productName}`);
  };

  if (!faviconUrl) {
    console.log(`[Asset Fetcher] ⚠️  Missing favicon URL for ${productName}, checking for existing logo...`);
    await keepExisting();
    return;
  }

  try {
    new URL(faviconUrl);
  } catch (error) {
    console.log(`[Asset Fetcher] ⚠️  Invalid URL format for ${productName}: ${faviconUrl}`);
    await keepExisting();
    return;
  }

  console.log(`[Asset Fetcher] 🖼️  Processing logo for ${productName} from: ${faviconUrl}`);
  const preferredLogo = path.join(appDir, 'logo.png');
  const logoLayout = publishingLayout(path.dirname(path.dirname(appDir)));
  const logoChoice = writableImage(
    preferredLogo,
    logoLayout,
    logoLayout ? pinnedPublicFiles(logoLayout.repoRoot) : new Set(),
  );
  if (logoChoice.protected || isOverridesImagePath(logoChoice.file)) {
    console.log(`[Asset Fetcher] ⏭️  Leaving the protected logo untouched for ${productName}`);
    await keepExisting();
    return;
  }
  const logoPath = logoChoice.file;
  fs.mkdirSync(path.dirname(logoPath), { recursive: true });
  const partialPath = path.join(appDir, '.logo-download.png');
  try {
    const saved = await downloadImage(faviconUrl, partialPath);
    if (!saved) {
      console.warn(`[Asset Fetcher] ⚠️  Logo download failed, checking for existing logo...`);
      await keepExisting();
      return;
    }
    const inspection = await inspectMediaFile(partialPath, 'logo');
    if (!inspection.ok) {
      console.warn(`[Asset Fetcher] ⚠️  Logo was not usable: ${inspection.reason}`);
      await keepExisting();
      return;
    }
    const committed = await saveRaster(logoPath, await fs.promises.readFile(partialPath));
    if (!committed.written && committed.reason !== 'smaller') {
      await keepExisting();
      return;
    }
    app.logo = logoLayout
      ? publicUrl(logoLayout.publicRoot, logoPath)
      : `/static/images/product/${productName}/logo.png`;
    console.log(`[Asset Fetcher] ✅ Logo processed successfully: ${app.logo}`);
  } finally {
    await fs.promises.rm(partialPath, { force: true });
  }
}

/**
 * Fetches all assets (images, logos, metadata) for a product.
 *
 * @param {object} app - The app/product object containing name, website, etc.
 */
async function fetchAssets(app, deps = {}) {
  const { website, name } = app;
  const productName = sanitizeName(name);
  const outputRoot = deps.outputDir || outputDir;
  const appDir = path.join(outputRoot, 'product', productName);
  const loadSite = deps.fetchWebsiteData || fetchWebsiteData;
  const ensureBanner = deps.ensureUsableBanner || ensureUsableBanner;
  const acquireLogo = deps.acquireProductLogo || acquireProductLogo;

  console.log(`\n[Asset Fetcher] 🚀 Starting asset fetch for: ${name}`);
  console.log(`[Asset Fetcher] 🌐 Website: ${website}`);
  const startTime = Date.now();

  fs.mkdirSync(appDir, { recursive: true });
  console.log(`[Asset Fetcher] 📁 Created/verified directory: ${appDir}`);

  const layout = publishingLayout(outputRoot);
  const pinned = layout ? pinnedPublicFiles(layout.repoRoot) : new Set();
  const publish = {
    layout,
    logoFile: null,
    place(fileName) {
      return writableImage(path.join(appDir, fileName), layout, pinned);
    },
    urlFor(filePath, fileName) {
      if (!layout) return `/static/images/product/${productName}/${fileName}`;
      return publicUrl(layout.publicRoot, filePath);
    },
  };

  // Apply overrides first. deps.overrides replaces the live map in tests;
  // undefined keeps the configured owner art.
  const overrideTable = deps.overrides || overrides;
  const slugLocked = Boolean(overrideTable && overrideTable[productName]);
  const override = applyOverrides(app, productName, appDir, publish, overrideTable);

  // If both logo and ogImage(s) are overridden, we're done
  if (override?.logo && (override?.ogImages || override?.ogImage)) {
    await requireUsableLogo(app, productName, appDir, publish.logoFile);
    const elapsed = Date.now() - startTime;
    console.log(`[Asset Fetcher] ✅ All assets overridden for ${productName}`);
    console.log(`[Asset Fetcher] ⏱️  Total time: ${elapsed}ms\n`);
    return;
  }

  let failure = null;
  let logoFile = publish.logoFile || path.join(appDir, 'logo.png');
  try {
    console.log(`[Asset Fetcher] 🔍 Fetching website data for ${productName}...`);
    const {
      $,
      ogImageUrl,
      ogImageUrls,
      appStoreImageUrl,
      description,
      title,
      jsonLd,
      botChallenge,
    } = await loadSite(website);

    // Log the fetched title
    console.log(`[Asset Fetcher] 📝 Fetched title: "${title}"`);
    console.log(`[Asset Fetcher] 📄 Fetched description: "${description?.substring(0, 100)}${description?.length > 100 ? '...' : ''}"`);

    app.metaDescription = description;
    app.metaTitle = title;

    // Store JSON-LD data if available
    if (jsonLd) {
      app.jsonLd = jsonLd;
      console.log(`[Asset Fetcher] ✅ Stored JSON-LD structured data for ${productName}`);
    }

    // A configured official banner wins, so an auto-fetched og:image is never
    // written over it. A pinned file and an overrides path are never written.
    // An existing product image for a slug in product-overrides.js stays too.
    if (!override?.ogImages && !override?.ogImage) {
      const bannerChoice = publish.place('og-image.png');
      if (await writeLocked(bannerChoice, slugLocked)) {
        console.log(`[Asset Fetcher] ⏭️  Keeping the existing banner for ${productName}`);
        const inspection = await inspectMediaFile(bannerChoice.file, 'banner');
        rememberUsableBanner(
          app,
          productName,
          { source: 'og-image', inspection },
          publish.urlFor(bannerChoice.file, 'og-image.png'),
        );
      } else {
        const imageUrlsToDownload =
          ogImageUrls.length > 0 ? ogImageUrls : [ogImageUrl].filter(Boolean);

        await processProductImages(
          app,
          productName,
          appDir,
          imageUrlsToDownload,
          publish,
          deps.downloadMultipleImages,
        );
        const banner = await ensureBanner({
          imagePath: bannerChoice.file,
          website,
          botChallenge,
        });
        rememberUsableBanner(
          app,
          productName,
          banner,
          publish.urlFor(bannerChoice.file, 'og-image.png'),
        );
      }
    } else {
      console.log(`[Asset Fetcher] ⏭️  Skipping image download (overridden)`);
    }

    // A missing HTML parse still tries origin icons and the Google favicon service.
    if (!override?.logo) {
      const logoChoice = publish.place('logo.png');
      if (await writeLocked(logoChoice, slugLocked)) {
        console.log(`[Asset Fetcher] ⏭️  Keeping the existing logo for ${productName}`);
        const existingInspection = await inspectMediaFile(logoChoice.file, 'logo');
        if (existingInspection.ok) {
          logoFile = logoChoice.file;
          app.logo = publish.urlFor(logoChoice.file, 'logo.png');
        }
      } else {
        fs.mkdirSync(path.dirname(logoChoice.file), { recursive: true });
        const acquired = await acquireLogo({
          $,
          website,
          appStoreImageUrl,
          outputPath: logoChoice.file,
        });
        if (acquired) {
          logoFile = logoChoice.file;
          app.logo = publish.urlFor(logoChoice.file, 'logo.png');
          console.log(
            `[Asset Fetcher] ✅ Logo from ${acquired.url}${acquired.resized ? ' (scaled to a usable size)' : ''}`,
          );
        } else {
          const existingLogo = await checkExistingLogo(appDir, productName);
          if (existingLogo) {
            app.logo = existingLogo;
            logoFile = path.join(appDir, 'logo.png');
          }
        }
      }
    } else {
      console.log(`[Asset Fetcher] ⏭️  Skipping logo download (overridden)`);
    }
  } catch (error) {
    failure = error;
    const elapsed = Date.now() - startTime;
    console.error(`[Asset Fetcher] ❌ Failed to fetch assets for ${app.name}:`, error.message);
    console.error(`[Asset Fetcher] Stack trace:`, error.stack);

    const existingLogo = await checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
      logoFile = path.join(appDir, 'logo.png');
    }

    console.log(`[Asset Fetcher] ⏱️  Failed after: ${elapsed}ms\n`);
  }

  try {
    await requireUsableLogo(app, productName, appDir, logoFile);
  } catch (logoError) {
    if (failure) throw failure;
    throw logoError;
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Asset Fetcher] ✅ Successfully fetched all assets for ${productName}`);
  console.log(`[Asset Fetcher] ⏱️  Total time: ${elapsed}ms\n`);
}

module.exports = {
  fetchAssets,
  applyOverrides,
  publicOverrideUrl,
  processProductImages,
  processProductLogo,
  rememberUsableBanner,
  requireUsableLogo,
};
