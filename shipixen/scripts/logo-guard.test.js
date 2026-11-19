const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { describe, test } = require('node:test');
const sharp = require('sharp');

const { fetchAssets } = require('./asset-fetcher');
const { acquireProductLogo } = require('./favicon-extractor');
const { downloadImage } = require('./image-downloader');
const { inspectMedia } = require('./lib/media-bytes');

function emptySite() {
  return {
    $: null,
    ogImageUrl: null,
    ogImageUrls: [],
    appStoreImageUrl: null,
    description: '',
    title: '',
    jsonLd: null,
  };
}

async function png(width, height, color = { r: 30, g: 90, b: 160, alpha: 1 }) {
  return sharp({
    create: { width, height, channels: 4, background: color },
  })
    .png()
    .toBuffer();
}

function timeoutError() {
  const error = new Error('DNS timeout');
  error.code = 'ETIMEDOUT';
  return error;
}

const PUBLIC_LOOKUP = async () => [{ address: '1.1.1.1', family: 4 }];

function publishingRepo(slug) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-guard-'));
  const images = path.join(repo, 'shipixen', 'public', 'static', 'images');
  fs.mkdirSync(path.join(repo, 'shipixen', 'archive'), { recursive: true });
  return {
    repo,
    images,
    productLogo: path.join(images, 'product', slug, 'logo.png'),
    productBanner: path.join(images, 'product', slug, 'og-image.png'),
    overrideLogo: path.join(images, 'overrides', slug, 'logo.png'),
  };
}

describe('logo replacement guard', () => {
  test('a timed-out icon fetch keeps the existing logo and does not save a smaller favicon', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-timeout-'));
    const output = path.join(dir, 'logo.png');
    const original = await png(180, 180, { r: 8, g: 8, b: 8, alpha: 1 });
    fs.writeFileSync(output, original);
    const seen = [];
    const result = await acquireProductLogo({
      $: null,
      website: 'https://upto.example/pricing',
      outputPath: output,
      getBytes: async (url) => {
        seen.push(url);
        const parsed = new URL(url);
        if (parsed.hostname === 'www.google.com') return png(64, 64);
        throw timeoutError();
      },
    });
    assert.equal(result.keptExisting, true);
    assert.equal(result.inspection.width, 180);
    assert.equal(fs.readFileSync(output).equals(original), true);
    assert.equal(fs.existsSync(`${output}.partial`), false);
    assert.ok(seen.some((url) => url.includes('google.com')));
    assert.ok(seen.some((url) => url.includes('apple-touch-icon')));
  });

  test('an upscaled tiny favicon does not replace a larger logo', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-upscale-keep-'));
    const output = path.join(dir, 'logo.png');
    const original = await png(96, 96);
    fs.writeFileSync(output, original);
    const result = await acquireProductLogo({
      $: null,
      website: 'https://labex.example/',
      outputPath: output,
      getBytes: async () => png(16, 16),
    });
    assert.equal(result.keptExisting, true);
    assert.equal(result.resized, false);
    assert.equal(fs.readFileSync(output).equals(original), true);
  });

  test('a larger decoded logo still replaces a smaller one', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-upgrade-'));
    const output = path.join(dir, 'logo.png');
    fs.writeFileSync(output, await png(32, 32));
    const result = await acquireProductLogo({
      $: null,
      website: 'https://icons.example/app',
      outputPath: output,
      getBytes: async (url) => {
        const parsed = new URL(url);
        if (parsed.pathname === '/apple-touch-icon.png') return png(256, 256);
        return null;
      },
    });
    assert.equal(result.keptExisting, undefined);
    assert.equal(result.inspection.width, 256);
    const inspection = await inspectMedia(fs.readFileSync(output), 'logo');
    assert.equal(inspection.width, 256);
  });

  test('a fetch timeout leaves the existing logo bytes untouched', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-dns-'));
    const output = path.join(dir, 'logo.png');
    const original = await png(128, 128, { r: 4, g: 5, b: 6, alpha: 1 });
    fs.writeFileSync(output, original);
    const result = await acquireProductLogo({
      $: null,
      website: 'https://pdf.example/',
      outputPath: output,
      getBytes: async () => {
        throw timeoutError();
      },
    });
    assert.equal(result, null);
    assert.equal(fs.readFileSync(output).equals(original), true);
    assert.equal(fs.readdirSync(dir).some((name) => name.includes('.tmp') || name.includes('.partial')), false);
  });

  test('the logo fetcher never writes under public/static/images/overrides', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-override-write-'));
    const output = path.join(
      dir,
      'public',
      'static',
      'images',
      'overrides',
      'cleanclip',
      'logo.png',
    );
    const owner = await png(512, 512, { r: 1, g: 2, b: 3, alpha: 1 });
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, owner);
    let fetched = 0;
    const result = await acquireProductLogo({
      $: null,
      website: 'https://cleanclip.example/',
      outputPath: output,
      getBytes: async () => {
        fetched += 1;
        return png(64, 64);
      },
    });
    assert.equal(result, null);
    assert.equal(fetched, 0);
    assert.equal(fs.readFileSync(output).equals(owner), true);
    assert.equal(fs.readdirSync(path.dirname(output)).length, 1);
  });

  test('a smaller og image does not replace a larger one, and a timeout leaves it untouched', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-og-guard-'));
    const output = path.join(dir, 'og-image.png');
    const original = await png(800, 420, { r: 12, g: 24, b: 36, alpha: 1 });
    fs.writeFileSync(output, original);
    const kept = await downloadImage('https://cdn.example/og.png', output, {
      maxRetries: 0,
      lookup: PUBLIC_LOOKUP,
      requestImpl: async () => ({
        status: 200,
        headers: { 'content-type': 'image/png' },
        body: await png(400, 210),
      }),
    });
    assert.equal(kept, true);
    assert.equal(fs.readFileSync(output).equals(original), true);

    const timedOut = await downloadImage('https://cdn.example/og.png', output, {
      maxRetries: 0,
      lookup: PUBLIC_LOOKUP,
      requestImpl: async () => {
        throw timeoutError();
      },
    });
    assert.equal(timedOut, false);
    assert.equal(fs.readFileSync(output).equals(original), true);

    const overridePath = path.join(dir, 'public', 'static', 'images', 'overrides', 'deskrest', 'og-image.png');
    fs.mkdirSync(path.dirname(overridePath), { recursive: true });
    fs.writeFileSync(overridePath, original);
    let requested = 0;
    const refused = await downloadImage('https://cdn.example/og.png', overridePath, {
      maxRetries: 0,
      lookup: PUBLIC_LOOKUP,
      requestImpl: async () => {
        requested += 1;
        return { status: 200, headers: {}, body: await png(1200, 630) };
      },
    });
    assert.equal(refused, false);
    assert.equal(requested, 0);
    assert.equal(fs.readFileSync(overridePath).equals(original), true);
  });

  test('a page-fetch timeout keeps the existing logo and banner', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-page-timeout-'));
    const product = path.join(root, 'product', 'boltai-3');
    fs.mkdirSync(product, { recursive: true });
    const logo = await png(128, 128);
    const banner = await png(800, 420);
    fs.writeFileSync(path.join(product, 'logo.png'), logo);
    fs.writeFileSync(path.join(product, 'og-image.png'), banner);
    const app = {
      name: 'BoltAI 3',
      website: 'https://boltai.example/',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(app, {
      outputDir: root,
      overrides: {},
      fetchWebsiteData: async () => {
        throw timeoutError();
      },
      acquireProductLogo: async () => {
        throw new Error('logo fetch must not run after the page timed out');
      },
      downloadMultipleImages: async () => {
        throw new Error('banner fetch must not run after the page timed out');
      },
    });
    assert.equal(fs.readFileSync(path.join(product, 'logo.png')).equals(logo), true);
    assert.equal(fs.readFileSync(path.join(product, 'og-image.png')).equals(banner), true);
    assert.equal(app.logo, '/static/images/product/boltai-3/logo.png');
  });

  test('fetchAssets keeps a larger logo when later candidates are small favicons', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-fetch-keep-'));
    const product = path.join(root, 'product', 'upto');
    fs.mkdirSync(product, { recursive: true });
    const logo = await png(522, 522, { r: 7, g: 7, b: 7, alpha: 1 });
    const banner = await png(800, 420);
    fs.writeFileSync(path.join(product, 'logo.png'), logo);
    fs.writeFileSync(path.join(product, 'og-image.png'), banner);
    const app = {
      name: 'Upto',
      website: 'https://upto.example/',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(app, {
      outputDir: root,
      overrides: {},
      fetchWebsiteData: async () => emptySite(),
      ensureUsableBanner: async ({ imagePath }) => ({
        source: 'og-image',
        inspection: await inspectMedia(fs.readFileSync(imagePath), 'banner'),
      }),
      acquireProductLogo: (options) =>
        acquireProductLogo({
          ...options,
          getBytes: async (url) => {
            if (new URL(url).hostname === 'www.google.com') return png(64, 64);
            throw timeoutError();
          },
        }),
    });
    assert.equal(fs.readFileSync(path.join(product, 'logo.png')).equals(logo), true);
    assert.equal(fs.readFileSync(path.join(product, 'og-image.png')).equals(banner), true);
    assert.equal(app.logo, '/static/images/product/upto/logo.png');
  });

  test('a product whose slug has an override is not replaced and overrides are not written', async () => {
    const { images, productLogo, productBanner, overrideLogo } = publishingRepo('gamma');
    const logo = await png(180, 180, { r: 9, g: 1, b: 1, alpha: 1 });
    const banner = await png(800, 420, { r: 1, g: 9, b: 1, alpha: 1 });
    const owner = await png(512, 512, { r: 1, g: 1, b: 9, alpha: 1 });
    fs.mkdirSync(path.dirname(productLogo), { recursive: true });
    fs.mkdirSync(path.dirname(overrideLogo), { recursive: true });
    fs.writeFileSync(productLogo, logo);
    fs.writeFileSync(productBanner, banner);
    fs.writeFileSync(overrideLogo, owner);
    const app = {
      name: 'Gamma',
      website: 'https://gamma.example/',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(app, {
      outputDir: images,
      overrides: {
        gamma: { ogImage: 'public/static/images/overrides/page-ai/og-image.png' },
      },
      fetchWebsiteData: async () => ({
        ...emptySite(),
        ogImageUrl: 'https://gamma.example/locale-og.png',
      }),
      downloadMultipleImages: async () => {
        throw new Error('an overridden product image must not be downloaded');
      },
      acquireProductLogo: async () => {
        throw new Error('an overridden product logo must not be replaced');
      },
    });
    assert.equal(fs.readFileSync(productLogo).equals(logo), true);
    assert.equal(fs.readFileSync(productBanner).equals(banner), true);
    assert.equal(fs.readFileSync(overrideLogo).equals(owner), true);
    assert.equal(app.images[0], '/static/images/overrides/page-ai/og-image.png');
    assert.equal(app.logo, '/static/images/product/gamma/logo.png');
  });

  test('a pinned product logo is left in place and is not diverted into overrides', async () => {
    const { repo, images, productLogo, overrideLogo } = publishingRepo('cleanclip');
    const historical = await png(256, 256, { r: 2, g: 2, b: 2, alpha: 1 });
    const owner = await png(512, 512, { r: 3, g: 3, b: 3, alpha: 1 });
    const record = path.join(repo, 'shipixen', 'archive', '2024', 'products', 'cleanclip.mdx');
    fs.mkdirSync(path.dirname(productLogo), { recursive: true });
    fs.mkdirSync(path.dirname(overrideLogo), { recursive: true });
    fs.mkdirSync(path.dirname(record), { recursive: true });
    fs.writeFileSync(productLogo, historical);
    fs.writeFileSync(overrideLogo, owner);
    fs.writeFileSync(record, 'logo: /static/images/product/cleanclip/logo.png\n');
    const app = {
      name: 'CleanClip',
      website: 'https://cleanclip.example/',
      description: 'A clipboard manager.',
      deal: '30% off',
    };
    await fetchAssets(app, {
      outputDir: images,
      overrides: {},
      fetchWebsiteData: async () => ({
        ...emptySite(),
        ogImageUrl: 'https://cleanclip.example/og.png',
      }),
      downloadMultipleImages: async (urls, appDir, productName, options) => {
        const imagePath = options.placeFile('og-image.png');
        assert.equal(String(imagePath).split(path.sep).includes('overrides'), false);
        return [];
      },
      ensureUsableBanner: async ({ imagePath }) => {
        assert.equal(String(imagePath).split(path.sep).includes('overrides'), false);
        return { source: null, inspection: { ok: false, status: 'fail', reason: 'missing' } };
      },
      acquireProductLogo: async () => {
        throw new Error('a pinned logo must not be fetched into overrides');
      },
    });
    assert.equal(fs.readFileSync(productLogo).equals(historical), true);
    assert.equal(fs.readFileSync(overrideLogo).equals(owner), true);
    assert.equal(app.logo, '/static/images/product/cleanclip/logo.png');
  });
});
