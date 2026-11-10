const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { PassThrough, Readable } = require('stream');
const { describe, test } = require('node:test');
const sharp = require('sharp');

const { assessEligibility } = require('./lib/eligibility');
const {
  bindingId,
  claimAction,
  emptyLedger,
  machineRecord,
  upsertRecord,
} = require('./lib/evidence-record');
const { ensureUsableBanner } = require('./lib/banner-fallback');
const { guardedFetch, readCapped, requestHeaders } = require('./lib/guarded-fetch');
const { inspectMedia } = require('./lib/media-bytes');
const { AddressRejected, isPublicAddress, vetUrlSyntax } = require('./lib/public-address');
const { createPublicProxy } = require('./lib/public-proxy');
const { captureWebsiteScreenshot } = require('./lib/screenshot-fallback');
const { downloadImage } = require('./image-downloader');
const { fetchWebsiteData } = require('./website-scraper');
const { validateSubmission } = require('./validate-submission');

const FIXTURES = path.join(__dirname, 'fixtures', 'submission');
const TODAY = '2026-11-10';
const PUBLIC_LOOKUP = async () => [{ address: '1.1.1.1', family: 4 }];

function readFixture(name) {
  return fs.readFileSync(path.join(FIXTURES, name), 'utf8');
}

function codes(items) {
  return items.map((item) => item.code);
}

function validate(headName, extra = {}) {
  return validateSubmission({
    baseMarkdown: readFixture('base.md'),
    headMarkdown: readFixture(headName),
    today: TODAY,
    headSha: 'abc123',
    pullRequest: 800,
    recordCatalog: true,
    ...extra,
  });
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

async function png(width, height) {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 30, g: 90, b: 160 },
    },
  })
    .png()
    .toBuffer();
}

describe('public addresses', () => {
  test('accepts public addresses and rejects local, link-local, and metadata ranges', () => {
    assert.equal(isPublicAddress('1.1.1.1'), true);
    assert.equal(isPublicAddress('8.8.8.8'), true);
    assert.equal(isPublicAddress('172.32.0.1'), true);
    for (const ip of [
      '0.0.0.0',
      '10.1.2.3',
      '127.0.0.1',
      '100.64.0.1',
      '169.254.169.254',
      '172.16.0.1',
      '192.168.1.1',
      '192.0.2.1',
      '198.51.100.1',
      '203.0.113.1',
      '224.0.0.1',
      '255.255.255.255',
      '::1',
      'fc00::1',
      'fe80::1',
      '2001:db8::1',
    ]) {
      assert.equal(isPublicAddress(ip), false, ip);
    }
    assert.equal(isPublicAddress('2606:4700:4700::1111'), true);
  });

  test('normalizes decimal, hex, and octal loopback before any lookup', () => {
    for (const url of ['http://2130706433/', 'http://0x7f000001/', 'http://0177.0.0.1/', 'http://127.1/']) {
      assert.throws(() => vetUrlSyntax(url), (error) => error.code === 'private-address');
    }
    assert.throws(() => vetUrlSyntax('http://169.254.169.254/latest/meta-data'), (error) => error.code === 'private-address');
    assert.throws(() => vetUrlSyntax('https://user:pass@example.com/deal'), (error) => error.code === 'credentials');
    assert.throws(() => vetUrlSyntax('file:///etc/passwd'), (error) => error.code === 'scheme');
    assert.throws(() => vetUrlSyntax('https://metadata.google.internal/'), (error) => error.code === 'blocked-host');
    assert.throws(() => vetUrlSyntax('https://printer.local/'), (error) => error.code === 'blocked-host');
    assert.equal(vetUrlSyntax('https://alpha.example/pricing').host, 'alpha.example');
  });
});

describe('guarded fetch', () => {
  test('does not send cookies or authorization and does not follow a redirect to metadata', async () => {
    const seen = [];
    const requestImpl = async (url, pinned, options) => {
      seen.push({ href: url.href, pinned, headers: options.headers });
      return {
        status: 302,
        headers: { location: 'http://169.254.169.254/latest/meta-data', 'set-cookie': 'session=secret' },
        body: Buffer.alloc(0),
      };
    };
    await assert.rejects(
      () => guardedFetch('https://shop.example/deal', { lookup: PUBLIC_LOOKUP, requestImpl }),
      (error) => error instanceof AddressRejected && error.code === 'private-address',
    );
    assert.equal(seen.length, 1);
    assert.equal(seen[0].pinned, '1.1.1.1');
    assert.equal(seen[0].headers.cookie, undefined);
    assert.equal(seen[0].headers.authorization, undefined);
    assert.equal(requestHeaders({ cookie: 'a=b', Authorization: 'Bearer x' }).cookie, undefined);
    assert.equal(requestHeaders({ cookie: 'a=b', Authorization: 'Bearer x' }).authorization, undefined);
  });

  test('rejects a DNS answer that mixes a public address with a private one', async () => {
    let requests = 0;
    await assert.rejects(
      () =>
        guardedFetch('https://rebind.example/', {
          lookup: async () => [
            { address: '1.1.1.1', family: 4 },
            { address: '10.0.0.1', family: 4 },
          ],
          requestImpl: async () => {
            requests += 1;
            return { status: 200, headers: {}, body: Buffer.alloc(0) };
          },
        }),
      (error) => error.code === 'dns-rebinding',
    );
    assert.equal(requests, 0);
  });

  test('checks the address again on the next redirect hop', async () => {
    const seen = [];
    const lookup = async (host) => {
      if (host === 'evil.example') return [{ address: '169.254.169.254', family: 4 }];
      return [{ address: '1.1.1.1', family: 4 }];
    };
    await assert.rejects(
      () =>
        guardedFetch('https://shop.example/start', {
          lookup,
          requestImpl: async (url, pinned) => {
            seen.push({ href: url.href, pinned });
            return { status: 302, headers: { location: 'https://evil.example/meta' }, body: Buffer.alloc(0) };
          },
        }),
      (error) => error.code === 'dns-rebinding',
    );
    assert.deepEqual(seen.map((item) => item.href), ['https://shop.example/start']);
  });

  test('stops reading after the byte cap', async () => {
    const stream = Readable.from([Buffer.alloc(40), Buffer.alloc(40)]);
    await assert.rejects(() => readCapped(stream, 50), (error) => error.code === 'size');
  });

  test('does not open a socket to loopback or a local listener', async () => {
    let hits = 0;
    const server = net.createServer((socket) => {
      hits += 1;
      socket.destroy();
    });
    const port = await listen(server);
    try {
      let requested = false;
      await assert.rejects(() => guardedFetch(`http://127.0.0.1:${port}/secret`, {
        requestImpl: () => {
          requested = true;
          throw new Error('request implementation should not run');
        },
      }));
      assert.equal(requested, false);
      const blockedDownload = await downloadImage(
        `http://127.0.0.1:${port}/logo.png`,
        path.join(os.tmpdir(), 'blocked-logo.png'),
      );
      assert.equal(blockedDownload, false);
      const started = Date.now();
      const downloaded = await downloadImage('http://169.254.169.254/latest/meta-data', path.join(os.tmpdir(), 'meta.png'));
      assert.equal(downloaded, false);
      assert.ok(Date.now() - started < 1000);
      const page = await fetchWebsiteData('http://169.254.169.254/');
      assert.equal(page.ogImageUrl, null);
      assert.equal(hits, 0);
    } finally {
      await closeServer(server);
    }
  });
});

describe('submission catalog', () => {
  test('accepts an unchanged catalog and a row added at the bottom of a category', async () => {
    const same = await validate('base.md');
    assert.deepEqual(codes(same.failures), []);
    const appended = await validate('appended.md');
    assert.deepEqual(codes(appended.failures), []);
    assert.equal(appended.records.filter((record) => record.binding.product === 'Gamma').length, 1);
    const gamma = appended.records.find((record) => record.binding.product === 'Gamma');
    assert.equal(gamma.checks.discount.status, 'needs-human');
    assert.equal(gamma.checks.visualReview.status, 'pending');
    assert.equal(gamma.checks.logo.status, 'pending-trusted-generation');
    assert.equal(appended.records.some((record) => record.binding.product === 'Alpha'), false);
  });

  test('rejects reordered rows, mid-table inserts, and duplicates inside one category', async () => {
    const reordered = await validate('reorder.md');
    assert.ok(codes(reordered.failures).includes('reorder'));
    const inserted = await validate('inserted-middle.md');
    assert.ok(codes(inserted.failures).includes('insert'));
    assert.equal(codes(inserted.failures).includes('reorder'), false);
    const duplicate = await validate('duplicate.md');
    assert.ok(codes(duplicate.failures).includes('duplicate'));
    const multiCategory = await validate('base.md');
    assert.equal(codes(multiCategory.failures).includes('duplicate'), false);
  });

  test('flags free-only and expired offers, and leaves freemium paid plans for a person', async () => {
    const free = await validate('free-only.md');
    assert.ok(codes(free.failures).includes('discount'));
    assert.ok(codes(free.failures).includes('paidPlan'));
    const expired = await validate('expired.md');
    assert.deepEqual(codes(expired.failures), ['expiry']);
    assert.equal(expired.warnings.some((item) => item.code === 'discount'), true);
    const freemium = await validate('freemium-paid.md');
    assert.deepEqual(codes(freemium.failures), []);
    assert.match(
      freemium.warnings.find((item) => item.code === 'paidPlan').message,
      /freemium/i,
    );
    const ambiguous = await validate('ambiguous-offer.md');
    assert.deepEqual(codes(ambiguous.failures), []);
    assert.match(ambiguous.warnings.find((item) => item.code === 'discount').message, /does not state a discount/);
    for (const result of [free, expired, freemium, ambiguous]) {
      assert.equal(result.failures.some((item) => /quality|minimum discount|maturity/i.test(item.message)), false);
      assert.equal(result.records.every((record) => record.checks.visualReview.status === 'pending'), true);
    }
  });

  test('treats a missing date as unknown and an impossible date as invalid', async () => {
    const missing = readFixture('appended.md').replace('| 2026-12-20 |', '|  |');
    const missingResult = await validateSubmission({
      baseMarkdown: readFixture('base.md'),
      headMarkdown: missing,
      today: TODAY,
      headSha: 'abc123',
    });
    assert.equal(codes(missingResult.failures).includes('expiry'), false);
    assert.equal(missingResult.warnings.some((item) => item.code === 'expiry'), true);

    const impossible = readFixture('appended.md').replace('2026-12-20', '2026-13-40');
    const impossibleResult = await validateSubmission({
      baseMarkdown: readFixture('base.md'),
      headMarkdown: impossible,
      today: TODAY,
      headSha: 'abc123',
    });
    assert.ok(codes(impossibleResult.failures).includes('expiry'));
  });

  test('rejects private product links and a changed category tree', async () => {
    const head = readFixture('appended.md').replace(
      '| 🆕 | [Gamma](https://gamma.example) | A new paid tool. | **25% off** the paid plan | 2026-12-20 |',
      '| 🆕 | [Gamma](http://127.0.0.1/admin) | A new paid tool. | **25% off** the paid plan | 2026-12-20 |',
    );
    const result = await validateSubmission({
      baseMarkdown: readFixture('base.md'),
      headMarkdown: head,
      today: TODAY,
      headSha: 'abc123',
    });
    assert.ok(codes(result.failures).includes('website'));

    const renamed = await validateSubmission({
      baseMarkdown: readFixture('base.md'),
      headMarkdown: readFixture('base.md').replace('### macOS Apps', '### Desktop Apps'),
      today: TODAY,
      headSha: 'abc123',
    });
    assert.ok(codes(renamed.failures).includes('tree'));
  });

  test('checks included media bytes and documented override files without executing them', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-media-'));
    const product = path.join(root, 'gamma');
    fs.mkdirSync(product);
    fs.copyFileSync(path.join(FIXTURES, 'html-as.png'), path.join(product, 'og-image.png'));
    fs.writeFileSync(path.join(product, 'logo.png'), await png(1, 1));
    const bad = await validate('appended.md', { mediaRoot: root });
    assert.ok(bad.failures.some((item) => item.message.includes('HTML')));
    assert.ok(bad.failures.some((item) => item.message.includes('below the usable logo size')));

    fs.writeFileSync(path.join(product, 'logo.png'), await png(48, 48));
    fs.writeFileSync(path.join(product, 'og-image.png'), await png(800, 420));
    const good = await validate('appended.md', { mediaRoot: root });
    assert.deepEqual(codes(good.failures), []);
    const gamma = good.records.find((record) => record.binding.product === 'Gamma');
    assert.equal(gamma.checks.logo.status, 'pass');
    assert.equal(gamma.checks.banner.status, 'pass');

    const shipixen = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-override-'));
    fs.mkdirSync(path.join(shipixen, 'images'), { recursive: true });
    fs.writeFileSync(path.join(shipixen, 'images', 'logo.png'), await png(48, 48));
    const accepted = await validate('base.md', {
      overridesSource: "module.exports = { overrides: { alpha: { logo: 'images/logo.png' } } };",
      overrideRoot: shipixen,
    });
    assert.deepEqual(codes(accepted.failures), []);
    const executed = await validate('base.md', {
      overridesSource: "require('child_process').exec('touch owned')",
      overrideRoot: shipixen,
    });
    assert.ok(codes(executed.failures).includes('override'));
    const escaped = await validate('base.md', {
      overridesSource: "module.exports = { overrides: { alpha: { logo: '../../etc/passwd.png' } } };",
      overrideRoot: shipixen,
    });
    assert.ok(codes(escaped.failures).includes('override'));
  });
});

describe('evidence records', () => {
  test('binds the review to the pull request, head, product, and date, and does not repeat an action', () => {
    const binding = {
      pullRequest: 800,
      headSha: 'abc123',
      product: 'Gamma',
      category: 'Developer Tools',
      subcategory: 'macOS Apps',
      checkedOn: TODAY,
    };
    const first = machineRecord(binding, {
      discount: { status: 'needs-human', reason: 'stated only' },
    });
    const ledger = emptyLedger();
    upsertRecord(ledger, first);
    first.checks.visualReview = { status: 'rejected', reason: 'The page was an empty template.' };
    ledger.records[0].checks.visualReview = first.checks.visualReview;
    ledger.records[0].humanNotes = 'Looked at the homepage.';
    const claim = claimAction(ledger.records[0], 'screenshot', 'https://gamma.example');
    assert.equal(claim.claimed, true);
    assert.equal(claimAction(ledger.records[0], 'screenshot', 'https://gamma.example').claimed, false);

    const again = machineRecord(binding, {
      discount: { status: 'needs-human', reason: 'checked again' },
    });
    const updated = upsertRecord(ledger, again);
    assert.equal(updated.created, false);
    assert.equal(ledger.records.length, 1);
    assert.equal(ledger.records[0].checks.visualReview.status, 'rejected');
    assert.equal(ledger.records[0].humanNotes, 'Looked at the homepage.');
    assert.equal(ledger.records[0].actions.length, 1);
    assert.equal(ledger.records[0].checks.discount.reason, 'checked again');

    const otherDay = machineRecord({ ...binding, checkedOn: '2026-11-11' }, {});
    assert.notEqual(otherDay.id, first.id);
    assert.notEqual(bindingId({ ...binding, headSha: 'def456' }), first.id);
    assert.throws(() => machineRecord(binding, { visualReview: { status: 'pass', reason: 'no' } }));
  });
});

describe('screenshot fallback', () => {
  test('refuses a local target before starting a browser or contacting it', async () => {
    let hits = 0;
    let spawned = false;
    const server = net.createServer((socket) => {
      hits += 1;
      socket.destroy();
    });
    const port = await listen(server);
    try {
      await assert.rejects(() =>
        captureWebsiteScreenshot({
          url: `http://127.0.0.1:${port}/`,
          outputPath: path.join(os.tmpdir(), 'blocked.png'),
          spawnImpl: () => {
            spawned = true;
            throw new Error('browser started');
          },
        }),
      );
      assert.equal(spawned, false);
      assert.equal(hits, 0);
    } finally {
      await closeServer(server);
    }
  });

  test('proxy blocks metadata and only connects to the pinned public address', async () => {
    const connections = [];
    const proxy = await createPublicProxy({
      lookup: PUBLIC_LOOKUP,
      connectImpl: (ip, portNumber) => {
        connections.push({ ip, portNumber });
        return new PassThrough();
      },
    });
    const blocked = await new Promise((resolve, reject) => {
      const socket = net.connect(proxy.port, '127.0.0.1', () => {
        socket.write('CONNECT 169.254.169.254:80 HTTP/1.1\r\nHost: 169.254.169.254\r\n\r\n');
      });
      let data = '';
      socket.on('data', (chunk) => {
        data += chunk.toString('utf8');
        socket.end();
      });
      socket.on('end', () => resolve(data));
      socket.on('error', reject);
    });
    assert.match(blocked, /403/);
    assert.deepEqual(connections, []);

    const allowed = await new Promise((resolve, reject) => {
      const socket = net.connect(proxy.port, '127.0.0.1', () => {
        socket.write('CONNECT example.com:443 HTTP/1.1\r\nHost: example.com:443\r\nCookie: secret=1\r\n\r\n');
      });
      let data = '';
      socket.on('data', (chunk) => {
        data += chunk.toString('utf8');
        socket.destroy();
        resolve(data);
      });
      socket.on('error', (error) => {
        if (error.code !== 'ECONNRESET') reject(error);
      });
    });
    assert.match(allowed, /200 Connection Established/);
    assert.deepEqual(connections, [{ ip: '1.1.1.1', portNumber: 443 }]);
    await proxy.close();
  });

  test('uses a captured website screenshot when the share image is HTML', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-banner-'));
    const imagePath = path.join(dir, 'og-image.png');
    fs.writeFileSync(imagePath, fs.readFileSync(path.join(FIXTURES, 'html-as.png')));
    const banner = await png(800, 420);
    let captures = 0;
    const result = await ensureUsableBanner({
      imagePath,
      website: 'https://gamma.example',
      inspect: async (file) => inspectMedia(fs.readFileSync(file), 'banner'),
      capture: async ({ outputPath }) => {
        captures += 1;
        fs.writeFileSync(outputPath, banner);
        return { ok: true, inspection: await inspectMedia(banner, 'banner') };
      },
    });
    assert.equal(result.source, 'website-screenshot');
    assert.equal(captures, 1);
    assert.equal(fs.readFileSync(imagePath).equals(banner), true);

    let second = 0;
    const skipped = await ensureUsableBanner({
      imagePath: path.join(dir, 'missing.png'),
      website: 'https://gamma.example',
      claim: () => ({ claimed: false, reason: 'screenshot already captured for this review' }),
      capture: async () => {
        second += 1;
        return { ok: true, inspection: { ok: true, status: 'pass', reason: 'unused' } };
      },
    });
    assert.equal(second, 0);
    assert.equal(skipped.inspection.status, 'needs-human');
  });

  test('keeps a decodable official banner instead of replacing it', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-official-'));
    const imagePath = path.join(dir, 'og-image.png');
    const banner = await png(800, 420);
    fs.writeFileSync(imagePath, banner);
    let captures = 0;
    const result = await ensureUsableBanner({
      imagePath,
      website: 'https://gamma.example',
      capture: async () => {
        captures += 1;
        return { ok: false, inspection: { ok: false, status: 'fail', reason: 'should not run' } };
      },
    });
    assert.equal(result.source, 'og-image');
    assert.equal(captures, 0);
  });

  test(
    'captures example.com through the public proxy',
    { skip: process.env.RBD_LIVE_SCREENSHOT ? false : 'set RBD_LIVE_SCREENSHOT=1 to capture a real page' },
    async () => {
      const output = path.join(os.tmpdir(), `rbd-example-${process.pid}.png`);
      const seen = [];
      const result = await captureWebsiteScreenshot({
        url: 'https://example.com/',
        outputPath: output,
        timeoutMs: 30000,
        onDestination: (info) => seen.push(info),
      });
      assert.equal(result.ok, true, result.inspection && result.inspection.reason);
      assert.equal(result.inspection.width, 1200);
      assert.equal(result.inspection.height, 630);
      assert.ok(seen.length > 0);
      assert.ok(seen.every((item) => isPublicAddress(item.pinned)));
      const stats = await sharp(output).stats();
      const spread = stats.channels.reduce((sum, channel) => sum + channel.stdev, 0);
      assert.ok(spread > 0);
      fs.copyFileSync(output, process.env.RBD_LIVE_SCREENSHOT_OUT || output);
    },
  );
});

describe('live catalog', () => {
  test('the empty live README matches the committed category tree', async () => {
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    const treePath = path.join(__dirname, '..', 'catalog', 'catalog-tree.json');
    const readme = fs.readFileSync(readmePath, 'utf8');
    const result = await validateSubmission({
      baseMarkdown: readme,
      headMarkdown: readme,
      today: TODAY,
      tree: JSON.parse(fs.readFileSync(treePath, 'utf8')),
      overridesSource: fs.readFileSync(
        path.join(__dirname, '..', 'data', 'config', 'product-overrides.js'),
        'utf8',
      ),
      overrideRoot: path.join(__dirname, '..'),
      recordCatalog: false,
    });
    assert.deepEqual(result.failures, []);
    assert.equal(readmePath.includes(`${path.sep}archive${path.sep}`), false);
  });
});

describe('eligibility wording', () => {
  test('a free trial followed by a paid discount is not classified as free-only', () => {
    const findings = assessEligibility(
      {
        deal: 'Free trial, then 40% off the Pro plan',
        expires: '2026-12-01',
      },
      TODAY,
    );
    assert.equal(findings.some((item) => item.status === 'fail'), false);
    assert.equal(findings.find((item) => item.check === 'discount').status, 'needs-human');
  });
});
