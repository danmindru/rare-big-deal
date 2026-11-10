const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { inspectMedia } = require('./media-bytes');
const { createPublicProxy } = require('./public-proxy');
const { vetUrl } = require('./public-address');

const WINDOW = { width: 1200, height: 630 };

function chromeBin() {
  return process.env.CHROME_PATH || 'google-chrome';
}

function runProcess(spawnImpl, bin, args, timeoutMs, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(bin, args, { stdio: 'ignore', detached: true });
    if (child && typeof child.unref === 'function') child.unref();
    let settled = false;
    let lastSize = -1;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(poll);
      if (error) reject(error);
      else resolve(result);
    };
    const kill = () => {
      if (!child || !child.pid) return;
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        try {
          child.kill('SIGKILL');
        } catch {
          // The process had already exited.
        }
      }
    };
    const timer = setTimeout(() => {
      kill();
      finish(null, { timedOut: true });
    }, timeoutMs);
    const poll = setInterval(() => {
      if (!outputPath || !fs.existsSync(outputPath)) return;
      const size = fs.statSync(outputPath).size;
      if (size > 1000 && size === lastSize) {
        kill();
        finish(null, { timedOut: false });
      }
      lastSize = size;
    }, 300);
    child.on('error', (error) => finish(error));
    child.on('exit', () => finish(null, { timedOut: false }));
  });
}

/**
 * Capture the website itself when it has no usable share image.
 * Chrome is sent through a proxy that pins every connection to a public
 * address. A temporary empty profile is used and then deleted.
 */
async function captureWebsiteScreenshot(options) {
  const vetted = await vetUrl(options.url, options.lookup);
  const outputPath = options.outputPath;
  const width = options.width || WINDOW.width;
  const height = options.height || WINDOW.height;
  const proxy = await createPublicProxy({
    lookup: options.lookup,
    connectImpl: options.connectImpl,
    onDestination: options.onDestination,
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-shot-'));
  const spawnImpl = options.spawnImpl || spawn;
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-quic',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-client-side-phishing-detection',
      '--disable-features=Translate,OptimizationHints,MediaRouter',
      '--metrics-recording-only',
      '--safebrowsing-disable-auto-update',
      `--user-data-dir=${profile}`,
      `--proxy-server=http://127.0.0.1:${proxy.port}`,
      '--proxy-bypass-list=<-loopback>',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      '--virtual-time-budget=8000',
      '--timeout=15000',
      `--screenshot=${outputPath}`,
      vetted.url.href,
    ];
    await runProcess(
      spawnImpl,
      options.chromePath || chromeBin(),
      args,
      options.timeoutMs || 25000,
      outputPath,
    );
    if (!fs.existsSync(outputPath)) {
      return {
        ok: false,
        source: null,
        inspection: { ok: false, status: 'fail', reason: 'the browser did not write a screenshot' },
      };
    }
    const buffer = fs.readFileSync(outputPath);
    const inspection = await inspectMedia(buffer, 'banner');
    if (!inspection.ok) {
      fs.rmSync(outputPath, { force: true });
      return { ok: false, source: null, inspection };
    }
    return {
      ok: true,
      source: 'website-screenshot',
      inspection,
      bytes: buffer.length,
      pinned: vetted.pinned,
    };
  } finally {
    await proxy.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

module.exports = {
  WINDOW,
  captureWebsiteScreenshot,
};

if (require.main === module) {
  const [url, outputPath] = process.argv.slice(2);
  captureWebsiteScreenshot({ url, outputPath })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
