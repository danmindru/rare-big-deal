const fs = require('fs');
const os = require('os');
const path = require('path');

const TEXT_EXTENSIONS = new Set([
  '.md',
  '.mdx',
  '.js',
  '.json',
  '.yml',
  '.yaml',
  '.html',
  '.css',
  '.txt',
  '.ts',
  '.tsx',
]);

// A local site path, not the same characters inside https://host/static/images/...
const PUBLIC_REF = /(?<![\w./:])(\/static\/images\/[^\s)\]"'`>]+)/g;
const RELATIVE_REF = /(?:^|[\s("'`:])((?:\.\.\/)+images\/[^\s)\]"'`>]+)/g;
const ARCHIVE_RELATIVE_REF =
  /(?:^|[\s("'`:])(images\/(?:product|overrides)\/[^\s)\]"'`>]+)/g;

function walkTextFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTextFiles(full, out);
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function mediaKind(buf) {
  if (!buf || buf.length < 4) return null;
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return buf.includes(Buffer.from('IEND')) ? 'png' : null;
  }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return buf.length >= 4 && buf[buf.length - 2] === 0xff && buf[buf.length - 1] === 0xd9
      ? 'jpeg'
      : null;
  }
  const gif = buf.subarray(0, 6).toString('ascii');
  if (gif === 'GIF87a' || gif === 'GIF89a') {
    return buf[buf.length - 1] === 0x3b ? 'gif' : null;
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'webp';
  }
  if (buf.length >= 12 && buf.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buf.subarray(8, 12).toString('ascii');
    if (brand === 'avif' || brand === 'avis' || brand === 'mif1' || brand === 'msf1') return 'avif';
  }
  // Favicons were saved with a .png name. 00 00 01 00 is an ICO.
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00 && buf.length > 22) {
    return 'ico';
  }
  const head = buf.subarray(0, 400).toString('utf8').trim().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html') || head.startsWith('<head')) {
    return 'html';
  }
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
  return null;
}

function inside(parent, child) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel));
}

function readUnique(refs, text, pattern) {
  pattern.lastIndex = 0;
  let match;
  while ((match = pattern.exec(text))) refs.add(match[1]);
}

/**
 * Historical archive pages keep their original /static/images URLs.
 * Those files have to exist in public/ and be the same bytes as the
 * archived copy, and they have to be real media rather than an HTML page.
 * Relative links inside an archive year have to resolve inside that year.
 */
function checkArchiveMedia(root) {
  const errors = [];
  const archiveRoot = path.join(root, 'shipixen', 'archive');
  const publicRoot = path.join(root, 'shipixen', 'public');
  const canonical2025 = path.join(archiveRoot, '2025', 'images');
  if (!fs.existsSync(archiveRoot)) {
    return ['archive directory is missing'];
  }

  const publicRefs = new Map();
  const relativeRefs = [];

  for (const file of walkTextFiles(archiveRoot)) {
    const text = fs.readFileSync(file, 'utf8');
    const foundPublic = new Set();
    const foundRelative = new Set();
    readUnique(foundPublic, text, PUBLIC_REF);
    readUnique(foundRelative, text, RELATIVE_REF);
    readUnique(foundRelative, text, ARCHIVE_RELATIVE_REF);
    for (const ref of foundPublic) {
      if (!publicRefs.has(ref)) publicRefs.set(ref, file);
    }
    for (const ref of foundRelative) relativeRefs.push({ file, ref });
  }

  for (const [ref, fromFile] of publicRefs) {
    const publicFile = path.join(publicRoot, ref.replace(/^\//, ''));
    const label = `${path.relative(root, fromFile)} -> ${ref}`;
    if (!inside(publicRoot, publicFile)) {
      errors.push(`${label} escapes the public directory`);
      continue;
    }
    if (!fs.existsSync(publicFile)) {
      errors.push(`${label} is not in public/ (historical URL would return HTML)`);
      continue;
    }
    const bytes = fs.readFileSync(publicFile);
    const kind = mediaKind(bytes);
    if (kind === 'html' || kind === null) {
      errors.push(`${label} is ${kind === 'html' ? 'HTML' : 'not decodable media'} at ${path.relative(root, publicFile)}`);
      continue;
    }
    const tail = ref.replace(/^\/static\/images\//, '');
    const archived = path.join(canonical2025, tail);
    if (fs.existsSync(archived)) {
      const archivedBytes = fs.readFileSync(archived);
      if (!bytes.equals(archivedBytes)) {
        errors.push(`${label} does not match the archived image ${path.relative(root, archived)}`);
      }
    }
  }

  for (const { file, ref } of relativeRefs) {
    const resolved = path.resolve(path.dirname(file), ref);
    const label = `${path.relative(root, file)} -> ${ref}`;
    if (!inside(archiveRoot, resolved)) {
      errors.push(`${label} escapes the archive`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      errors.push(`${label} is missing`);
      continue;
    }
    const kind = mediaKind(fs.readFileSync(resolved));
    if (kind === 'html' || kind === null) {
      errors.push(`${label} is ${kind === 'html' ? 'HTML' : 'not decodable media'}`);
    }
  }

  return { errors, publicRefs: publicRefs.size, relativeRefs: relativeRefs.length };
}

function writePng(file) {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, png);
  return png;
}

function selfTest() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-archive-media-'));
  try {
    const archive = path.join(root, 'shipixen', 'archive');
    const record = path.join(archive, '2024', 'products', 'widget.mdx');
    const page2025 = path.join(archive, '2025', 'products', 'widget.mdx');
    const publicFile = path.join(root, 'shipixen', 'public', 'static', 'images', 'product', 'widget', 'logo.png');
    const archivedFile = path.join(archive, '2025', 'images', 'product', 'widget', 'logo.png');
    fs.mkdirSync(path.dirname(record), { recursive: true });
    fs.writeFileSync(
      record,
      [
        'logo: /static/images/product/widget/logo.png',
        'also: https://example.com/static/images/logo-square.png',
      ].join('\n'),
    );
    fs.mkdirSync(path.dirname(page2025), { recursive: true });
    fs.writeFileSync(page2025, 'logo: ../images/product/widget/logo.png\n');

    const missing = checkArchiveMedia(root);
    assertIncludes(missing.errors, 'widget/logo.png', 'missing public file');
    assertNotIncludes(missing.errors, 'example.com', 'external url was treated as local');

    fs.mkdirSync(path.dirname(publicFile), { recursive: true });
    fs.writeFileSync(publicFile, Buffer.from('<!DOCTYPE html><html><body>missing</body></html>'));
    const html = checkArchiveMedia(root);
    assertIncludes(html.errors, 'HTML', 'html body was accepted as media');

    const png = writePng(publicFile);
    writePng(archivedFile);
    const restored = checkArchiveMedia(root);
    if (restored.errors.length !== 0) {
      throw new Error(`expected a matching png to pass, got ${restored.errors.join('; ')}`);
    }

    fs.writeFileSync(publicFile, Buffer.concat([png, Buffer.from('nope')]));
    const mismatch = checkArchiveMedia(root);
    assertIncludes(mismatch.errors, 'does not match', 'byte mismatch was ignored');

    writePng(publicFile);
    fs.rmSync(archivedFile);
    const brokenRelative = checkArchiveMedia(root);
    assertIncludes(brokenRelative.errors, '../images/product/widget/logo.png', 'broken 2025 relative link was ignored');

    writePng(archivedFile);
    const ok = checkArchiveMedia(root);
    if (ok.errors.length !== 0) {
      throw new Error(`expected restored fixture to pass, got ${ok.errors.join('; ')}`);
    }
    if (ok.publicRefs !== 1 || ok.relativeRefs !== 1) {
      throw new Error(`expected 1 public and 1 relative ref, got ${ok.publicRefs} and ${ok.relativeRefs}`);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
  console.log('[check-archive-media] self-test passed');
}

function assertIncludes(errors, needle, message) {
  if (!errors.some((error) => error.includes(needle))) {
    throw new Error(`${message}: ${errors.join('; ') || '(no errors)'}`);
  }
}

function assertNotIncludes(errors, needle, message) {
  if (errors.some((error) => error.includes(needle))) {
    throw new Error(`${message}: ${errors.join('; ')}`);
  }
}

function main() {
  selfTest();
  const root = path.join(__dirname, '..', '..');
  const { errors, publicRefs, relativeRefs } = checkArchiveMedia(root);
  if (errors.length > 0) {
    console.error(`[check-archive-media] ${errors.length} broken archive media reference(s)`);
    for (const error of errors.slice(0, 40)) console.error(`- ${error}`);
    if (errors.length > 40) console.error(`- … ${errors.length - 40} more`);
    process.exit(1);
  }
  console.log(
    `[check-archive-media] ${publicRefs} historical public image(s), ${relativeRefs} archive-relative image reference(s)`,
  );
}

module.exports = { checkArchiveMedia, mediaKind };

if (require.main === module) {
  main();
}
