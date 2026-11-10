const fs = require('fs');
const path = require('path');
const { overrides } = require('../data/config/product-overrides');
const { sanitizeName } = require('./sanitize-name');
const { outputDir } = require('./settings');
const { fetchWebsiteData } = require('./website-scraper');
const { acquireProductLogo, checkExistingLogo } = require('./favicon-extractor');
const { downloadImage, downloadMultipleImages } = require('./image-downloader');
const { ensureUsableBanner } = require('./lib/banner-fallback');
const { inspectMediaFile } = require('./lib/media-bytes');

/**
 * Applies configured overrides for a product (logo, images, categories, etc.).
 *
 * @param {object} app - The app/product object
 * @param {string} productName - Sanitized product name
 * @param {string} appDir - Directory for the product's assets
 * @returns {object} - Override configuration if exists, null otherwise
 */
function applyOverrides(app, productName, appDir) {
  const override = overrides[productName];

  if (!override) {
    console.log(`[Asset Fetcher] 📋 No overrides found for ${productName}`);
    return null;
  }

  console.log(`[Asset Fetcher] 🎨 Applying overrides for ${productName}`);

  if (override.logo) {
    try {
      const logoPath = path.join(appDir, 'logo.png');
      const sourcePath = path.join(__dirname, '..', override.logo);
      console.log(`[Asset Fetcher] 🖼️  Copying override logo from: ${override.logo}`);
      fs.copyFileSync(sourcePath, logoPath);
      app.logo = `/static/images/product/${productName}/logo.png`;
      console.log(`[Asset Fetcher] ✅ Override logo copied successfully: ${app.logo}`);
    } catch (error) {
      console.error(`[Asset Fetcher] ❌ Failed to copy override logo:`, error.message);
    }
  }

  // Handle ogImages (plural) with priority over ogImage (singular)
  if (
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
        const ogImagePath = path.join(appDir, fileName);
        const sourcePath = path.join(__dirname, '..', imagePath);
        fs.copyFileSync(sourcePath, ogImagePath);
        app.images.push(`/static/images/product/${productName}/${fileName}`);
        console.log(`[Asset Fetcher]   ✅ Copied image ${index + 1}/${override.ogImages.length}: ${fileName}`);
      } catch (error) {
        console.error(`[Asset Fetcher]   ❌ Failed to copy image ${index + 1}:`, error.message);
      }
    });
    console.log(`[Asset Fetcher] ✅ Successfully copied ${app.images.length}/${override.ogImages.length} override OG images`);
  } else if (override.ogImage) {
    try {
      console.log(`[Asset Fetcher] 📸 Copying single override OG image...`);
      const ogImagePath = path.join(appDir, 'og-image.png');
      const sourcePath = path.join(__dirname, '..', override.ogImage);
      fs.copyFileSync(sourcePath, ogImagePath);
      app.images = [`/static/images/product/${productName}/og-image.png`];
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
async function processProductImages(app, productName, appDir, imageUrls) {
  if (imageUrls.length === 0) {
    console.log(`[Asset Fetcher] 📋 No images to download for ${productName}`);
    return;
  }

  console.log(`[Asset Fetcher] 📥 Downloading ${imageUrls.length} image(s) for ${productName}...`);

  const downloadedImages = await downloadMultipleImages(
    imageUrls,
    appDir,
    productName,
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
function rememberUsableBanner(app, productName, banner) {
  const bannerPublic = `/static/images/product/${productName}/og-image.png`;
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

async function requireUsableLogo(app, productName, appDir) {
  const logoFile = path.join(appDir, 'logo.png');
  const inspection = await inspectMediaFile(logoFile, 'logo');
  if (!inspection.ok) {
    throw new Error(`No usable logo.png for ${productName}: ${inspection.reason}`);
  }
  app.logo = `/static/images/product/${productName}/logo.png`;
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
  const logoPath = path.join(appDir, 'logo.png');
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
    await fs.promises.rename(partialPath, logoPath);
    app.logo = `/static/images/product/${productName}/logo.png`;
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

  // Apply overrides first
  const override = applyOverrides(app, productName, appDir);

  // If both logo and ogImage(s) are overridden, we're done
  if (override?.logo && (override?.ogImages || override?.ogImage)) {
    await requireUsableLogo(app, productName, appDir);
    const elapsed = Date.now() - startTime;
    console.log(`[Asset Fetcher] ✅ All assets overridden for ${productName}`);
    console.log(`[Asset Fetcher] ⏱️  Total time: ${elapsed}ms\n`);
    return;
  }

  let failure = null;
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

    // Process images if not overridden
    if (!override?.ogImages && !override?.ogImage) {
      const imageUrlsToDownload =
        ogImageUrls.length > 0 ? ogImageUrls : [ogImageUrl].filter(Boolean);

      await processProductImages(app, productName, appDir, imageUrlsToDownload);
      const banner = await ensureBanner({
        imagePath: path.join(appDir, 'og-image.png'),
        website,
      });
      rememberUsableBanner(app, productName, banner);
    } else {
      console.log(`[Asset Fetcher] ⏭️  Skipping image download (overridden)`);
    }

    // A missing HTML parse still tries origin icons and the Google favicon service.
    if (!override?.logo) {
      const acquired = await acquireLogo({
        $,
        website,
        appStoreImageUrl,
        outputPath: path.join(appDir, 'logo.png'),
      });
      if (acquired) {
        app.logo = `/static/images/product/${productName}/logo.png`;
        console.log(
          `[Asset Fetcher] ✅ Logo from ${acquired.url}${acquired.resized ? ' (scaled to a usable size)' : ''}`,
        );
      } else {
        const existingLogo = await checkExistingLogo(appDir, productName);
        if (existingLogo) app.logo = existingLogo;
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
    if (existingLogo) app.logo = existingLogo;

    console.log(`[Asset Fetcher] ⏱️  Failed after: ${elapsed}ms\n`);
  }

  try {
    await requireUsableLogo(app, productName, appDir);
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
  processProductImages,
  processProductLogo,
  rememberUsableBanner,
  requireUsableLogo,
};
