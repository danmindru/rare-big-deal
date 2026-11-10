const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function isPng(buffer) {
  return buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_MAGIC);
}

function readIcoEntries(buffer) {
  if (!buffer || buffer.length < 22) return [];
  if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) return [];
  const count = buffer.readUInt16LE(4);
  const entries = [];
  for (let index = 0; index < count; index += 1) {
    const at = 6 + index * 16;
    if (at + 16 > buffer.length) break;
    const width = buffer[at] || 256;
    const height = buffer[at + 1] || 256;
    const bytes = buffer.readUInt32LE(at + 8);
    const offset = buffer.readUInt32LE(at + 12);
    if (bytes <= 0 || offset <= 0 || offset + bytes > buffer.length) continue;
    entries.push({
      width,
      height,
      image: buffer.subarray(offset, offset + bytes),
    });
  }
  entries.sort((a, b) => b.width * b.height - a.width * a.height);
  return entries;
}

function decodeDib(dib, directoryWidth, directoryHeight) {
  if (dib.length < 40) throw new Error('ICO bitmap header is truncated');
  const headerSize = dib.readUInt32LE(0);
  if (headerSize < 40 || headerSize > dib.length) throw new Error('ICO bitmap header is invalid');
  const width = Math.abs(dib.readInt32LE(4)) || directoryWidth;
  const signedHeight = dib.readInt32LE(8);
  const storedHeight = Math.abs(signedHeight);
  const bottomUp = signedHeight > 0;
  let height = directoryHeight || storedHeight;
  if (storedHeight === height * 2) {
    // ICO bitmaps store the XOR mask and the 1-bit AND mask, so biHeight is twice the image.
    height = directoryHeight;
  } else if (storedHeight > 0 && storedHeight !== height) {
    height = storedHeight > height ? Math.floor(storedHeight / 2) : storedHeight;
  }
  const bitCount = dib.readUInt16LE(14);
  const compression = dib.readUInt32LE(16);
  if (compression !== 0 && compression !== 3) {
    throw new Error(`unsupported ICO compression ${compression}`);
  }
  const colorsUsed = dib.readUInt32LE(32);
  let paletteCount = 0;
  if (bitCount > 0 && bitCount <= 8) paletteCount = colorsUsed || (1 << bitCount);
  let pixelOffset = headerSize + paletteCount * 4;
  if (compression === 3 && headerSize === 40 && bitCount > 8) pixelOffset += 12;
  const stride = Math.floor((width * bitCount + 31) / 32) * 4;
  if (width <= 0 || height <= 0 || stride <= 0) throw new Error('ICO bitmap has no pixels');
  if (pixelOffset + stride * height > dib.length) throw new Error('ICO bitmap is truncated');

  const palette = [];
  for (let index = 0; index < paletteCount; index += 1) {
    const at = headerSize + index * 4;
    palette.push([dib[at + 2], dib[at + 1], dib[at], 255]);
  }

  const rgba = Buffer.alloc(width * height * 4);
  const paint = (x, fileY, r, g, b, a) => {
    const y = bottomUp ? height - 1 - fileY : fileY;
    const at = (y * width + x) * 4;
    rgba[at] = r;
    rgba[at + 1] = g;
    rgba[at + 2] = b;
    rgba[at + 3] = a;
  };

  for (let y = 0; y < height; y += 1) {
    const row = pixelOffset + y * stride;
    if (bitCount === 32) {
      for (let x = 0; x < width; x += 1) {
        const at = row + x * 4;
        paint(x, y, dib[at + 2], dib[at + 1], dib[at], dib[at + 3]);
      }
    } else if (bitCount === 24) {
      for (let x = 0; x < width; x += 1) {
        const at = row + x * 3;
        paint(x, y, dib[at + 2], dib[at + 1], dib[at], 255);
      }
    } else if (bitCount === 8 || bitCount === 4 || bitCount === 1) {
      for (let x = 0; x < width; x += 1) {
        let index;
        if (bitCount === 8) index = dib[row + x];
        else if (bitCount === 4) {
          const byte = dib[row + (x >> 1)];
          index = x % 2 === 0 ? byte >> 4 : byte & 0x0f;
        } else {
          const byte = dib[row + (x >> 3)];
          index = (byte >> (7 - (x % 8))) & 1;
        }
        const color = palette[index] || [0, 0, 0, 255];
        paint(x, y, color[0], color[1], color[2], color[3]);
      }
    } else {
      throw new Error(`unsupported ICO bit count ${bitCount}`);
    }
  }

  let hasAlpha = false;
  if (bitCount === 32) {
    for (let at = 3; at < rgba.length; at += 4) {
      if (rgba[at] !== 0) {
        hasAlpha = true;
        break;
      }
    }
  }
  const andStride = Math.floor((width + 31) / 32) * 4;
  const andOffset = pixelOffset + stride * height;
  const hasAnd = andOffset + andStride * height <= dib.length;
  if (hasAnd && (bitCount !== 32 || !hasAlpha)) {
    for (let y = 0; y < height; y += 1) {
      const row = andOffset + y * andStride;
      const destY = bottomUp ? height - 1 - y : y;
      for (let x = 0; x < width; x += 1) {
        const transparent = ((dib[row + (x >> 3)] >> (7 - (x % 8))) & 1) === 1;
        const at = (destY * width + x) * 4 + 3;
        if (transparent) rgba[at] = 0;
        else if (!hasAlpha) rgba[at] = 255;
      }
    }
  } else if (bitCount === 32 && !hasAlpha) {
    for (let at = 3; at < rgba.length; at += 4) rgba[at] = 255;
  }

  return { width, height, rgba };
}

/**
 * Largest image in an ICO container.
 * Returns embedded PNG bytes when the icon stores PNG, otherwise raw RGBA.
 */
function decodeIco(buffer) {
  const entries = readIcoEntries(buffer);
  if (entries.length === 0) throw new Error('not an ICO image');
  let lastError = new Error('ICO image could not be decoded');
  for (const entry of entries) {
    try {
      if (isPng(entry.image)) {
        return { width: entry.width, height: entry.height, png: entry.image, rgba: null };
      }
      return { png: null, ...decodeDib(entry.image, entry.width, entry.height) };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

module.exports = {
  decodeIco,
  readIcoEntries,
};
