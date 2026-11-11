const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { describe, test } = require('node:test');
const sharp = require('sharp');
const {
  checkConfiguredOverrides,
  checkOfficialMedia,
} = require('./check-official-media');

const repoRoot = path.join(__dirname, '..', '..');

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

function writeOverrides(root, source) {
  const file = path.join(root, 'shipixen', 'data', 'config', 'product-overrides.js');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, source);
}

describe('official media overrides', () => {
  test('fails when the product page still serves an auto-fetched banner', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-official-'));
    const banner = 'public/static/images/overrides/gamma/og-image.png';
    fs.mkdirSync(path.join(root, 'shipixen', path.dirname(banner)), { recursive: true });
    fs.writeFileSync(path.join(root, 'shipixen', banner), await png(800, 420));
    writeOverrides(
      root,
      `module.exports = { overrides: { gamma: { ogImage: '${banner}' } } };`,
    );
    const products = path.join(root, 'shipixen', 'data', 'products');
    fs.mkdirSync(products, { recursive: true });
    fs.writeFileSync(
      path.join(products, 'gamma.mdx'),
      '---\nimages:\n  - /static/images/product/gamma/og-image.png\n---\n',
    );
    const errors = await checkConfiguredOverrides(root);
    assert.equal(
      errors.some((error) => error.includes('gamma') && error.includes('official override')),
      true,
    );

    fs.writeFileSync(
      path.join(products, 'gamma.mdx'),
      '---\nimages:\n  - /static/images/overrides/gamma/og-image.png\n---\n',
    );
    assert.deepEqual(await checkConfiguredOverrides(root), []);
  });

  test('fails when a configured override banner is empty or too small', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-official-small-'));
    const banner = 'public/static/images/overrides/gamma/og-image.png';
    const file = path.join(root, 'shipixen', banner);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.alloc(0));
    writeOverrides(
      root,
      `module.exports = { overrides: { gamma: { ogImage: '${banner}' } } };`,
    );
    fs.mkdirSync(path.join(root, 'shipixen', 'data', 'products'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'shipixen', 'data', 'products', 'gamma.mdx'),
      '---\nimages:\n  - /static/images/overrides/gamma/og-image.png\n---\n',
    );
    const empty = await checkConfiguredOverrides(root);
    assert.equal(empty.some((error) => error.includes('missing or empty')), true);

    fs.writeFileSync(file, await png(32, 32));
    const tiny = await checkConfiguredOverrides(root);
    assert.equal(tiny.some((error) => error.includes('below the usable banner size')), true);
  });

  test('the live site serves the official English Saventify banner from its override', async () => {
    const errors = await checkOfficialMedia(repoRoot);
    assert.deepEqual(errors, []);
  });
});
