const fs = require('fs');
const path = require('path');
const { sanitizeName } = require('./sanitize-name');
const { markdownDir } = require('./settings');

function expectedProductFilenames(apps) {
  return new Set((apps || []).map((app) => `${sanitizeName(app.name)}.mdx`));
}

/**
 * Delete product pages whose names are no longer in the README.
 * The README is the source of truth. Files that are still listed are kept
 * even if a later asset fetch fails to refresh them.
 */
function pruneProducts(apps, dir = path.join(__dirname, markdownDir)) {
  const keep = expectedProductFilenames(apps);
  if (!fs.existsSync(dir)) return [];

  const removed = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.mdx')) continue;
    if (keep.has(file)) continue;
    fs.unlinkSync(path.join(dir, file));
    removed.push(file);
  }
  return removed.sort();
}

function selfTest() {
  const os = require('os');
  const assert = require('assert');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-prune-'));
  fs.writeFileSync(path.join(dir, 'keep-me.mdx'), 'keep');
  fs.writeFileSync(path.join(dir, 'sip.mdx'), 'sip');
  fs.writeFileSync(path.join(dir, 'drop-me.mdx'), 'drop');
  fs.writeFileSync(path.join(dir, '.gitkeep'), '');

  const removed = pruneProducts([{ name: 'Keep Me' }, { name: 'Sip' }], dir);
  assert.deepStrictEqual(removed, ['drop-me.mdx']);
  assert.strictEqual(fs.existsSync(path.join(dir, 'keep-me.mdx')), true);
  assert.strictEqual(fs.existsSync(path.join(dir, 'sip.mdx')), true);
  assert.strictEqual(fs.existsSync(path.join(dir, '.gitkeep')), true);
  assert.strictEqual(fs.existsSync(path.join(dir, 'drop-me.mdx')), false);

  const removedAll = pruneProducts([], dir);
  assert.deepStrictEqual(removedAll, ['keep-me.mdx', 'sip.mdx']);
  assert.strictEqual(fs.readdirSync(dir).includes('.gitkeep'), true);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('[prune-products] self-test passed');
}

module.exports = { pruneProducts, expectedProductFilenames };

if (require.main === module) {
  selfTest();
}
