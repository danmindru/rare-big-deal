const assert = require('node:assert/strict');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { describe, test } = require('node:test');
const cheerio = require('cheerio');
const sharp = require('sharp');

const { fetchAssets } = require('./asset-fetcher');
const { acquireProductLogo, logoCandidateUrls } = require('./favicon-extractor');
const { convertIcoToPng, downloadImage } = require('./image-downloader');
const { decodeIco } = require('./lib/ico');
const { guardedFetch, pinnedAddressLookup } = require('./lib/guarded-fetch');
const { inspectMedia } = require('./lib/media-bytes');

const PUBLIC_LOOKUP = async () => [{ address: '1.1.1.1', family: 4 }];

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

async function png(width, height, color = { r: 30, g: 90, b: 160, alpha: 1 }) {
  return sharp({
    create: { width, height, channels: 4, background: color },
  })
    .png()
    .toBuffer();
}

function wrapPngAsIco(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuffer]);
}

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

describe('pinned address lookup', () => {
  test('returns the pinned address as a list when Node asks for every family', () => {
    const lookup = pinnedAddressLookup('shop.example', '1.1.1.1');
    const listed = lookupResult(lookup, 'shop.example', { all: true });
    assert.deepEqual(listed, [{ address: '1.1.1.1', family: 4 }]);
    const single = lookupResult(lookup, 'shop.example', {});
    assert.deepEqual(single, ['1.1.1.1', 4]);
  });

  test('rejects a different host and a family the pin does not have', () => {
    const lookup = pinnedAddressLookup('shop.example', '2001:db8::1');
    const wrongHost = lookupResult(lookup, 'evil.example', { all: true });
    assert.equal(wrongHost.code, 'dns');
    const wrongFamily = lookupResult(lookup, 'shop.example', { all: true, family: 4 });
    assert.equal(wrongFamily.code, 'ENOTFOUND');
  });

  test('fetches a public page through the pinned lookup', { timeout: 20000 }, async () => {
    const response = await guardedFetch('https://example.com/', {
      timeoutMs: 15000,
      maxBytes: 1_000_000,
    });
    assert.equal(response.status, 200);
    assert.ok(response.body.length > 100);
    assert.ok(net.isIP(response.hops[0].pinned) > 0);
  });
});

describe('logo bytes', () => {
  test('decodes a 32-bit ICO bitmap with the top row first', () => {
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);
    header.writeInt32LE(2, 4);
    header.writeInt32LE(4, 8);
    header.writeUInt16LE(1, 12);
    header.writeUInt16LE(32, 14);
    const pixels = Buffer.from([
      255, 0, 0, 255, // bottom-left blue
      0, 0, 0, 0, // bottom-right transparent
      0, 0, 255, 255, // top-left red
      0, 255, 0, 255, // top-right green
    ]);
    const mask = Buffer.alloc(8);
    const dib = Buffer.concat([header, pixels, mask]);
    const directory = Buffer.alloc(22);
    directory.writeUInt16LE(1, 2);
    directory.writeUInt16LE(1, 4);
    directory.writeUInt8(2, 6);
    directory.writeUInt8(2, 7);
    directory.writeUInt32LE(dib.length, 14);
    directory.writeUInt32LE(22, 18);
    const decoded = decodeIco(Buffer.concat([directory, dib]));
    assert.equal(decoded.width, 2);
    assert.equal(decoded.height, 2);
    assert.equal(decoded.rgba[0], 255);
    assert.equal(decoded.rgba[1], 0);
    assert.equal(decoded.rgba[2], 0);
    assert.equal(decoded.rgba[4], 0);
    assert.equal(decoded.rgba[5], 255);
    assert.equal(decoded.rgba[8], 0);
    assert.equal(decoded.rgba[9], 0);
    assert.equal(decoded.rgba[10], 255);
    assert.equal(decoded.rgba[15], 0);
  });

  test('converts an ICO written at the logo path without deleting it', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-ico-'));
    const logoPath = path.join(dir, 'logo.png');
    const source = wrapPngAsIco(await png(48, 48), 48, 48);
    fs.writeFileSync(logoPath, source);
    await convertIcoToPng(logoPath, logoPath);
    const inspection = await inspectMedia(fs.readFileSync(logoPath), 'logo');
    assert.equal(inspection.ok, true);
    assert.equal(inspection.width, 48);
    assert.equal(inspection.height, 48);
    assert.equal(inspection.format, 'png');
  });

  test('converts favicon.ico?hash from the bytes when the response is not labeled image/*', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-query-ico-'));
    const output = path.join(dir, 'logo.png');
    const methods = [];
    const saved = await downloadImage('https://icons.example/favicon.ico?hash=abc', output, {
      maxRetries: 0,
      lookup: PUBLIC_LOOKUP,
      requestImpl: async (url, pinned, options) => {
        methods.push(options.method || 'GET');
        assert.equal(url.search, '?hash=abc');
        assert.equal(pinned, '1.1.1.1');
        return {
          status: 200,
          headers: { 'content-type': 'application/octet-stream' },
          body: wrapPngAsIco(await png(40, 40), 40, 40),
        };
      },
    });
    assert.equal(saved, true);
    assert.deepEqual(methods, ['GET']);
    const inspection = await inspectMedia(fs.readFileSync(output), 'logo');
    assert.equal(inspection.ok, true);
    assert.equal(inspection.width, 40);
  });

  test('leaves an existing logo in place when the response is HTML', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-html-logo-'));
    const output = path.join(dir, 'logo.png');
    const original = await png(48, 48);
    fs.writeFileSync(output, original);
    const saved = await downloadImage('https://icons.example/favicon.ico', output, {
      maxRetries: 0,
      lookup: PUBLIC_LOOKUP,
      requestImpl: async () => ({
        status: 200,
        headers: { 'content-type': 'image/png' },
        body: Buffer.from('<!DOCTYPE html><html></html>'),
      }),
    });
    assert.equal(saved, false);
    assert.equal(fs.readFileSync(output).equals(original), true);
  });
});

describe('logo candidates', () => {
  test('tries origin icons and Google when the page could not be parsed', async () => {
    const urls = await logoCandidateUrls(null, 'https://gamma.example/pricing');
    assert.equal(urls[0], 'https://gamma.example/apple-touch-icon.png');
    assert.ok(urls.includes('https://gamma.example/favicon.ico'));
    assert.equal(
      urls.at(-1),
      'https://www.google.com/s2/favicons?domain=gamma.example&sz=256',
    );
    assert.equal(urls.some((url) => url.includes('.svg')), false);
  });

  test('prefers an apple touch icon over an svg and keeps a hashed favicon', async () => {
    const $ = cheerio.load(`
      <link rel="icon" type="image/svg+xml" href="/favicon.svg">
      <link rel="icon" href="/favicon.ico?hash=abc">
      <link rel="apple-touch-icon" href="/cozy.png">
    `);
    const urls = await logoCandidateUrls($, 'https://cozy.example/');
    assert.equal(urls[0], 'https://cozy.example/cozy.png');
    assert.ok(urls.includes('https://cozy.example/favicon.ico?hash=abc'));
    assert.equal(urls.some((url) => url.endsWith('.svg')), false);
    assert.ok(urls.indexOf('https://cozy.example/favicon.ico?hash=abc') < urls.indexOf('https://cozy.example/favicon.ico'));
  });

  test('keeps fetching until a candidate decodes at logo size', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-pick-'));
    const output = path.join(dir, 'logo.png');
    const seen = [];
    const small = await png(16, 16);
    const icon = wrapPngAsIco(await png(48, 48), 48, 48);
    const result = await acquireProductLogo({
      $: cheerio.load(`
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="icon" href="/favicon.ico?hash=1">
      `),
      website: 'https://icons.example/app',
      outputPath: output,
      getBytes: async (url) => {
        seen.push(url);
        const parsed = new URL(url);
        if (parsed.pathname === '/apple-touch-icon.png') return small;
        if (parsed.pathname === '/favicon.ico') return icon;
        return null;
      },
    });
    assert.equal(result.url, 'https://icons.example/favicon.ico?hash=1');
    assert.equal(result.resized, false);
    assert.equal(seen.some((url) => url.includes('google.com')), false);
    const inspection = await inspectMedia(fs.readFileSync(output), 'logo');
    assert.equal(inspection.ok, true);
    assert.equal(inspection.width, 48);
    assert.equal(fs.existsSync(`${output}.partial`), false);
  });

  test('scales a real sub-32 icon only when every candidate is that small', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-scale-'));
    const output = path.join(dir, 'logo.png');
    const tiny = await png(19, 21);
    const result = await acquireProductLogo({
      $: cheerio.load('<link rel="icon" href="/favicon.ico?favicon.abc.ico">'),
      website: 'https://www.uprankly.example/link-builder',
      outputPath: output,
      getBytes: async (url) => {
        const parsed = new URL(url);
        if (parsed.pathname === '/favicon.ico' || parsed.hostname === 'www.google.com') return tiny;
        return null;
      },
    });
    assert.equal(result.resized, true);
    assert.equal(result.url, 'https://www.uprankly.example/favicon.ico?favicon.abc.ico');
    const inspection = await inspectMedia(fs.readFileSync(output), 'logo');
    assert.equal(inspection.ok, true);
    assert.ok(inspection.width >= 32);
    assert.ok(inspection.height >= 32);
  });

  test('does not open a socket for a private icon url', async () => {
    let hits = 0;
    const server = net.createServer((socket) => {
      hits += 1;
      socket.destroy();
    });
    const port = await listen(server);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-logo-private-'));
    const requested = [];
    try {
      const result = await acquireProductLogo({
        $: cheerio.load(`
          <link rel="apple-touch-icon" href="http://127.0.0.1/secret.png">
          <link rel="apple-touch-icon" href="http://127.0.0.1:${port}/secret.png">
          <link rel="icon" href="https://cdn.example/icon.png">
        `),
        website: 'https://cdn.example/deal',
        outputPath: path.join(dir, 'logo.png'),
        lookup: PUBLIC_LOOKUP,
        requestImpl: async (url) => {
          requested.push(url.href);
          if (url.hostname === 'cdn.example' && url.pathname === '/icon.png') {
            return { status: 200, headers: {}, body: await png(48, 48) };
          }
          return { status: 404, headers: {}, body: Buffer.from('missing') };
        },
      });
      assert.equal(result.url, 'https://cdn.example/icon.png');
      assert.equal(requested.some((href) => href.includes('127.0.0.1')), false);
      assert.equal(hits, 0);
    } finally {
      await closeServer(server);
    }
  });
});

describe('asset generation', () => {
  test('keeps an existing banner in MDX image data when the page parse is missing', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-assets-'));
    const product = path.join(root, 'product', 'gamma');
    fs.mkdirSync(product, { recursive: true });
    fs.writeFileSync(path.join(product, 'og-image.png'), await png(800, 420));
    const app = {
      name: 'Gamma',
      website: 'https://gamma.example',
      description: 'A paid tool.',
      deal: '25% off',
    };
    await fetchAssets(app, {
      outputDir: root,
      fetchWebsiteData: async () => emptySite(),
      acquireProductLogo: async ({ outputPath }) => {
        fs.writeFileSync(outputPath, await png(48, 48));
        return { url: 'https://gamma.example/apple-touch-icon.png', resized: false };
      },
    });
    assert.deepEqual(app.images, ['/static/images/product/gamma/og-image.png']);
    assert.equal(app.logo, '/static/images/product/gamma/logo.png');
    const logo = await inspectMedia(fs.readFileSync(path.join(product, 'logo.png')), 'logo');
    assert.equal(logo.ok, true);
  });

  test('fails instead of succeeding with no usable logo', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-no-logo-'));
    const app = { name: 'Gamma', website: 'https://gamma.example', description: 'A paid tool.', deal: '25% off' };
    await assert.rejects(
      () =>
        fetchAssets(app, {
          outputDir: root,
          fetchWebsiteData: async () => emptySite(),
          ensureUsableBanner: async () => ({
            source: null,
            inspection: { ok: false, status: 'fail', reason: 'missing' },
          }),
          acquireProductLogo: async () => null,
        }),
      /No usable logo\.png for gamma/,
    );
    assert.equal(app.logo, undefined);
  });
});

function lookupResult(lookup, host, options) {
  let settled;
  lookup(host, options, (error, address, family) => {
    settled = error || (options.all ? address : [address, family]);
  });
  return settled;
}
