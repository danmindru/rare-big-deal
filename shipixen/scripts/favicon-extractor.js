const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { extractAppStoreIcon } = require('./appstore');
const { downloadImage, writeFileAtomic } = require('./image-downloader');
const { inspectMedia, inspectMediaFile } = require('./lib/media-bytes');

const APPLE_ICON_PATHS = [
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
  '/apple-icon.png',
  '/apple-touch-icon-180x180.png',
  '/apple-touch-icon-152x152.png',
  '/apple-touch-icon-120x120.png',
];

const FAVICON_PATHS = ['/icon.png', '/favicon-32x32.png', '/favicon.png', '/favicon.ico'];

// A real icon that is only slightly under the 32px listing minimum can be
// scaled up. Anything smaller is not a usable logo and is left for the next
// candidate, including the Google favicon service.
const UPSCALE_FLOOR = 16;

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

function pushIconUrl(urls, seen, href, base) {
  if (!href) return;
  let absolute;
  try {
    absolute = new URL(href, base);
  } catch {
    return;
  }
  if (absolute.protocol !== 'http:' && absolute.protocol !== 'https:') return;
  if (absolute.pathname.toLowerCase().endsWith('.svg')) return;
  const hrefString = absolute.href;
  if (seen.has(hrefString)) return;
  seen.add(hrefString);
  urls.push(hrefString);
}

function iconSize(sizes) {
  const match = String(sizes || '').match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return 0;
  return Math.min(Number(match[1]), Number(match[2]));
}

function collectHtmlIcons($) {
  const apple = [];
  const other = [];
  if (!$) return { apple, other };
  $('link[href]').each((index, element) => {
    const rel = String($(element).attr('rel') || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (rel.includes('mask-icon') || rel.includes('preload') || rel.includes('stylesheet')) return;
    const appleTouch =
      rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed');
    const icon = appleTouch || rel.includes('icon') || rel.includes('shortcut');
    if (!icon) return;
    const type = String($(element).attr('type') || '').toLowerCase();
    if (type.includes('svg')) return;
    const href = $(element).attr('href');
    const entry = { href, size: iconSize($(element).attr('sizes')), index };
    (appleTouch ? apple : other).push(entry);
  });
  const byPreference = (a, b) => b.size - a.size || a.index - b.index;
  apple.sort(byPreference);
  other.sort(byPreference);
  return { apple, other };
}

/**
 * Icon URLs to try, best first. HTML is optional: a missing parse still tries
 * the well-known icon paths on the product origin and, last, Google's favicon
 * service. SVG icons are omitted.
 */
async function logoCandidateUrls($, website, appStoreImageUrl = null) {
  const urls = [];
  const seen = new Set();
  const origin = new URL(website).origin;

  if ($ && String(website).includes('apps.apple.com')) {
    try {
      const appStoreIcon = await extractAppStoreIcon($, website);
      pushIconUrl(urls, seen, appStoreIcon, website);
    } catch (error) {
      console.warn(`[Favicon Extractor] App Store icon was not used: ${error.message}`);
    }
  }

  const htmlIcons = collectHtmlIcons($);
  for (const entry of htmlIcons.apple) pushIconUrl(urls, seen, entry.href, website);
  for (const iconPath of APPLE_ICON_PATHS) pushIconUrl(urls, seen, iconPath, origin);
  for (const entry of htmlIcons.other) pushIconUrl(urls, seen, entry.href, website);
  for (const iconPath of FAVICON_PATHS) pushIconUrl(urls, seen, iconPath, origin);
  pushIconUrl(urls, seen, appStoreImageUrl, website);

  const domain = new URL(website).hostname;
  pushIconUrl(
    urls,
    seen,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`,
    website,
  );

  return urls;
}

async function extractHighestResFavicon($, website, appStoreImageUrl = null) {
  const urls = await logoCandidateUrls($, website, appStoreImageUrl);
  return urls[0] || null;
}

function canUpscale(inspection) {
  if (!inspection || !inspection.width || !inspection.height) return false;
  const minSide = Math.min(inspection.width, inspection.height);
  return minSide >= UPSCALE_FLOOR && (inspection.width < 32 || inspection.height < 32);
}

async function upscaleLogo(png, inspection) {
  const scale = 32 / Math.min(inspection.width, inspection.height);
  const width = Math.max(32, Math.round(inspection.width * scale));
  const height = Math.max(32, Math.round(inspection.height * scale));
  return sharp(png)
    .resize(width, height, { kernel: sharp.kernel.nearest, fit: 'fill' })
    .png()
    .toBuffer();
}

/**
 * GET each candidate and keep the first image that decodes at logo size.
 * A smaller real icon is remembered and scaled only when nothing larger exists.
 * The previous logo.png is replaced only after a usable PNG is ready.
 */
async function acquireProductLogo(options) {
  const candidates = await logoCandidateUrls(options.$, options.website, options.appStoreImageUrl);
  console.log(`[Favicon Extractor] ${candidates.length} logo candidate(s) for ${options.website}`);
  const partialPath = `${options.outputPath}.partial`;
  let bestSmall = null;

  const loadCandidate = async (url) => {
    const saved = await downloadImage(url, partialPath, {
      maxRetries: options.maxRetries ?? 0,
      timeoutMs: options.timeoutMs ?? 10000,
      maxBytes: options.maxBytes ?? 4_000_000,
      lookup: options.lookup,
      requestImpl: options.requestImpl,
      getBytes: options.getBytes,
    });
    if (!saved) return null;
    try {
      return await fs.promises.readFile(partialPath);
    } finally {
      await fs.promises.rm(partialPath, { force: true });
    }
  };

  try {
    for (const url of candidates) {
      const png = await loadCandidate(url);
      if (!png) continue;
      const inspection = await inspectMedia(png, 'logo');
      if (inspection.ok) {
        await writeFileAtomic(options.outputPath, png);
        console.log(`[Favicon Extractor] ✅ Logo ${inspection.width}x${inspection.height} from ${url}`);
        return { url, inspection, resized: false };
      }
      if (canUpscale(inspection)) {
        const area = inspection.width * inspection.height;
        if (!bestSmall || area > bestSmall.area) {
          bestSmall = { url, png, inspection, area };
        }
        console.log(
          `[Favicon Extractor] ${url} is ${inspection.width}x${inspection.height}, below logo size; continuing`,
        );
        continue;
      }
      console.log(`[Favicon Extractor] Skipping ${url}: ${inspection.reason}`);
    }

    if (bestSmall) {
      const resized = await upscaleLogo(bestSmall.png, bestSmall.inspection);
      const inspection = await inspectMedia(resized, 'logo');
      if (inspection.ok) {
        await writeFileAtomic(options.outputPath, resized);
        console.log(
          `[Favicon Extractor] ✅ Scaled ${bestSmall.inspection.width}x${bestSmall.inspection.height} logo from ${bestSmall.url} to ${inspection.width}x${inspection.height}`,
        );
        return { url: bestSmall.url, inspection, resized: true };
      }
    }
    return null;
  } finally {
    await fs.promises.rm(partialPath, { force: true });
  }
}

/**
 * Checks if a usable logo file exists in the specified directory.
 *
 * @param {string} appDir - Directory to check for logo
 * @param {string} productName - Name of the product
 * @returns {Promise<string|null>} - Public path when the file decodes at logo size
 */
async function checkExistingLogo(appDir, productName) {
  const existingLogoPath = path.join(appDir, 'logo.png');
  console.log(`[Favicon Extractor] 🖼️  Checking for existing logo at: ${existingLogoPath}`);
  const inspection = await inspectMediaFile(existingLogoPath, 'logo');
  if (!inspection.ok) {
    console.log(`[Favicon Extractor] 🔍 No usable logo for ${productName}: ${inspection.reason}`);
    return null;
  }
  const logoPath = `/static/images/product/${productName}/logo.png`;
  console.log(`[Favicon Extractor] ✅ Found existing logo for ${productName}: ${logoPath}`);
  return logoPath;
}

module.exports = {
  acquireProductLogo,
  checkExistingLogo,
  extractHighestResFavicon,
  logoCandidateUrls,
  sanitizeTitle,
};
