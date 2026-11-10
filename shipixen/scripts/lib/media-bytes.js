const fs = require('fs');
const sharp = require('sharp');

// Documented listing sizes. A smaller file can still be a real download and
// still be rejected here because it is not usable as the logo or the banner.
const LIMITS = {
  logo: { minWidth: 32, minHeight: 32 },
  banner: { minWidth: 400, minHeight: 200 },
};

function mediaKind(buffer) {
  if (!buffer || buffer.length < 4) return null;
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return buffer.includes(Buffer.from('IEND')) ? 'png' : null;
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return buffer.length >= 4 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9
      ? 'jpeg'
      : null;
  }
  const gif = buffer.subarray(0, 6).toString('ascii');
  if (gif === 'GIF87a' || gif === 'GIF89a') {
    return buffer[buffer.length - 1] === 0x3b ? 'gif' : null;
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00 && buffer.length > 22) {
    return 'ico';
  }
  const head = buffer.subarray(0, 400).toString('utf8').trim().toLowerCase();
  if (head.startsWith('<!doctype html') || head.startsWith('<html') || head.startsWith('<head')) {
    return 'html';
  }
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
  return null;
}

async function inspectMedia(buffer, role) {
  const limits = LIMITS[role];
  if (!limits) {
    return { ok: false, status: 'fail', reason: `unknown media role ${role}` };
  }
  if (!buffer || buffer.length === 0) {
    return { ok: false, status: 'fail', reason: 'image is empty' };
  }
  const kind = mediaKind(buffer);
  if (kind === 'html') {
    return { ok: false, status: 'fail', reason: 'HTML was returned where an image was required' };
  }
  if (kind === 'svg') {
    return { ok: false, status: 'fail', reason: 'SVG is not used as a logo or banner' };
  }
  try {
    const meta = await sharp(buffer, { failOn: 'error' }).metadata();
    if (!meta.width || !meta.height) {
      return { ok: false, status: 'fail', reason: 'image has no decodable dimensions' };
    }
    if (meta.width < limits.minWidth || meta.height < limits.minHeight) {
      return {
        ok: false,
        status: 'fail',
        width: meta.width,
        height: meta.height,
        format: meta.format,
        reason: `${meta.width}x${meta.height} is below the usable ${role} size of ${limits.minWidth}x${limits.minHeight}`,
      };
    }
    return {
      ok: true,
      status: 'pass',
      width: meta.width,
      height: meta.height,
      format: meta.format,
      reason: `${role} decoded at ${meta.width}x${meta.height}`,
    };
  } catch {
    return { ok: false, status: 'fail', reason: 'file is not a decodable image' };
  }
}

async function inspectMediaFile(filePath, role) {
  if (!filePath || !fs.existsSync(filePath)) {
    return { ok: false, status: 'fail', reason: 'image file is missing' };
  }
  return inspectMedia(fs.readFileSync(filePath), role);
}

module.exports = {
  LIMITS,
  inspectMedia,
  inspectMediaFile,
  mediaKind,
};
