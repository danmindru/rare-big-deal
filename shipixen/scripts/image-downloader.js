const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

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

/**
 * Downloads an image from a URL (core implementation without retry logic).
 *
 * @param {string} url - The URL of the image to download
 * @param {string} outputPath - The local path where the image should be saved
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 * @throws {Error} - Throws error on failure (to be handled by retry wrapper)
 */
async function downloadImageCore(url, outputPath) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    validateStatus: (status) => status < 400,
    timeout: 30000, // 30 second timeout
  });

  console.log(`[Image Downloader] 📡 HTTP ${response.status} for: ${url}`);

  const contentType = response.headers['content-type'];
  console.log(`[Image Downloader] 📋 Content-Type: ${contentType}`);

  if (contentType && contentType.startsWith('image/')) {
    let imageBuffer = response.data;

    // If the image is a JPG or WebP, convert it to PNG
    if (
      contentType === 'image/jpeg' ||
      contentType === 'image/webp' ||
      contentType === 'image/png'
    ) {
      const pngOutputPath = outputPath.replace(
        /\.(jpg|jpeg|webp|png)$/,
        '.png',
      );
      console.log(`[Image Downloader] 🔄 Converting ${contentType} to PNG...`);
      await sharp(imageBuffer).png().toFile(pngOutputPath);
      console.log(
        `[Image Downloader] ✅ Converted and saved to: ${pngOutputPath}`,
      );
      return true;
    } else {
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`[Image Downloader] ✅ Downloaded to: ${outputPath}`);
      return true;
    }
  } else {
    throw new Error(
      `Invalid image type from ${url}. Detected Content-Type: ${contentType}`,
    );
  }
}

/**
 * Downloads an image from a URL and saves it to the specified path.
 * Automatically converts JPEG and WebP images to PNG.
 * Includes retry logic with configurable backoff.
 *
 * @param {string} url - The URL of the image to download
 * @param {string} outputPath - The local path where the image should be saved
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
async function downloadImage(url, outputPath) {
  console.log(`[Image Downloader] 📥 Starting download from: ${url}`);
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await downloadImageCore(url, outputPath);
      if (attempt > 0) {
        console.log(`[Image Downloader] ✅ Succeeded on attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
      }
      return result;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES) {
        const backoffDelay =
          RETRY_BACKOFF_MS[attempt] ||
          RETRY_BACKOFF_MS[RETRY_BACKOFF_MS.length - 1];
        console.warn(
          `[Image Downloader] ⚠️  Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed. Retrying in ${backoffDelay / 1000}s... (${error.message})`,
        );
        await delay(backoffDelay);
      }
    }
  }

  console.error(
    `[Image Downloader] ❌ Failed to download after ${MAX_RETRIES + 1} attempts from ${url}:`,
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
    const imagePath = require('path').join(appDir, imageName);

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
 *
 * @param {string} icoPath - Path to the .ico file
 * @param {string} pngPath - Path where the .png file should be saved
 */
async function convertIcoToPng(icoPath, pngPath) {
  await sharp(icoPath).png().toFile(pngPath);
  await fs.promises.unlink(icoPath);
}

module.exports = {
  downloadImage,
  downloadMultipleImages,
  convertIcoToPng,
};
