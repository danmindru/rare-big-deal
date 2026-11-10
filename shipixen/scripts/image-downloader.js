const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { decodeIco } = require('./lib/ico');
const { AddressRejected } = require('./lib/public-address');
const { guardedFetch } = require('./lib/guarded-fetch');
const { mediaKind } = require('./lib/media-bytes');

// Retry configuration
const MAX_RETRIES = 2; // Number of retry attempts after initial failure
const RETRY_BACKOFF_MS = [2000, 4000]; // Backoff delays in milliseconds for each retry

/**
 * Delays execution for a specified amount of time.
 *
 * @param {number} ms - Time to delay in milliseconds
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeFileAtomic(filePath, buffer) {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.promises.writeFile(tempPath, buffer);
  await fs.promises.rename(tempPath, filePath);
}

/**
 * Turn downloaded bytes into a PNG. Format comes from the bytes, not the URL
 * or the Content-Type. ICO containers are decoded here because sharp cannot
 * read them. The destination file is never deleted.
 */
async function rasterToPng(buffer) {
  const kind = mediaKind(buffer);
  if (kind === 'html' || kind === 'svg' || !kind) {
    throw new Error(`not a raster image (${kind || 'unrecognized bytes'})`);
  }
  if (kind === 'ico') {
    const decoded = decodeIco(buffer);
    if (decoded.png) {
      return sharp(decoded.png, { failOn: 'error' }).png().toBuffer();
    }
    return sharp(decoded.rgba, {
      raw: { width: decoded.width, height: decoded.height, channels: 4 },
      failOn: 'error',
    })
      .png()
      .toBuffer();
  }
  return sharp(buffer, { failOn: 'error', animated: false }).png().toBuffer();
}

/**
 * Downloads an image from a URL (core implementation without retry logic).
 *
 * @param {string} url - The URL of the image to download
 * @param {string} outputPath - The local path where the image should be saved
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 * @throws {Error} - Throws error on failure (to be handled by retry wrapper)
 */
async function downloadImageCore(url, outputPath, options = {}) {
  let response;
  if (typeof options.getBytes === 'function') {
    const body = await options.getBytes(url);
    response = { status: 200, headers: {}, body };
  } else {
    response = await guardedFetch(url, {
      timeoutMs: options.timeoutMs || 15000,
      maxBytes: options.maxBytes || 8_000_000,
      headers: { accept: 'image/*,*/*;q=0.1' },
      lookup: options.lookup,
      requestImpl: options.requestImpl,
    });
  }

  console.log(`[Image Downloader] 📡 HTTP ${response.status} for: ${url}`);
  if (!response || response.status >= 400) {
    throw new Error(`HTTP ${response.status || 'error'}`);
  }
  if (!response.body || response.body.length === 0) {
    throw new Error(`empty image from ${url}`);
  }

  const png = await rasterToPng(response.body);
  await writeFileAtomic(outputPath, png);
  console.log(`[Image Downloader] ✅ Saved PNG to: ${outputPath}`);
  return true;
}

/**
 * Downloads an image from a URL and saves it to the specified path.
 * Converts JPEG, WebP, GIF, and ICO bytes to PNG.
 * Includes retry logic with configurable backoff.
 *
 * @param {string} url - The URL of the image to download
 * @param {string} outputPath - The local path where the image should be saved
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
async function downloadImage(url, outputPath, options = {}) {
  console.log(`[Image Downloader] 📥 Starting download from: ${url}`);
  let lastError;
  const maxRetries = options.maxRetries ?? MAX_RETRIES;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (typeof options.onAttempt === 'function') options.onAttempt(attempt);
    try {
      const result = await downloadImageCore(url, outputPath, options);
      if (attempt > 0) {
        console.log(`[Image Downloader] ✅ Succeeded on attempt ${attempt + 1}/${maxRetries + 1}`);
      }
      return result;
    } catch (error) {
      lastError = error;
      if (error instanceof AddressRejected) {
        console.error(`[Image Downloader] ❌ Blocked ${url}: ${error.message}`);
        return false;
      }

      if (attempt < maxRetries) {
        const backoffDelay =
          RETRY_BACKOFF_MS[attempt] ||
          RETRY_BACKOFF_MS[RETRY_BACKOFF_MS.length - 1];
        console.warn(
          `[Image Downloader] ⚠️  Attempt ${attempt + 1}/${maxRetries + 1} failed. Retrying in ${backoffDelay / 1000}s... (${error.message})`,
        );
        await delay(backoffDelay);
      }
    }
  }

  console.error(
    `[Image Downloader] ❌ Failed to download after ${maxRetries + 1} attempts from ${url}:`,
    lastError.message,
  );
  return false;
}

/**
 * Downloads multiple images from URLs and saves them with sequential naming.
 *
 * @param {string[]} imageUrls - Array of image URLs to download
 * @param {string} appDir - Directory where images should be saved
 * @param {string} productName - Name of the product (for generating paths)
 * @returns {Promise<string[]>} - Array of successfully downloaded image paths
 */
async function downloadMultipleImages(imageUrls, appDir, productName) {
  console.log(`[Image Downloader] 📦 Downloading ${imageUrls.length} images for ${productName}...`);
  const downloadedImages = [];
  const startTime = Date.now();

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    const imageName = i === 0 ? 'og-image.png' : `og-image-${i + 1}.png`;
    const imagePath = path.join(appDir, imageName);

    console.log(`[Image Downloader] 📥 Image ${i + 1}/${imageUrls.length}: ${imageUrl}`);

    const isValidImage = await downloadImage(imageUrl, imagePath);
    if (isValidImage) {
      downloadedImages.push(
        `/static/images/product/${productName}/${imageName}`,
      );
      console.log(`[Image Downloader] ✅ Successfully downloaded image ${i + 1}/${imageUrls.length}`);
    } else {
      console.error(`[Image Downloader] ❌ Failed to download image ${i + 1}/${imageUrls.length}`);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Image Downloader] ✅ Downloaded ${downloadedImages.length}/${imageUrls.length} images in ${elapsed}ms`);

  return downloadedImages;
}

/**
 * Converts an ICO file to PNG format.
 * Reads the source fully before writing, and only removes the source when it
 * is a different file from the PNG output.
 *
 * @param {string} icoPath - Path to the .ico file
 * @param {string} pngPath - Path where the .png file should be saved
 */
async function convertIcoToPng(icoPath, pngPath) {
  const source = await fs.promises.readFile(icoPath);
  const png = await rasterToPng(source);
  await writeFileAtomic(pngPath, png);
  if (path.resolve(icoPath) !== path.resolve(pngPath)) {
    await fs.promises.unlink(icoPath);
  }
}

module.exports = {
  convertIcoToPng,
  downloadImage,
  downloadMultipleImages,
  rasterToPng,
  writeFileAtomic,
};
