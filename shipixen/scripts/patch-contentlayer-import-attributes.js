const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// @shipixen/core@1.0.2 always emits `assert { type: 'json' }` in
// `.contentlayer/generated/*.mjs`. Node 22 removed import assertions, so
// Contentlayer's onSuccess import of that file throws
// SyntaxError: Unexpected identifier 'assert'.
// contentlayer2 uses `with` on Node 18.20+, 20.10+, and 21+, and `assert` before that.
const ORIGINAL = [
  '    // NOTE Type assert statements for `.json` files are neccessary from Node v16.14 onwards',
  '    const needsJsonAssertStatement = nodeVersionMajor > 16 || (nodeVersionMajor === 16 && nodeVersionMinor >= 14);',
  "    const assertStatement = needsJsonAssertStatement ? ` assert { type: 'json' }` : '';",
].join('\n');

const PATCHED = [
  '    // `with` on Node 18.20+, 20.10+, and 21+. `assert` is a SyntaxError on Node 22+.',
  '    const supportsImportAttributes =',
  '        nodeVersionMajor > 20 ||',
  '        (nodeVersionMajor === 18 && nodeVersionMinor >= 20) ||',
  '        (nodeVersionMajor === 20 && nodeVersionMinor >= 10);',
  '    const needsJsonAssertStatement = nodeVersionMajor > 16 || (nodeVersionMajor === 16 && nodeVersionMinor >= 14);',
  '    const assertStatement = supportsImportAttributes',
  "        ? ` with { type: 'json' }`",
  '        : needsJsonAssertStatement',
  "          ? ` assert { type: 'json' }`",
  "          : '';",
].join('\n');

const shipixenRoot = path.resolve(__dirname, '..');
const GENERATOR = path.join(
  'node_modules',
  '@shipixen',
  'core',
  'dist',
  'generation',
  'generate-dotpkg.js',
);

function findGenerators(dir, acc = []) {
  const direct = path.join(dir, GENERATOR);
  if (fs.existsSync(direct)) acc.push(direct);

  const modulesDir = path.join(dir, 'node_modules');
  let entries;
  try {
    entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '.bin') continue;
    const entryPath = path.join(modulesDir, entry.name);
    if (entry.name.startsWith('@')) {
      let scoped;
      try {
        scoped = fs.readdirSync(entryPath);
      } catch {
        continue;
      }
      for (const name of scoped) {
        if (fs.existsSync(path.join(entryPath, name, 'node_modules'))) {
          findGenerators(path.join(entryPath, name), acc);
        }
      }
      continue;
    }
    if (fs.existsSync(path.join(entryPath, 'node_modules'))) {
      findGenerators(entryPath, acc);
    }
  }

  return acc;
}

function patchFile(target) {
  const source = fs.readFileSync(target, 'utf8');
  if (source.includes(PATCHED)) {
    console.log(
      `patch-contentlayer-import-attributes: already patched ${target}`,
    );
    return;
  }
  if (!source.includes(ORIGINAL)) {
    console.error(
      `patch-contentlayer-import-attributes: unexpected @shipixen/core generator at ${target}`,
    );
    process.exit(1);
  }

  const next = source.replace(ORIGINAL, PATCHED);
  fs.writeFileSync(target, next);
  const check = spawnSync(process.execPath, ['--check', target], {
    encoding: 'utf8',
  });
  if (check.status !== 0) {
    fs.writeFileSync(target, source);
    console.error(check.stderr || check.stdout);
    process.exit(check.status || 1);
  }
  console.log(`patch-contentlayer-import-attributes: patched ${target}`);
}

function main() {
  const targets = findGenerators(shipixenRoot);
  if (targets.length === 0) {
    console.error(
      'patch-contentlayer-import-attributes: @shipixen/core is not installed.',
    );
    process.exit(1);
  }
  for (const target of targets) patchFile(target);
}

main();
