const axios = require('axios');
const { extractAppStoreIcon } = require('./appstore');

/**
 * Sanitizes a title string by removing invisible Unicode characters and control characters.
 *
 * @param {string} title - The title to sanitize
 * @returns {string} - Sanitized title
 */
function sanitizeTitle(title) {
  if (!title) {
    console.log('[Favicon Extractor] 📝 sanitizeTitle: Empty title provided');
    return '';
  }

  const originalTitle = title;
  const sanitized = title
    .trim()
    // Remove Left-to-Right Mark (U+200E), Right-to-Left Mark (U+200F), Zero Width Space (U+200B),
    // Zero Width No-Break Space (U+FEFF), and other common invisible/control characters
    .replace(
      /[\u200E\u200F\u200B\uFEFF\u202A\u202B\u202C\u202D\u202E]/g,
      '',
    )
    // Remove any other control characters (except newlines and tabs which we'll replace with spaces)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    .trim();

  if (originalTitle !== sanitized) {
    console.log(`[Favicon Extractor] 🧹 sanitizeTitle: Cleaned title`);
    console.log(`[Favicon Extractor]   Original: "${originalTitle}"`);
    console.log(`[Favicon Extractor]   Sanitized: "${sanitized}"`);
  }

  return sanitized;
}

/**
 * Extracts the highest resolution favicon from a website.
 *
 * @param {object} $ - Cheerio instance with loaded HTML
 * @param {string} website - The website URL
 * @param {string|null} appStoreImageUrl - Optional App Store image URL to use as fallback
 * @returns {Promise<string|null>} - URL of the highest resolution favicon, or null if not found
 */
async function extractHighestResFavicon($, website, appStoreImageUrl = null) {
  console.log(`\n[Favicon Extractor] 🔍 Starting extraction for: ${website}`);
  const startTime = Date.now();

  // Special handling for Apple App Store URLs to extract app icon
  if (website.includes('apps.apple.com')) {
    console.log('[Favicon Extractor] 📱 Detected App Store URL, attempting App Store icon extraction...');
    try {
      const appStoreIcon = await extractAppStoreIcon($, website);
      if (appStoreIcon) {
        console.log(`[Favicon Extractor] ✅ Successfully extracted App Store icon: ${appStoreIcon}`);
        return appStoreIcon;
      }
      console.log('[Favicon Extractor] ⚠️ App Store icon extraction returned null, falling back to standard extraction');
    } catch (error) {
      console.error(`[Favicon Extractor] ❌ Error extracting App Store icon:`, error.message);
    }
  }

  // Standard favicon extraction for non-App Store URLs or as fallback
  console.log('[Favicon Extractor] 🔨 Building list of possible favicon URLs...');
  const possibleFaviconUrls = [
    $('link[rel="apple-touch-icon"]').attr('href'),
    '/apple-touch-icon.png',
    $('link[rel="icon"][type="image/png"]').attr('href'),
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/favicon.png',
    // Get .ico too
    $('link[rel="icon"]').attr('href'),
    $('link[rel="shortcut icon"]').attr('href'),
    appStoreImageUrl, // Add the app store image URL to the list
  ]
    .filter(Boolean)
    .map((url) => new URL(url, website).href)
    .filter((url) => !url.toLowerCase().endsWith('.svg')); // Filter out SVG favicons

  console.log(`[Favicon Extractor] 📋 Found ${possibleFaviconUrls.length} possible favicon URLs to try`);
  console.log('[Favicon Extractor] 🔗 URLs:', possibleFaviconUrls);

  for (let i = 0; i < possibleFaviconUrls.length; i++) {
    const url = possibleFaviconUrls[i];
    console.log(`[Favicon Extractor] 🎯 Trying URL ${i + 1}/${possibleFaviconUrls.length}: ${url}`);

    try {
      const headResponse = await axios.head(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        validateStatus: (status) => status < 400,
        timeout: 10000, // 10 second timeout
      });

      const contentType = headResponse.headers['content-type'];
      console.log(`[Favicon Extractor]   📡 Response: Status ${headResponse.status}, Content-Type: ${contentType}`);

      if (
        headResponse.status === 200 &&
        contentType && contentType.startsWith('image/')
      ) {
        const elapsed = Date.now() - startTime;
        console.log(`[Favicon Extractor] ✅ Successfully found favicon at: ${url}`);
        console.log(`[Favicon Extractor] ⏱️  Total time: ${elapsed}ms\n`);
        return url;
      } else {
        console.log(`[Favicon Extractor]   ⏭️  Skipping: Invalid status or content type`);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.warn(`[Favicon Extractor]   ⏰ Timeout: ${url}`);
      } else if (error.response) {
        console.warn(`[Favicon Extractor]   ⚠️  HTTP ${error.response.status}: ${url}`);
      } else {
        console.warn(`[Favicon Extractor]   ❌ Error (${error.code || error.message}): ${url}`);
      }
    }
  }

  // Final fallback: Try Google's favicon service with maximum size
  console.log('[Favicon Extractor] 🌐 All standard URLs failed, trying Google favicon service as last resort...');
  try {
    const domain = new URL(website).hostname;
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    console.log(`[Favicon Extractor] 🔎 Attempting Google favicon service: ${googleFaviconUrl}`);

    const headResponse = await axios.head(googleFaviconUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      validateStatus: (status) => status < 400,
      timeout: 10000,
    });

    const contentType = headResponse.headers['content-type'];
    console.log(`[Favicon Extractor]   📡 Response: Status ${headResponse.status}, Content-Type: ${contentType}`);

    if (
      headResponse.status === 200 &&
      contentType && contentType.startsWith('image/')
    ) {
      const elapsed = Date.now() - startTime;
      console.log(`[Favicon Extractor] ✅ Successfully retrieved favicon from Google service for ${domain}`);
      console.log(`[Favicon Extractor] ⏱️  Total time: ${elapsed}ms\n`);
      return googleFaviconUrl;
    } else {
      console.warn(`[Favicon Extractor] ⚠️  Google favicon service returned invalid response`);
    }
  } catch (error) {
    console.error(`[Favicon Extractor] ❌ Google favicon service failed for ${website}:`, error.message);
  }

  const elapsed = Date.now() - startTime;
  console.error(`[Favicon Extractor] ❌ FAILED: Could not find any valid favicon for ${website}`);
  console.log(`[Favicon Extractor] ⏱️  Total time: ${elapsed}ms\n`);
  return null;
}

/**
 * Checks if a logo file exists in the specified directory.
 *
 * @param {string} appDir - Directory to check for logo
 * @param {string} productName - Name of the product
 * @returns {string|null} - Path to the logo if it exists, null otherwise
 */
function checkExistingLogo(appDir, productName) {
  const fs = require('fs');
  const path = require('path');
  const existingLogoPath = path.join(appDir, 'logo.png');

  console.log(`[Favicon Extractor] 🖼️  Checking for existing logo at: ${existingLogoPath}`);

  if (fs.existsSync(existingLogoPath)) {
    const logoPath = `/static/images/product/${productName}/logo.png`;
    console.log(`[Favicon Extractor] ✅ Found existing logo for ${productName}: ${logoPath}`);
    return logoPath;
  }

  console.log(`[Favicon Extractor] 🔍 No existing logo found for ${productName}`);
  return null;
}

module.exports = {
  sanitizeTitle,
  extractHighestResFavicon,
  checkExistingLogo,
};

