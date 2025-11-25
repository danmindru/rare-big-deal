const axios = require('axios');
const cheerio = require('cheerio');
const { extractAppStoreImages } = require('./appstore');
const { sanitizeTitle } = require('./favicon-extractor');

/**
 * Extracts JSON-LD structured data from the page.
 *
 * @param {object} $ - Cheerio instance with loaded HTML
 * @returns {object|null} - Parsed JSON-LD data or null if not found
 */
function extractJsonLd($) {
  console.log('[Website Scraper] 🔍 Looking for JSON-LD structured data...');

  try {
    // Look for JSON-LD script tags
    const jsonLdScripts = $('script[type="application/ld+json"]');

    if (jsonLdScripts.length === 0) {
      console.log('[Website Scraper] 📋 No JSON-LD scripts found');
      return null;
    }

    console.log(`[Website Scraper] 📋 Found ${jsonLdScripts.length} JSON-LD script(s)`);

    // Find the SoftwareApplication schema
    let softwareAppData = null;

    jsonLdScripts.each((index, element) => {
      try {
        const scriptContent = $(element).html();
        if (!scriptContent) return;

        const jsonData = JSON.parse(scriptContent);

        // Check if this is a SoftwareApplication schema
        if (jsonData['@type'] === 'SoftwareApplication') {
          console.log(`[Website Scraper] ✅ Found SoftwareApplication schema at index ${index}`);
          softwareAppData = jsonData;
          return false; // Break the loop
        }
      } catch (parseError) {
        console.warn(
          `[Website Scraper] ⚠️  Failed to parse JSON-LD at index ${index}:`,
          parseError.message,
        );
      }
    });

    if (!softwareAppData) {
      console.log('[Website Scraper] 📋 No SoftwareApplication schema found');
      return null;
    }

    // Extract and normalize the relevant fields
    const extractedData = {
      name: softwareAppData.name || null,
      description: softwareAppData.description || null,
      applicationCategory: softwareAppData.applicationCategory || null,
      operatingSystem: softwareAppData.operatingSystem || null,
      availableOnDevice: softwareAppData.availableOnDevice || null,
      price: softwareAppData.offers?.price || null,
      priceCurrency: softwareAppData.offers?.priceCurrency || null,
      ratingValue: softwareAppData.aggregateRating?.ratingValue || null,
      reviewCount: softwareAppData.aggregateRating?.reviewCount || null,
      authorName: softwareAppData.author?.name || null,
      authorUrl: softwareAppData.author?.url || null,
    };

    console.log('[Website Scraper] ✅ Extracted JSON-LD data:', {
      name: extractedData.name,
      category: extractedData.applicationCategory,
      price: extractedData.price,
      rating: extractedData.ratingValue,
      reviewCount: extractedData.reviewCount,
    });

    return extractedData;
  } catch (error) {
    console.error('[Website Scraper] ❌ Failed to extract JSON-LD:', error.message);
    return null;
  }
}

/**
 * Fetches and extracts metadata from a website.
 *
 * @param {string} website - The URL of the website to scrape
 * @returns {Promise<object>} - Object containing og:image, description, title, etc.
 */
async function fetchWebsiteData(website) {
  console.log(`\n[Website Scraper] 🌐 Fetching data from: ${website}`);
  const startTime = Date.now();

  let description = '';
  let title = '';
  let appStoreImageUrl = null;

  try {
    console.log('[Website Scraper] 📡 Making HTTP request...');
    const response = await axios.get(website, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 30000, // 30 second timeout
    });

    console.log(`[Website Scraper] ✅ HTTP ${response.status} - Parsing HTML...`);
    const $ = cheerio.load(response.data);

    let ogImageUrl = $('meta[property="og:image"]').attr('content');
    let ogImageUrls = []; // Array for multiple images

    // Special handling for Apple App Store URLs to extract all images
    if (website.includes('apps.apple.com')) {
      console.log('[Website Scraper] 📱 Detected App Store URL, extracting images...');
      const appStoreImages = await extractAppStoreImages($, website);
      if (appStoreImages && appStoreImages.length > 0) {
        ogImageUrls = appStoreImages;
        ogImageUrl = appStoreImages[0]; // Keep first image for backward compatibility
        console.log(`[Website Scraper] ✅ Found ${appStoreImages.length} App Store images`);
      }
    }

    console.log('[Website Scraper] 🔍 Extracting metadata...');
    description = $('meta[name="description"]').attr('content');

    // Get only the first title element to handle cases where there are multiple (invalid HTML)
    title =
      $('title').first().text() ||
      $('meta[property="og:title"]').attr('content');

    // Sanitize the title
    title = sanitizeTitle(title);

    console.log(`[Website Scraper] 📝 Extracted title: "${title}"`);
    console.log(`[Website Scraper] 📄 Extracted description: "${description?.substring(0, 100)}${description?.length > 100 ? '...' : ''}"`);

    // Extract JSON-LD structured data
    const jsonLdData = extractJsonLd($);

    // Ensure the URLs are absolute
    if (ogImageUrl && !ogImageUrl.startsWith('http')) {
      ogImageUrl = new URL(ogImageUrl, website).href;
      console.log(`[Website Scraper] 🔗 Converted OG image to absolute URL: ${ogImageUrl}`);
    } else if (ogImageUrl) {
      console.log(`[Website Scraper] 🖼️  Found OG image: ${ogImageUrl}`);
    } else {
      console.log(`[Website Scraper] 📋 No OG image found`);
    }

    // Try to find the app store image
    console.log('[Website Scraper] 🔍 Looking for App Store artwork...');
    const appStoreImageSource = $(
      'picture.we-artwork source[type="image/jpeg"], picture.we-artwork source[type="image/webp"], picture.we-artwork source[type="image/png"]',
    ).attr('srcset');

    if (appStoreImageSource) {
      // Get the first image URL from the srcset
      const firstEntry = appStoreImageSource.split(',')[0];
      appStoreImageUrl = firstEntry.trim().split(' ')[0];

      // Ensure the URL is absolute
      if (appStoreImageUrl && !appStoreImageUrl.startsWith('http')) {
        appStoreImageUrl = new URL(appStoreImageUrl, website).href;
      }
      console.log(`[Website Scraper] ✅ Found App Store artwork: ${appStoreImageUrl}`);
    } else {
      console.log(`[Website Scraper] 📋 No App Store artwork found`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Website Scraper] ✅ Successfully scraped website data`);
    console.log(`[Website Scraper] ⏱️  Total time: ${elapsed}ms\n`);

    return {
      $, // Return the Cheerio instance for additional parsing
      ogImageUrl,
      ogImageUrls,
      appStoreImageUrl,
      description,
      title,
      jsonLd: jsonLdData, // Include JSON-LD data
    };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Website Scraper] ❌ Failed to fetch website data from ${website}:`, error.message);
    console.error(`[Website Scraper] Stack trace:`, error.stack);
    console.log(`[Website Scraper] ⏱️  Failed after: ${elapsed}ms\n`);

    return {
      $: null,
      ogImageUrl: null,
      ogImageUrls: [],
      appStoreImageUrl: null,
      description,
      title,
      jsonLd: null,
    };
  }
}

module.exports = {
  fetchWebsiteData,
};
