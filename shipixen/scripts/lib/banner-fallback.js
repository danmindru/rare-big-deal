const fs = require('fs');
const { challengeBannerReason } = require('./bot-challenge');
const { inspectMediaFile } = require('./media-bytes');
const { captureWebsiteScreenshot } = require('./screenshot-fallback');

/**
 * Keep an official share image when it decodes at banner size.
 * Otherwise delete it and capture the website. A bot-challenge page is not
 * captured: the banner stays missing unless an official og:image already
 * decoded. Nothing is drawn in its place.
 */
async function ensureUsableBanner({ imagePath, website, capture, inspect, claim, botChallenge }) {
  const read = inspect || ((file) => inspectMediaFile(file, 'banner'));
  const shoot = capture || captureWebsiteScreenshot;
  let current = { ok: false, status: 'fail', reason: 'image file is missing' };
  if (imagePath && fs.existsSync(imagePath)) {
    current = await read(imagePath);
  }
  if (current.ok) return { source: 'og-image', inspection: current };

  if (imagePath && fs.existsSync(imagePath)) fs.rmSync(imagePath);
  if (botChallenge && botChallenge.challenged) {
    return {
      source: null,
      inspection: {
        ok: false,
        status: 'fail',
        reason: challengeBannerReason(botChallenge),
      },
    };
  }
  if (!website) {
    return {
      source: null,
      inspection: { ok: false, status: 'fail', reason: 'there is no website to capture' },
    };
  }
  if (claim) {
    const decision = claim();
    if (!decision.claimed) {
      return {
        source: null,
        inspection: { ok: false, status: 'needs-human', reason: decision.reason },
      };
    }
  }
  try {
    const shot = await shoot({ url: website, outputPath: imagePath });
    if (!shot.ok) {
      return {
        source: null,
        inspection: shot.inspection || {
          ok: false,
          status: 'fail',
          reason: 'the website screenshot was not a usable banner',
        },
      };
    }
    return { source: 'website-screenshot', inspection: shot.inspection };
  } catch (error) {
    return {
      source: null,
      inspection: { ok: false, status: 'fail', reason: error.message },
    };
  }
}

module.exports = { ensureUsableBanner };
