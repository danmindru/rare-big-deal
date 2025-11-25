const fs = require('fs');
const path = require('path');
const { overrides } = require('../data/config/product-overrides');
const { sanitizeName } = require('./sanitize-name');
const { outputDir } = require('./settings');
const { fetchWebsiteData } = require('./website-scraper');
const {
  extractHighestResFavicon,
  checkExistingLogo,
} = require('./favicon-extractor');
const {
  downloadImage,
  downloadMultipleImages,
  convertIcoToPng,
} = require('./image-downloader');

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
async function processProductLogo(app, productName, appDir, faviconUrl) {
  // Check if faviconUrl is missing or not a valid URL
  if (!faviconUrl) {
    console.log(`[Asset Fetcher] ⚠️  Missing favicon URL for ${productName}, checking for existing logo...`);
    // Check if logo already exists
    const existingLogo = checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
    } else {
      console.warn(`[Asset Fetcher] ❌ No logo available for ${productName}`);
    }
    return;
  }

  // Check if it's a valid URL format
  try {
    new URL(faviconUrl);
  } catch (error) {
    console.log(`[Asset Fetcher] ⚠️  Invalid URL format for ${productName}: ${faviconUrl}`);
    const existingLogo = checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
    } else {
      console.warn(`[Asset Fetcher] ❌ No logo available for ${productName}`);
    }
    return;
  }

  // Check for common image extensions or allow URLs from known image services
  const hasImageExtension =
    faviconUrl.endsWith('.jpg') ||
    faviconUrl.endsWith('.jpeg') ||
    faviconUrl.endsWith('.png') ||
    faviconUrl.endsWith('.webp') ||
    faviconUrl.endsWith('.ico');

  const isKnownImageService =
    faviconUrl.includes('google.com/s2/favicons') ||
    faviconUrl.includes('githubusercontent.com') ||
    faviconUrl.includes('cloudfront.net') ||
    faviconUrl.includes('cdn.');

  if (!hasImageExtension && !isKnownImageService) {
    console.log(`[Asset Fetcher] ⚠️  URL doesn't appear to be an image for ${productName}: ${faviconUrl}`);
    console.log(`[Asset Fetcher] 🔄 Will attempt download anyway and validate content...`);
  }

  console.log(`[Asset Fetcher] 🖼️  Processing logo for ${productName} from: ${faviconUrl}`);
  const logoPath = path.join(appDir, 'logo.png');
  const isValidImage = await downloadImage(faviconUrl, logoPath);

  if (isValidImage) {
    if (faviconUrl.endsWith('.ico')) {
      console.log(`[Asset Fetcher] 🔄 Converting ICO to PNG for ${productName}...`);
      const icoPath = path.join(appDir, 'logo.png');
      await fs.promises.rename(logoPath, icoPath);
      await convertIcoToPng(icoPath, logoPath);
      console.log(`[Asset Fetcher] ✅ ICO converted to PNG`);
    }

    app.logo = `/static/images/product/${productName}/logo.png`;
    console.log(`[Asset Fetcher] ✅ Logo processed successfully: ${app.logo}`);
  } else {
    console.warn(`[Asset Fetcher] ⚠️  Logo download failed, checking for existing logo...`);
    // Check if logo already exists as fallback
    const existingLogo = checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
    } else {
      console.error(`[Asset Fetcher] ❌ No logo available for ${productName}`);
    }
  }
}

/**
 * Fetches all assets (images, logos, metadata) for a product.
 *
 * @param {object} app - The app/product object containing name, website, etc.
 */
async function fetchAssets(app) {
  const { website, name } = app;
  const productName = sanitizeName(name);
  const appDir = path.join(outputDir, 'product', productName);

  console.log(`\n[Asset Fetcher] 🚀 Starting asset fetch for: ${name}`);
  console.log(`[Asset Fetcher] 🌐 Website: ${website}`);
  const startTime = Date.now();

  fs.mkdirSync(appDir, { recursive: true });
  console.log(`[Asset Fetcher] 📁 Created/verified directory: ${appDir}`);

  // Apply overrides first
  const override = applyOverrides(app, productName, appDir);

  // If both logo and ogImage(s) are overridden, we're done
  if (override?.logo && (override?.ogImages || override?.ogImage)) {
    const elapsed = Date.now() - startTime;
    console.log(`[Asset Fetcher] ✅ All assets overridden for ${productName}`);
    console.log(`[Asset Fetcher] ⏱️  Total time: ${elapsed}ms\n`);
    return;
  }

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
    } = await fetchWebsiteData(website);

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
    } else {
      console.log(`[Asset Fetcher] ⏭️  Skipping image download (overridden)`);
    }

    // Process logo/favicon if not overridden
    if (!override?.logo && $) {
      const highestResFaviconUrl = await extractHighestResFavicon(
        $,
        website,
        appStoreImageUrl,
      );

      await processProductLogo(app, productName, appDir, highestResFaviconUrl);
    } else if (override?.logo) {
      console.log(`[Asset Fetcher] ⏭️  Skipping logo download (overridden)`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Asset Fetcher] ✅ Successfully fetched all assets for ${productName}`);
    console.log(`[Asset Fetcher] ⏱️  Total time: ${elapsed}ms\n`);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Asset Fetcher] ❌ Failed to fetch assets for ${app.name}:`, error.message);
    console.error(`[Asset Fetcher] Stack trace:`, error.stack);

    // Check if logo already exists as fallback
    const existingLogo = checkExistingLogo(appDir, productName);
    if (existingLogo) {
      app.logo = existingLogo;
    }

    console.log(`[Asset Fetcher] ⏱️  Failed after: ${elapsed}ms\n`);
  }
}

module.exports = {
  fetchAssets,
  applyOverrides,
  processProductImages,
  processProductLogo,
};
