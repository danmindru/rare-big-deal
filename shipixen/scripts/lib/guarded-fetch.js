const http = require('http');
const https = require('https');
const { AddressRejected, vetUrl } = require('./public-address');

const MAX_REDIRECTS = 5;
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_BYTES = 8_000_000;

const SAFE_REQUEST_HEADERS = Object.freeze({
  'user-agent': 'Mozilla/5.0',
  accept: '*/*',
});

function headerMap(headers) {
  const out = {};
  if (!headers) return out;
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'set-cookie') continue;
    out[key.toLowerCase()] = value;
  }
  return out;
}

function requestHeaders(extra) {
  const headers = { ...SAFE_REQUEST_HEADERS, ...extra };
  delete headers.cookie;
  delete headers.Cookie;
  delete headers.authorization;
  delete headers.Authorization;
  delete headers['proxy-authorization'];
  return headers;
}

function readCapped(stream, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    const fail = (error) => {
      stream.destroy();
      reject(error);
    };
    stream.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        fail(new AddressRejected('response exceeded the byte limit', 'size'));
        return;
      }
      chunks.push(chunk);
    });
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function defaultRequest(target, pinned, options) {
  const lib = target.protocol === 'https:' ? https : http;
  const headers = requestHeaders(options.headers);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes || DEFAULT_MAX_BYTES;

  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        method: options.method || 'GET',
        headers,
        timeout: timeoutMs,
        servername: target.hostname,
        rejectUnauthorized: true,
        lookup: (hostname, lookupOptions, callback) => {
          const done = typeof lookupOptions === 'function' ? lookupOptions : callback;
          if (hostname !== target.hostname && hostname !== pinned) {
            done(new AddressRejected(`unexpected lookup for ${hostname}`, 'dns'));
            return;
          }
          done(null, pinned, require('net').isIP(pinned));
        },
      },
      (res) => {
        readCapped(res, maxBytes).then(
          (body) => {
            resolve({
              status: res.statusCode,
              headers: headerMap(res.headers),
              body,
            });
          },
          reject,
        );
      },
    );
    req.on('timeout', () => {
      req.destroy(new AddressRejected('request timed out', 'timeout'));
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetch one public URL. Redirects are followed one hop at a time, and each
 * hop is resolved and pinned again. Cookies and authorization are never stored
 * or forwarded.
 */
async function guardedFetch(urlString, options = {}) {
  const requestImpl = options.requestImpl || defaultRequest;
  const maxRedirects = options.maxRedirects ?? MAX_REDIRECTS;
  let current = urlString;
  const hops = [];

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const vetted = await vetUrl(current, options.lookup);
    hops.push({ url: vetted.url.href, pinned: vetted.pinned });
    const response = await requestImpl(vetted.url, vetted.pinned, {
      ...options,
      headers: requestHeaders(options.headers),
    });
    const status = response.status || 0;
    if (![301, 302, 303, 307, 308].includes(status)) {
      return { ...response, hops };
    }
    const location = response.headers && (response.headers.location || response.headers.Location);
    if (!location || hop === maxRedirects) {
      throw new AddressRejected('redirect could not be followed', 'redirect');
    }
    current = new URL(Array.isArray(location) ? location[0] : location, vetted.url).href;
  }

  throw new AddressRejected('redirect could not be followed', 'redirect');
}

module.exports = {
  DEFAULT_MAX_BYTES,
  DEFAULT_TIMEOUT_MS,
  MAX_REDIRECTS,
  SAFE_REQUEST_HEADERS,
  guardedFetch,
  readCapped,
  requestHeaders,
};
