const net = require('net');
const { AddressRejected, resolvePinned } = require('./public-address');

const MAX_TUNNEL_BYTES = 15_000_000;
const HEADER_LIMIT = 8192;

function splitHostPort(target, fallbackPort) {
  if (target.startsWith('[')) {
    const match = target.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (!match) throw new AddressRejected('unparseable proxy target', 'bad-host');
    return [match[1], Number(match[2] || fallbackPort)];
  }
  const index = target.lastIndexOf(':');
  if (index === -1) return [target, fallbackPort];
  return [target.slice(0, index), Number(target.slice(index + 1))];
}

function openPinned(ip, port, connectImpl) {
  if (connectImpl) return Promise.resolve(connectImpl(ip, port));
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: ip, port, family: net.isIP(ip) });
    socket.once('connect', () => resolve(socket));
    socket.once('error', reject);
  });
}

function capPipe(from, to, maxBytes) {
  let seen = 0;
  from.on('data', (chunk) => {
    seen += chunk.length;
    if (seen > maxBytes) {
      from.destroy();
      to.destroy();
      return;
    }
    if (!to.write(chunk)) from.pause();
  });
  to.on('drain', () => from.resume());
  from.on('end', () => to.end());
  from.on('error', () => to.destroy());
  to.on('error', () => from.destroy());
}

function deny(socket, message) {
  const body = message || 'blocked';
  socket.end(
    `HTTP/1.1 403 Forbidden\r\nContent-Type: text/plain\r\nContent-Length: ${Buffer.byteLength(body)}\r\nConnection: close\r\n\r\n${body}`,
  );
}

async function handleHead(socket, head, rest, options) {
  const [requestLine] = head.split('\r\n');
  const [method, target] = requestLine.split(' ');
  if (!method || !target) {
    deny(socket, 'blocked');
    return;
  }

  if (method === 'CONNECT') {
    const [host, port] = splitHostPort(target, 443);
    if (port !== 80 && port !== 443) {
      deny(socket, 'blocked');
      return;
    }
    let pinned;
    try {
      pinned = await resolvePinned(host, options.lookup);
    } catch {
      deny(socket, 'blocked');
      return;
    }
    if (options.onDestination) options.onDestination({ host, pinned, port });
    let remote;
    try {
      remote = await openPinned(pinned, port, options.connectImpl);
    } catch {
      deny(socket, 'blocked');
      return;
    }
    if (options.track) options.track(remote);
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (rest.length) remote.write(rest);
    capPipe(socket, remote, MAX_TUNNEL_BYTES);
    capPipe(remote, socket, MAX_TUNNEL_BYTES);
    return;
  }

  let destination;
  try {
    destination = new URL(target);
  } catch {
    deny(socket, 'blocked');
    return;
  }
  const port = destination.port
    ? Number(destination.port)
    : destination.protocol === 'https:'
      ? 443
      : 80;
  if (!['http:', 'https:'].includes(destination.protocol) || (port !== 80 && port !== 443)) {
    deny(socket, 'blocked');
    return;
  }
  let pinned;
  try {
    pinned = await resolvePinned(destination.hostname, options.lookup);
  } catch {
    deny(socket, 'blocked');
    return;
  }
  if (options.onDestination) options.onDestination({ host: destination.hostname, pinned, port });
  let remote;
  try {
    remote = await openPinned(pinned, port, options.connectImpl);
  } catch {
    deny(socket, 'blocked');
    return;
  }
  if (options.track) options.track(remote);
  const path = `${destination.pathname}${destination.search}` || '/';
  const headerLines = head
    .split('\r\n')
    .slice(1)
    .filter((line) => !/^(cookie|authorization|proxy-authorization):/i.test(line));
  remote.write(`${method} ${path} HTTP/1.1\r\n${headerLines.join('\r\n')}\r\n\r\n`);
  if (rest.length) remote.write(rest);
  capPipe(socket, remote, MAX_TUNNEL_BYTES);
  capPipe(remote, socket, MAX_TUNNEL_BYTES);
}

function createPublicProxy(options = {}) {
  const sockets = new Set();
  const track = (socket) => {
    if (!socket) return socket;
    sockets.add(socket);
    if (typeof socket.unref === 'function') socket.unref();
    socket.on('close', () => sockets.delete(socket));
    return socket;
  };
  const server = net.createServer((socket) => {
    track(socket);
    socket.setTimeout(20000);
    let buffer = Buffer.alloc(0);
    const onData = (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      const end = buffer.indexOf('\r\n\r\n');
      if (end === -1) {
        if (buffer.length > HEADER_LIMIT) socket.destroy();
        return;
      }
      socket.off('data', onData);
      const head = buffer.subarray(0, end).toString('latin1');
      const rest = buffer.subarray(end + 4);
      handleHead(socket, head, rest, { ...options, track }).catch(() => deny(socket, 'blocked'));
    };
    socket.on('data', onData);
    socket.on('timeout', () => socket.destroy());
    socket.on('error', () => {});
  });

  return new Promise((resolve, reject) => {
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        port,
        close: () => {
          for (const socket of sockets) socket.destroy();
          return new Promise((done) => {
            server.close(() => done());
          });
        },
      });
    });
  });
}

module.exports = {
  createPublicProxy,
};
