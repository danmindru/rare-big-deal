const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { describe, test } = require('node:test');
const { isExpiredOn, rankLeaderboard } = require('../data/leaderboards/rank');
const snapshot = require('../data/leaderboards/2026-11-12');
const leaderboards = require('../data/leaderboards');

const homeListPath = path.join(
  __dirname,
  '..',
  'components',
  'blog',
  'HomeList.tsx',
);
const popularDealsPath = path.join(
  __dirname,
  '..',
  'components',
  'leaderboard',
  'PopularDeals.tsx',
);

const shipixenRoot = path.join(__dirname, '..');
const AS_OF = '2026-11-12';

function readExpires(file) {
  const text = fs.readFileSync(file, 'utf8');
  const frontmatter = (text.match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const match = frontmatter.match(/^expiresOnDate:\s*(.*)$/m);
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function currentEditionProducts() {
  const dir = path.join(shipixenRoot, 'data', 'products');
  const products = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.slice(0, -4);
    products[slug] = {
      expiresOnDate: readExpires(path.join(dir, file)),
    };
  }
  return products;
}

function archivedProductSlugs() {
  const root = path.join(shipixenRoot, 'archive');
  const slugs = [];
  if (!fs.existsSync(root)) return slugs;
  for (const year of fs.readdirSync(root)) {
    const dir = path.join(root, year, 'products');
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.mdx')) slugs.push(file.slice(0, -4));
    }
  }
  return slugs;
}

describe('leaderboard ranking', () => {
  test('uses competition ranks and keeps source order inside a tie', () => {
    const entries = [
      { slug: 'low', count: 1 },
      { slug: 'tied-later', count: 2 },
      { slug: 'high', count: 3 },
      { slug: 'tied-earlier', count: 2 },
    ];
    const { ranked, skipped } = rankLeaderboard(entries, {
      products: {
        low: { expiresOnDate: '2026-12-01' },
        'tied-later': { expiresOnDate: '2026-12-01' },
        high: { expiresOnDate: '2026-12-01' },
        'tied-earlier': { expiresOnDate: '2026-12-01' },
      },
      today: AS_OF,
    });
    assert.deepEqual(skipped, []);
    assert.deepEqual(
      ranked.map((row) => [row.rank, row.slug, row.count]),
      [
        [1, 'high', 3],
        [2, 'tied-later', 2],
        [2, 'tied-earlier', 2],
        [4, 'low', 1],
      ],
    );
  });

  test('drops expired, archived, and unknown slugs without giving them a rank', () => {
    const entries = [
      { slug: 'live-high', count: 5 },
      { slug: 'ended', count: 5 },
      { slug: 'archived-deal', count: 4 },
      { slug: 'live-mid', count: 4 },
      { slug: 'mystery', count: 4 },
      { slug: 'live-low', count: 1 },
    ];
    const products = {
      'live-high': { expiresOnDate: '2026-12-01' },
      ended: { expiresOnDate: '2026-11-11' },
      'live-mid': { expiresOnDate: 'Never' },
      'live-low': { expiresOnDate: '' },
      'also-archived': { expiresOnDate: AS_OF },
    };
    const { ranked, skipped } = rankLeaderboard(entries, {
      products,
      archivedSlugs: ['archived-deal', 'also-archived'],
      today: AS_OF,
    });
    assert.deepEqual(
      ranked.map((row) => [row.rank, row.slug]),
      [
        [1, 'live-high'],
        [2, 'live-mid'],
        [3, 'live-low'],
      ],
    );
    assert.deepEqual(skipped, [
      { slug: 'ended', count: 5, reason: 'expired' },
      { slug: 'archived-deal', count: 4, reason: 'archived' },
      { slug: 'mystery', count: 4, reason: 'unknown' },
    ]);
  });

  test('a current deal wins over an archived copy, including on its end date', () => {
    const { ranked, skipped } = rankLeaderboard([{ slug: 'both', count: 2 }], {
      products: { both: { expiresOnDate: AS_OF } },
      archivedSlugs: ['both'],
      today: AS_OF,
    });
    assert.deepEqual(ranked, [{ slug: 'both', count: 2, rank: 1 }]);
    assert.deepEqual(skipped, []);
    assert.equal(isExpiredOn('2026-11-12', '2026-11-12'), false);
    assert.equal(isExpiredOn('2026-11-11', '2026-11-12'), true);
    assert.equal(isExpiredOn('Never', '2026-11-12'), false);
    assert.equal(isExpiredOn('', '2026-11-12'), false);
    assert.equal(isExpiredOn('2026-11-11T00:00:00.000Z', '2026-11-12'), true);
    assert.equal(isExpiredOn(new Date(2026, 10, 11), '2026-11-12'), true);
    assert.equal(isExpiredOn(new Date(2026, 10, 12), '2026-11-12'), false);
  });

  test('does not reorder or mutate the source rows', () => {
    const entries = [
      { slug: 'b', count: 2 },
      { slug: 'a', count: 2 },
    ];
    const before = structuredClone(entries);
    const products = {
      a: { expiresOnDate: '2026-12-01' },
      b: { expiresOnDate: '2026-12-01' },
    };
    rankLeaderboard(entries, { products, today: AS_OF });
    assert.deepEqual(entries, before);
    assert.deepEqual(Object.keys(products).sort(), ['a', 'b']);
  });
});

describe('2026-11-12 popularity snapshot', () => {
  test('stores the export counts in order and omits the other bucket', () => {
    assert.equal(leaderboards.current, snapshot);
    assert.equal(snapshot.id, '2026-11-12');
    assert.deepEqual(
      snapshot.entries.map((entry) => [entry.slug, entry.count]),
      [
        ['page-ai', 4],
        ['cooked', 3],
        ['shotomatic', 3],
        ['saventify', 2],
        ['cleanshot-x', 2],
        ['clipugc', 2],
        ['dnsdeck', 2],
        ['dynotable', 2],
        ['rapidform', 2],
        ['seedeo', 2],
        ['submanager', 2],
        ['uplock', 2],
        ['1bench', 1],
        ['broadcast', 1],
        ['craft-docs', 1],
        ['crontap', 1],
        ['darkroom', 1],
        ['focusmo', 1],
        ['labex', 1],
        ['pimosa', 1],
        ['pinvoy', 1],
        ['post-bridge', 1],
        ['rindstack', 1],
        ['tailkit', 1],
        ['yonder', 1],
      ],
    );
    assert.equal(
      snapshot.entries.some((entry) => String(entry.slug).includes('posthog')),
      false,
    );
  });

  test('ranks only active current-edition deals as of the export date', () => {
    const { ranked, skipped } = rankLeaderboard(snapshot.entries, {
      products: currentEditionProducts(),
      archivedSlugs: archivedProductSlugs(),
      today: AS_OF,
    });
    assert.deepEqual(
      ranked.map((row) => [row.rank, row.slug, row.count]),
      [
        [1, 'page-ai', 4],
        [2, 'cooked', 3],
        [2, 'shotomatic', 3],
        [4, 'saventify', 2],
        [4, 'clipugc', 2],
        [4, 'dynotable', 2],
        [4, 'rapidform', 2],
        [4, 'seedeo', 2],
        [4, 'submanager', 2],
        [10, '1bench', 1],
        [10, 'broadcast', 1],
        [10, 'pimosa', 1],
        [10, 'pinvoy', 1],
        [10, 'rindstack', 1],
        [10, 'yonder', 1],
      ],
    );
    assert.deepEqual(
      skipped.map((row) => [row.slug, row.reason]),
      [
        ['cleanshot-x', 'archived'],
        ['dnsdeck', 'archived'],
        ['uplock', 'archived'],
        ['craft-docs', 'archived'],
        ['crontap', 'archived'],
        ['darkroom', 'archived'],
        ['focusmo', 'archived'],
        ['labex', 'archived'],
        ['post-bridge', 'archived'],
        ['tailkit', 'archived'],
      ],
    );
    assert.deepEqual(
      ranked.slice(0, 5).map((row) => row.slug),
      ['page-ai', 'cooked', 'shotomatic', 'saventify', 'clipugc'],
    );
  });

  test('the homepage block is a short list after Best Apps, not another carousel', () => {
    const home = fs.readFileSync(homeListPath, 'utf8');
    const popular = fs.readFileSync(popularDealsPath, 'utf8');
    const top = home.indexOf('topShowcases.map');
    const block = home.indexOf('<PopularDeals />');
    assert.ok(top !== -1 && block > top);
    assert.equal(popular.includes('Showcase'), false);
    assert.equal(popular.includes('Embla'), false);
    assert.equal(/carousel/i.test(popular), false);
    assert.equal(popular.includes('HOMEPAGE_LIMIT = 5'), true);
  });
});
