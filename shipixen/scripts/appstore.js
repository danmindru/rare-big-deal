/**
 * Apple App Store specific extraction utilities
 * Handles extracting app icons and OG images from App Store pages
 */

async function extractAppStoreIcon($, website) {
  console.log('[App Store] 📱 Extracting app icon from Apple App Store page...');

  // Look for app icon in various possible selectors (square orientation)
  const appIconSelectors = [
    '.app-icon picture source[type="image/jpeg"]',
    '.app-icon picture source[type="image/webp"]',
    '.app-icon picture source[type="image/png"]',
    '.artwork-component--orientation-square picture source[type="image/jpeg"]',
    '.artwork-component--orientation-square picture source[type="image/webp"]',
    'div[class*="app-icon"] picture source[type="image/jpeg"]',
    'div[class*="app-icon"] picture source[type="image/webp"]',
  ];

  console.log(`[App Store] 🔍 Trying ${appIconSelectors.length} possible selectors...`);

  for (const selector of appIconSelectors) {
    const srcset = $(selector).attr('srcset');
    if (srcset) {
      console.log(`[App Store] ✅ Found app icon with selector: ${selector}`);
      console.log(`[App Store] 📋 srcset: ${srcset}`);

      // Parse srcset to get the highest resolution image
      const srcsetEntries = srcset.split(',').map((entry) => entry.trim());

      // Find the entry with the highest width descriptor (e.g., "400w")
      let maxWidth = 0;
      let maxResUrl = null;

      for (const entry of srcsetEntries) {
        const parts = entry.split(' ');
        const url = parts[0];
        const widthDescriptor = parts[1]; // e.g., "400w"

        if (widthDescriptor && widthDescriptor.endsWith('w')) {
          const width = parseInt(widthDescriptor.slice(0, -1), 10);
          if (width > maxWidth) {
            maxWidth = width;
            maxResUrl = url;
          }
        }
      }

      // Fallback to first entry if no width descriptor found
      const imageUrl = maxResUrl || srcsetEntries[0]?.split(' ')[0];

      if (imageUrl) {
        const iconUrl = imageUrl.startsWith('http')
          ? imageUrl
          : new URL(imageUrl, website).href;
        console.log(`[App Store] ✅ Extracted app icon URL (${maxWidth}w): ${iconUrl}`);
        return iconUrl;
      }
    }
  }

  console.warn(`[App Store] ⚠️  No app icon found with any selector`);
  return null;
}

/**
 * Helper function to extract the highest resolution URL from a srcset
 */
function extractMaxResolutionFromSrcset(srcset, website) {
  const srcsetEntries = srcset.split(',').map((entry) => entry.trim());

  // Find the entry with the highest width descriptor (e.g., "1286w")
  let maxWidth = 0;
  let maxResUrl = null;

  for (const entry of srcsetEntries) {
    const parts = entry.split(' ');
    const url = parts[0];
    const widthDescriptor = parts[1]; // e.g., "1286w"

    if (widthDescriptor && widthDescriptor.endsWith('w')) {
      const width = parseInt(widthDescriptor.slice(0, -1), 10);
      if (width > maxWidth) {
        maxWidth = width;
        maxResUrl = url;
      }
    }
  }

  // Fallback to first entry if no width descriptor found
  const imageUrl = maxResUrl || srcsetEntries[0]?.split(' ')[0];

  if (imageUrl) {
    const absoluteUrl = imageUrl.startsWith('http')
      ? imageUrl
      : new URL(imageUrl, website).href;
    return { url: absoluteUrl, width: maxWidth };
  }

  return null;
}

async function extractAppStoreOgImage($, website) {
  console.log('[App Store] 🖼️  Extracting OG image from Apple App Store page...');

  // Look for preview images (screenshots/OG images) in various ways
  const ogImageSelectors = [
    // Using data-testid - most reliable
    '[id*="product_media_"] [data-testid="artwork-component"] picture source[type="image/jpeg"]',
    '[id*="product_media_"] [data-testid="artwork-component"] picture source[type="image/webp"]',
  ];

  console.log(`[App Store] 🔍 Trying ${ogImageSelectors.length} possible selectors...`);

  for (const selector of ogImageSelectors) {
    const element = $(selector).first();
    const srcset = element.attr('srcset');

    if (srcset) {
      console.log(`[App Store] ✅ Found OG image with selector: ${selector}`);
      console.log(`[App Store] 📋 srcset: ${srcset}`);

      const result = extractMaxResolutionFromSrcset(srcset, website);
      if (result) {
        console.log(`[App Store] ✅ Extracted OG image URL (${result.width}w): ${result.url}`);
        return result.url;
      }
    }
  }

  console.warn(`[App Store] ⚠️  No OG image found with any selector`);
  return null;
}

/**
 * Extract all available preview images from App Store page
 * @returns {Array<string>} Array of image URLs
 */
async function extractAppStoreImages($, website) {
  console.log('[App Store] 📸 Extracting all preview images from Apple App Store page...');

  const images = [];
  const seenUrls = new Set(); // Avoid duplicates

  // Look for all preview images in the media shelf
  const imageSelectors = [
    // Using data-testid - most reliable
    '[id*="product_media_"] [data-testid="artwork-component"] picture source[type="image/jpeg"]',
    '[id*="product_media_"] [data-testid="artwork-component"] picture source[type="image/webp"]',
  ];

  console.log(`[App Store] 🔍 Trying ${imageSelectors.length} possible selectors...`);

  for (const selector of imageSelectors) {
    const elements = $(selector);

    console.log(
      `[App Store] 📋 Found ${elements.length} potential preview images with selector: ${selector}`,
    );

    elements.each((index, element) => {
      const srcset = $(element).attr('srcset');

      if (srcset) {
        const result = extractMaxResolutionFromSrcset(srcset, website);
        if (result && !seenUrls.has(result.url)) {
          seenUrls.add(result.url);
          images.push(result.url);
          console.log(
            `[App Store]   ✅ Extracted preview image ${images.length} (${result.width}w): ${result.url}`,
          );
        }
      }
    });

    // If we found images with this selector, stop trying other selectors
    if (images.length > 0) {
      console.log(`[App Store] ✅ Found images, stopping selector search`);
      break;
    }
  }

  if (images.length > 0) {
    console.log(`[App Store] ✅ Total preview images extracted: ${images.length}`);
  } else {
    console.warn(`[App Store] ⚠️  No preview images found`);
  }

  return images;
}

module.exports = {
  extractAppStoreIcon,
  extractAppStoreOgImage,
  extractAppStoreImages,
};
