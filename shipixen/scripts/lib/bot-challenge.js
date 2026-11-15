// Interstitial pages from bot checks (Cloudflare's "Just a moment" / managed
// challenge, and the same copy from other vendors). A screenshot of one of
// these is not a product banner.

const BODY_PHRASES = [
  'Performing security verification',
  'Verifying you are human',
  'Checking your browser',
];

function headerValue(headers, name) {
  if (!headers) return '';
  const wanted = name.toLowerCase();
  if (typeof headers.get === 'function') {
    const value = headers.get(name);
    return value == null ? '' : String(value);
  }
  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() !== wanted) continue;
    if (Array.isArray(value)) return value.map((item) => String(item)).join(', ');
    return value == null ? '' : String(value);
  }
  return '';
}

function titleFromHtml(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return '';
  return match[1]
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @returns {{ challenged: boolean, reason: string }}
 */
function detectBotChallenge({ headers, title, body } = {}) {
  const mitigated = headerValue(headers, 'cf-mitigated');
  if (/\bchallenge\b/i.test(mitigated)) {
    return {
      challenged: true,
      reason: 'response header cf-mitigated: challenge',
    };
  }

  const titleText = String(title || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/just a moment\b/i.test(titleText)) {
    return {
      challenged: true,
      reason: `page title is a bot check (${titleText})`,
    };
  }

  const text = String(body || '').toLowerCase();
  for (const phrase of BODY_PHRASES) {
    if (text.includes(phrase.toLowerCase())) {
      return {
        challenged: true,
        reason: `page says "${phrase}"`,
      };
    }
  }

  return { challenged: false, reason: '' };
}

function challengeBannerReason(result) {
  const why = result && result.reason ? result.reason : 'bot challenge';
  return `bot challenge page was not saved as a banner (${why})`;
}

class BotChallengeError extends Error {
  constructor(result) {
    super(challengeBannerReason(result));
    this.name = 'BotChallengeError';
    this.code = 'bot-challenge';
    this.challenge = result;
  }
}

module.exports = {
  BODY_PHRASES,
  BotChallengeError,
  challengeBannerReason,
  detectBotChallenge,
  headerValue,
  titleFromHtml,
};
