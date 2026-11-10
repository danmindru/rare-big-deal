const dns = require('dns').promises;
const net = require('net');

const BLOCKED_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata',
  'metadata.google.internal',
  'metadata.internal',
  'instance-data',
]);

const BLOCKED_SUFFIXES = [
  '.local',
  '.localhost',
  '.localdomain',
  '.internal',
  '.intranet',
  '.lan',
  '.home',
  '.corp',
];

class AddressRejected extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AddressRejected';
    this.code = code;
  }
}

function ipv4Parts(ip) {
  const parts = ip.split('.').map((part) => Number(part));
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return null;
  }
  return parts;
}

function isPublicIpv4(ip) {
  const parts = ipv4Parts(ip);
  if (!parts) return false;
  const [a, b, c] = parts;
  if (a === 0 || a === 10 || a === 127) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return false;
  if (a === 192 && b === 88 && c === 99) return false;
  if (a === 198 && (b === 18 || b === 19)) return false;
  if (a === 198 && b === 51 && c === 100) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  if (a >= 224) return false;
  return true;
}

function expandIpv6(ip) {
  if (net.isIP(ip) !== 6) return null;
  const zoneStripped = ip.toLowerCase().split('%')[0];
  const double = zoneStripped.includes('::');
  let head = zoneStripped;
  let tail = null;
  if (double) {
    const pieces = zoneStripped.split('::');
    if (pieces.length !== 2) return null;
    head = pieces[0];
    tail = pieces[1];
  }

  const parseSide = (part) => {
    if (part === '') return [];
    const bits = part.split(':');
    const out = [];
    for (let i = 0; i < bits.length; i += 1) {
      const bit = bits[i];
      if (bit.includes('.')) {
        if (i !== bits.length - 1) return null;
        const v4 = ipv4Parts(bit);
        if (!v4) return null;
        const value = ((v4[0] << 24) >>> 0) + (v4[1] << 16) + (v4[2] << 8) + v4[3];
        out.push((value >>> 16) & 0xffff, value & 0xffff);
      } else if (!/^[0-9a-f]{1,4}$/.test(bit)) {
        return null;
      } else {
        out.push(parseInt(bit, 16));
      }
    }
    return out;
  };

  const left = parseSide(head);
  if (!left) return null;
  if (!double) return left.length === 8 ? left : null;
  const right = parseSide(tail);
  if (!right) return null;
  const missing = 8 - left.length - right.length;
  if (missing < 0) return null;
  return [...left, ...Array(missing).fill(0), ...right];
}

function isPublicIpv6(ip) {
  const parts = expandIpv6(ip);
  if (!parts) return false;
  const [p0, p1, p2, p3, p4, p5, p6, p7] = parts;
  const allZero = parts.every((part) => part === 0);
  if (allZero) return false;
  if (allZero === false && parts.slice(0, 7).every((part) => part === 0) && p7 === 1) return false;
  if (p0 === 0 && p1 === 0 && p2 === 0 && p3 === 0 && p4 === 0 && p5 === 0xffff) {
    return isPublicIpv4(`${p6 >> 8}.${p6 & 255}.${p7 >> 8}.${p7 & 255}`);
  }
  if (p0 === 0x0064 && p1 === 0xff9b && p2 === 0 && p3 === 0 && p4 === 0 && p5 === 0) {
    return isPublicIpv4(`${p6 >> 8}.${p6 & 255}.${p7 >> 8}.${p7 & 255}`);
  }
  if (p0 === 0x2002) {
    return isPublicIpv4(`${p1 >> 8}.${p1 & 255}.${p2 >> 8}.${p2 & 255}`);
  }
  if (p0 === 0x2001 && p1 === 0) return false;
  if (p0 === 0x2001 && p1 === 0x0db8) return false;
  if (p0 === 0x0100 && p1 === 0 && p2 === 0 && p3 === 0) return false;
  if ((p0 & 0xfe00) === 0xfc00) return false;
  if ((p0 & 0xffc0) === 0xfe80) return false;
  if ((p0 & 0xffc0) === 0xfec0) return false;
  if ((p0 & 0xff00) === 0xff00) return false;
  return true;
}

function isPublicAddress(address) {
  const ip = address.startsWith('[') && address.endsWith(']') ? address.slice(1, -1) : address;
  if (net.isIP(ip) === 4) return isPublicIpv4(ip);
  if (net.isIP(ip) === 6) return isPublicIpv6(ip);
  return false;
}

function hostnameFromUrl(url) {
  let host = url.hostname;
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);
  if (host.endsWith('.')) host = host.slice(0, -1);
  return host.toLowerCase();
}

function assertDnsName(host) {
  if (!host || host.length > 253 || BLOCKED_HOSTS.has(host)) {
    throw new AddressRejected(`${host || '(empty)'} is not a public host`, 'blocked-host');
  }
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    throw new AddressRejected(`${host} is not a public host`, 'blocked-host');
  }
  if (!host.includes('.')) {
    throw new AddressRejected(`${host} is not a public host`, 'blocked-host');
  }
  const labels = host.split('.');
  if (labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) {
    throw new AddressRejected(`${host} is not a public host`, 'blocked-host');
  }
  if (!/^[a-z]{2,63}$/i.test(labels[labels.length - 1])) {
    throw new AddressRejected(`${host} is not a public host`, 'blocked-host');
  }
}

function withTimeout(promise, ms, code) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new AddressRejected('name lookup timed out', code));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function defaultLookup(hostname) {
  return withTimeout(dns.lookup(hostname, { all: true, verbatim: true }), 5000, 'dns');
}

/**
 * Resolve a host to one public address.
 * Every address in the DNS answer has to be public. A private address in the
 * same answer, or a later answer that changes to a private address, is rejected
 * so a rebinding name cannot be used.
 */
async function resolvePinned(host, lookup = defaultLookup) {
  let parsed = host;
  try {
    const wrapped = host.includes(':') && net.isIP(host) === 0 ? `[${host}]` : host;
    parsed = hostnameFromUrl(new URL(`http://${wrapped}`));
  } catch {
    throw new AddressRejected(`${host} is not a public host`, 'bad-host');
  }

  if (net.isIP(parsed)) {
    if (!isPublicAddress(parsed)) {
      throw new AddressRejected(`${parsed} is not a public address`, 'private-address');
    }
    return parsed;
  }

  assertDnsName(parsed);
  let records;
  try {
    records = await lookup(parsed);
  } catch (error) {
    if (error instanceof AddressRejected) throw error;
    throw new AddressRejected(`${parsed} could not be resolved`, 'dns');
  }
  if (!Array.isArray(records) || records.length === 0) {
    throw new AddressRejected(`${parsed} could not be resolved`, 'dns');
  }
  for (const record of records) {
    if (!record || !isPublicAddress(record.address)) {
      throw new AddressRejected(
        `${parsed} resolved to a non-public address`,
        'dns-rebinding',
      );
    }
  }
  const v4 = records.find((record) => net.isIP(record.address) === 4);
  return (v4 || records[0]).address;
}

function vetUrlSyntax(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    throw new AddressRejected('invalid url', 'bad-url');
  }
  if (url.username || url.password) {
    throw new AddressRejected('credentials in a url are not sent', 'credentials');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new AddressRejected('only public http(s) urls are allowed', 'scheme');
  }
  const port = url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80;
  if (!Number.isInteger(port) || (port !== 80 && port !== 443)) {
    throw new AddressRejected('only ports 80 and 443 are allowed', 'port');
  }
  const host = hostnameFromUrl(url);
  if (net.isIP(host)) {
    if (!isPublicAddress(host)) {
      throw new AddressRejected(`${host} is not a public address`, 'private-address');
    }
  } else {
    assertDnsName(host);
  }
  return { url, host, port };
}

async function vetUrl(urlString, lookup = defaultLookup) {
  const syntax = vetUrlSyntax(urlString);
  const pinned = await resolvePinned(syntax.host, lookup);
  return { url: syntax.url, pinned, port: syntax.port };
}

module.exports = {
  AddressRejected,
  assertDnsName,
  hostnameFromUrl,
  isPublicAddress,
  resolvePinned,
  vetUrl,
  vetUrlSyntax,
};
