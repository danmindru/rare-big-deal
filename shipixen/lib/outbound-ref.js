// Render-time tag for links that leave rarebigdeal.com.
// Stored README and product website fields stay unchanged.

const REF_PARAM = 'ref=rbd';
const SITE_HOST = 'rarebigdeal.com';

/**
 * Appends ref=rbd to an outbound http(s) URL.
 * Relative links, this site, mailto, tel, javascript, and invalid values are unchanged.
 * @template {string | null | undefined} T
 * @param {T} href
 * @returns {T}
 */
function withOutboundRef(href) {
  if (typeof href !== 'string') return href;
  const trimmed = href.trim();
  if (!trimmed) return href;

  const protocolRelative = trimmed.startsWith('//');
  if (
    !protocolRelative &&
    (trimmed.startsWith('#') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('?') ||
      trimmed.startsWith('./') ||
      trimmed.startsWith('../'))
  ) {
    return href;
  }

  const scheme = protocolRelative ? 'https' : readScheme(trimmed);
  if (scheme !== 'http' && scheme !== 'https') return href;

  const parsed = parseHttpUrl(trimmed);
  if (!parsed) return href;
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return href;
  if (!parsed.hostname || isSiteHost(parsed.hostname)) return href;

  const hashAt = trimmed.indexOf('#');
  const beforeHash = hashAt === -1 ? trimmed : trimmed.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : trimmed.slice(hashAt);
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt === -1 ? '' : beforeHash.slice(queryAt + 1);
  if (queryHasRef(query)) return href;

  if (queryAt === -1) return `${beforeHash}?${REF_PARAM}${hash}`;
  if (query === '' || beforeHash.endsWith('?') || beforeHash.endsWith('&')) {
    return `${beforeHash}${REF_PARAM}${hash}`;
  }
  return `${beforeHash}&${REF_PARAM}${hash}`;
}

function readScheme(href) {
  const colon = href.indexOf(':');
  if (colon <= 0) return '';
  const scheme = href.slice(0, colon).toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*$/.test(scheme)) return '';
  return scheme;
}

function parseHttpUrl(href) {
  try {
    return new URL(href, 'https://rarebigdeal.com');
  } catch (error) {
    return null;
  }
}

function isSiteHost(hostname) {
  const host = hostname.replace(/\.$/, '').toLowerCase();
  return host === SITE_HOST || host.endsWith(`.${SITE_HOST}`);
}

function queryHasRef(query) {
  const parts = query.split('&');
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (!part) continue;
    const eq = part.indexOf('=');
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const rawValue = eq === -1 ? '' : part.slice(eq + 1);
    if (decodePart(rawKey) === 'ref' && decodePart(rawValue) === 'rbd') {
      return true;
    }
  }
  return false;
}

function decodePart(part) {
  try {
    return decodeURIComponent(part.replace(/\+/g, ' '));
  } catch (error) {
    return part;
  }
}

module.exports = { withOutboundRef };
