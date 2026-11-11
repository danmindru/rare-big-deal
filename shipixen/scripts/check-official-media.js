const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { inspectMediaFile } = require('./lib/media-bytes');

// Official English Saventify marketing image supplied by the owner.
// 1672×941, not a crop and not an auto-fetched locale capture.
const SAVENTIFY_OVERRIDE = 'public/static/images/overrides/saventify/og-image.png';
const SAVENTIFY_URL = '/static/images/overrides/saventify/og-image.png';
const SAVENTIFY_SHA256 = '4f48807c5541c62b5cc7d8c1f56e5e601149bbad33fead9879b06a564b298c3d';
const SAVENTIFY_WIDTH = 1672;
const SAVENTIFY_HEIGHT = 941;

function loadOverrides(root) {
  const file = path.join(root, 'shipixen', 'data', 'config', 'product-overrides.js');
  if (!fs.existsSync(file)) return null;
  const resolved = require.resolve(file);
  delete require.cache[resolved];
  const loaded = require(file);
  return loaded && loaded.overrides ? loaded.overrides : null;
}

function configuredBanner(entry) {
  if (!entry) return null;
  if (Array.isArray(entry.ogImages) && entry.ogImages.length > 0) return entry.ogImages[0];
  if (typeof entry.ogImage === 'string') return entry.ogImage;
  return null;
}

function publicImageUrl(overridePath) {
  if (typeof overridePath !== 'string') return null;
  if (!overridePath.startsWith('public/static/images/overrides/') || overridePath.includes('..')) {
    return null;
  }
  return `/${overridePath.slice('public/'.length)}`;
}

function firstListedImage(mdx) {
  const start = mdx.indexOf('\nimages:');
  if (start === -1) return null;
  const lines = mdx.slice(start + 1).split('\n');
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith('  ')) break;
    const item = line.match(/^ {2}- (.+)$/);
    if (item) return item[1].trim();
  }
  return null;
}

/**
 * Owner/official media overrides win. A product page that still points at an
 * auto-fetched /static/images/product banner fails when an override is configured.
 */
async function checkConfiguredOverrides(root) {
  const errors = [];
  const overrides = loadOverrides(root);
  if (!overrides) {
    errors.push('product-overrides.js is missing or has no overrides');
    return errors;
  }
  for (const [slug, entry] of Object.entries(overrides)) {
    const banner = configuredBanner(entry);
    if (!banner) continue;
    const url = publicImageUrl(banner);
    if (!url) {
      errors.push(
        `${slug}: official media override must stay under public/static/images/overrides/`,
      );
      continue;
    }
    const file = path.join(root, 'shipixen', banner);
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      errors.push(`${slug}: override banner is missing or empty`);
      continue;
    }
    const inspection = await inspectMediaFile(file, 'banner');
    if (!inspection.ok) {
      errors.push(`${slug}: override banner ${inspection.reason}`);
    }
    const mdxFile = path.join(root, 'shipixen', 'data', 'products', `${slug}.mdx`);
    if (!fs.existsSync(mdxFile)) {
      errors.push(`${slug}: product page is missing, so the override banner is not served`);
      continue;
    }
    const image = firstListedImage(fs.readFileSync(mdxFile, 'utf8'));
    if (image !== url) {
      errors.push(
        `${slug}: product page banner is ${image || 'missing'}, not the official override ${url}`,
      );
    }
  }
  return errors;
}

async function checkSaventifyArtwork(root) {
  const errors = [];
  const overrides = loadOverrides(root);
  const configured = overrides ? configuredBanner(overrides.saventify) : null;
  if (configured !== SAVENTIFY_OVERRIDE) {
    errors.push(
      `Saventify must use the official English override banner ${SAVENTIFY_OVERRIDE}`,
    );
  }
  const file = path.join(root, 'shipixen', SAVENTIFY_OVERRIDE);
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    errors.push('Saventify official banner is missing or empty');
    return errors;
  }
  const bytes = fs.readFileSync(file);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== SAVENTIFY_SHA256) {
    errors.push('Saventify banner is not the official English marketing image');
  }
  const inspection = await inspectMediaFile(file, 'banner');
  if (!inspection.ok) {
    errors.push(`Saventify official banner ${inspection.reason}`);
  } else if (inspection.width !== SAVENTIFY_WIDTH || inspection.height !== SAVENTIFY_HEIGHT) {
    errors.push(
      `Saventify official banner is ${inspection.width}x${inspection.height}, not the full ${SAVENTIFY_WIDTH}x${SAVENTIFY_HEIGHT} artwork`,
    );
  }
  const mdxFile = path.join(root, 'shipixen', 'data', 'products', 'saventify.mdx');
  const mdx = fs.existsSync(mdxFile) ? fs.readFileSync(mdxFile, 'utf8') : '';
  if (firstListedImage(mdx) !== SAVENTIFY_URL) {
    errors.push('Saventify product page must point at the official English override banner');
  }
  if (mdx.includes('/static/images/product/saventify/og-image.png')) {
    errors.push('Saventify product page still points at an auto-fetched OG image');
  }
  return errors;
}

async function checkOfficialMedia(root) {
  const configured = await checkConfiguredOverrides(root);
  const saventify = await checkSaventifyArtwork(root);
  return [...configured, ...saventify];
}

async function main() {
  const root = path.join(__dirname, '..', '..');
  const errors = await checkOfficialMedia(root);
  if (errors.length > 0) {
    console.error(`[check-official-media] ${errors.length} official-media error(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log('[check-official-media] official override banners match the pages that serve them');
}

module.exports = {
  SAVENTIFY_OVERRIDE,
  SAVENTIFY_URL,
  SAVENTIFY_SHA256,
  checkConfiguredOverrides,
  checkSaventifyArtwork,
  checkOfficialMedia,
  firstListedImage,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`[check-official-media] ${error.message}`);
    process.exit(1);
  });
}
