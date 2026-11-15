const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { PassThrough } = require('node:stream');
const { describe, test } = require('node:test');
const sharp = require('sharp');

const { fetchAssets } = require('./asset-fetcher');
const { downloadImage } = require('./image-downloader');
const { ensureUsableBanner } = require('./lib/banner-fallback');
const { detectBotChallenge } = require('./lib/bot-challenge');
const { captureWebsiteScreenshot } = require('./lib/screenshot-fallback');
const { fetchWebsiteData } = require('./website-scraper');

const FIXTURE = path.join(__dirname, 'fixtures', 'bot-challenge', 'cloudflare.html');
const PUBLIC_LOOKUP = async () => [{ address: '1.1.1.1', family: 4 }];

function readFixture() {
  return fs.readFileSync(FIXTURE);
}

function challengePage(headers = {}) {
  return {
    status: 403,
    headers,
    body: readFixture(),
  };
}

async function png(width, height) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 20, g: 40, b: 60, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

describe('bot challenge detection', () => {
  test('a Cloudflare challenge fixture is a challenge from its title and body', () => {
    const html = readFixture().toString('utf8');
    const result = detectBotChallenge({
      title: 'Just a moment...',
      body: html,
    });
    assert.equal(result.challenged, true);
    assert.match(result.reason, /Just a moment/);
    assert.match(html, /Performing security verification/);
    assert.match(html, /Verifying you are human/);
    assert.match(html, /Checking your browser/);
  });

  test('cf-mitigated: challenge and the known interstitial phrases are refused', () => {
    assert.equal(
      detectBotChallenge({ headers: { 'cf-mitigated': 'challenge' } }).challenged,
      true,
    );
    assert.match(
      detectBotChallenge({ headers: { 'CF-Mitigated': 'challenge' } }).reason,
      /cf-mitigated: challenge/,
    );
    for (const phrase of [
      'Performing security verification',
      'Verifying you are human',
      'Checking your browser',
    ]) {
      const result = detectBotChallenge({ title: 'Example', body: `<p>${phrase}</p>` });
      assert.equal(result.challenged, true, phrase);
      assert.match(result.reason, new RegExp(phrase));
    }
    assert.equal(
      detectBotChallenge({
        headers: { 'cf-mitigated': 'none' },
        title: 'NeoTiler — window manager',
        body: '<p>Snap windows on macOS.</p>',
      }).challenged,
      false,
    );
  });
});

describe('bot challenge banners are not saved', () => {
  test('the scraper reports the fixture and does not invent an og:image', async () => {
    const page = await fetchWebsiteData('https://shop.example/', {
      lookup: PUBLIC_LOOKUP,
      requestImpl: async () => challengePage({ 'cf-mitigated': 'challenge' }),
    });
    assert.equal(page.botChallenge.challenged, true);
    assert.match(page.botChallenge.reason, /cf-mitigated: challenge/);
    assert.equal(page.title, 'Just a moment...');
    assert.equal(page.ogImageUrl || null, null);
  });

  test('an image download of the fixture is not written and is not retried', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-image-'));
    const output = path.join(dir, 'og-image.png');
    let attempts = 0;
    const saved = await downloadImage('https://shop.example/og.png', output, {
      lookup: PUBLIC_LOOKUP,
      onAttempt: () => {
        attempts += 1;
      },
      requestImpl: async () => challengePage({ 'cf-mitigated': 'challenge' }),
    });
    assert.equal(saved, false);
    assert.equal(attempts, 1);
    assert.equal(fs.existsSync(output), false);
  });

  test('a missing banner stays missing when the page is the fixture', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-banner-'));
    const imagePath = path.join(dir, 'og-image.png');
    fs.writeFileSync(imagePath, readFixture());
    let captures = 0;
    const result = await ensureUsableBanner({
      imagePath,
      website: 'https://shop.example/',
      botChallenge: detectBotChallenge({
        title: 'Just a moment...',
        body: readFixture().toString('utf8'),
      }),
      capture: async () => {
        captures += 1;
        return { ok: true, inspection: { ok: true, status: 'pass', reason: 'unused' } };
      },
    });
    assert.equal(captures, 0);
    assert.equal(result.source, null);
    assert.equal(result.inspection.ok, false);
    assert.match(result.inspection.reason, /not saved as a banner/);
    assert.equal(fs.existsSync(imagePath), false);
  });

  test('a usable official og:image is kept when the page is also a challenge', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-official-'));
    const imagePath = path.join(dir, 'og-image.png');
    const banner = await png(800, 420);
    fs.writeFileSync(imagePath, banner);
    let captures = 0;
    const result = await ensureUsableBanner({
      imagePath,
      website: 'https://shop.example/',
      botChallenge: { challenged: true, reason: 'response header cf-mitigated: challenge' },
      capture: async () => {
        captures += 1;
        return { ok: false, inspection: { ok: false, status: 'fail', reason: 'should not run' } };
      },
    });
    assert.equal(result.source, 'og-image');
    assert.equal(captures, 0);
    assert.equal(fs.readFileSync(imagePath).equals(banner), true);
  });

  test('the screenshot fallback does not start a browser for the fixture', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-shot-'));
    const outputPath = path.join(dir, 'og-image.png');
    fs.writeFileSync(outputPath, Buffer.from('stale-challenge'));
    let spawned = false;
    const result = await captureWebsiteScreenshot({
      url: 'https://shop.example/',
      outputPath,
      lookup: PUBLIC_LOOKUP,
      fetchPage: async () => challengePage({ 'cf-mitigated': 'challenge' }),
      spawnImpl: () => {
        spawned = true;
        throw new Error('browser started');
      },
    });
    assert.equal(spawned, false);
    assert.equal(result.ok, false);
    assert.match(result.inspection.reason, /cf-mitigated: challenge/);
    assert.equal(fs.existsSync(outputPath), false);
  });

  test('a rendered challenge page is deleted instead of saved as the banner', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-dom-'));
    const outputPath = path.join(dir, 'og-image.png');
    const banner = await png(800, 420);
    let dumpDom = false;
    const result = await captureWebsiteScreenshot({
      url: 'https://shop.example/',
      outputPath,
      lookup: PUBLIC_LOOKUP,
      fetchPage: async () => ({
        status: 200,
        headers: {},
        body: Buffer.from('<html><title>Shop</title><body>Hello</body></html>'),
      }),
      spawnImpl: (bin, args) => {
        dumpDom = args.includes('--dump-dom');
        const child = new EventEmitter();
        child.stdout = new PassThrough();
        child.pid = 0;
        child.unref = () => {};
        child.kill = () => {};
        setImmediate(() => {
          fs.writeFileSync(outputPath, banner);
          child.stdout.end(readFixture());
          child.emit('exit', 0);
        });
        return child;
      },
    });
    assert.equal(dumpDom, true);
    assert.equal(result.ok, false);
    assert.match(result.inspection.reason, /not saved as a banner/);
    assert.equal(fs.existsSync(outputPath), false);
  });

  test('asset fetch leaves the banner missing and still keeps a real og:image', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-assets-'));
    const challenged = {
      name: 'Gamma',
      website: 'https://shop.example/',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(challenged, {
      outputDir: root,
      fetchWebsiteData: async () => ({
        $: null,
        ogImageUrl: null,
        ogImageUrls: [],
        appStoreImageUrl: null,
        description: 'A paid tool.',
        title: 'Just a moment...',
        jsonLd: null,
        botChallenge: detectBotChallenge({
          title: 'Just a moment...',
          body: readFixture().toString('utf8'),
        }),
      }),
      ensureUsableBanner: async (args) => {
        assert.equal(args.botChallenge.challenged, true);
        return ensureUsableBanner({
          ...args,
          capture: async () => {
            throw new Error('screenshot should not run');
          },
        });
      },
      acquireProductLogo: async ({ outputPath }) => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, await png(64, 64));
        return { url: 'https://shop.example/icon.png', resized: false };
      },
    });
    assert.equal(fs.existsSync(path.join(root, 'product', 'gamma', 'og-image.png')), false);
    assert.deepEqual(challenged.images, []);

    const withImage = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-challenge-og-'));
    const official = await png(800, 420);
    const app = {
      name: 'Gamma',
      website: 'https://shop.example/',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(app, {
      outputDir: withImage,
      fetchWebsiteData: async () => ({
        $: null,
        ogImageUrl: 'https://shop.example/og.png',
        ogImageUrls: [],
        appStoreImageUrl: null,
        description: 'A paid tool.',
        title: 'Just a moment...',
        jsonLd: null,
        botChallenge: { challenged: true, reason: 'response header cf-mitigated: challenge' },
      }),
      downloadMultipleImages: async (urls, appDir, productName, options) => {
        const imagePath = options.placeFile('og-image.png');
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
        fs.writeFileSync(imagePath, official);
        return [options.publicPath('og-image.png', imagePath)];
      },
      ensureUsableBanner: async (args) =>
        ensureUsableBanner({
          ...args,
          capture: async () => {
            throw new Error('screenshot should not replace the og image');
          },
        }),
      acquireProductLogo: async ({ outputPath }) => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, await png(64, 64));
        return { url: 'https://shop.example/icon.png', resized: false };
      },
    });
    assert.deepEqual(app.images, ['/static/images/product/gamma/og-image.png']);
    assert.equal(
      fs.readFileSync(path.join(withImage, 'product', 'gamma', 'og-image.png')).equals(official),
      true,
    );
  });
});
