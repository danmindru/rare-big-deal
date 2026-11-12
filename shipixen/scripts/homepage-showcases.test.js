const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { describe, test } = require('node:test');
const {
  dedupeHomepagePacks,
  homepageCategoryOrder,
  packKey,
  visibleHomepageShowcases,
} = require('../data/homepage-showcases');

const homeListPath = path.join(__dirname, '..', 'components', 'blog', 'HomeList.tsx');

describe('homepage showcase dedupe', () => {
  test('does not render a second carousel that only repeats Best Apps', () => {
    const visible = dedupeHomepagePacks([
      {
        name: 'Best Apps',
        description: 'highlight',
        apps: ['Page AI', 'Saventify'],
        placement: 'top',
      },
      {
        name: 'Best AI Apps',
        description: 'ai',
        apps: ['Page AI'],
        beforeCategory: 'AI Tools',
      },
      {
        name: 'Glorious Marketing Apps',
        description: 'marketing',
        apps: ['Page AI'],
        beforeCategory: 'Marketing',
      },
      {
        name: 'Niche Apps',
        description: 'niche',
        apps: ['Saventify'],
        beforeCategory: 'Learning',
      },
    ]);
    assert.deepEqual(
      visible.map((pack) => pack.name),
      ['Best Apps'],
    );
    assert.deepEqual(visible[0].apps, ['Page AI', 'Saventify']);
  });

  test('keeps a product that was not already shown and drops the overlap', () => {
    const source = ['Page AI', 'Other Tool'];
    const visible = dedupeHomepagePacks([
      { name: 'Best Apps', description: '', apps: ['Page AI', 'Saventify'] },
      { name: 'Best AI Apps', description: '', apps: source },
      { name: 'Copy of Best Apps', description: '', apps: ['Saventify', 'Page AI'] },
    ]);
    assert.deepEqual(source, ['Page AI', 'Other Tool']);
    assert.deepEqual(
      visible.map((pack) => ({ name: pack.name, apps: pack.apps })),
      [
        { name: 'Best Apps', apps: ['Page AI', 'Saventify'] },
        { name: 'Best AI Apps', apps: ['Other Tool'] },
      ],
    );
  });

  test('omits an empty pack and a pack that repeats one product inside itself', () => {
    const visible = dedupeHomepagePacks([
      { name: 'Empty', description: '', apps: [] },
      { name: 'Repeated', description: '', apps: ['Page AI', 'Page AI'] },
    ]);
    assert.deepEqual(visible.map((pack) => pack.apps), [['Page AI']]);
  });

  test('the live homepage keeps Page AI and Saventify in Best Apps and does not repeat them', () => {
    const visible = visibleHomepageShowcases([
      'AI Tools',
      'Marketing',
      'Learning',
      'Miscellaneous',
    ]);
    assert.equal(visible[0].name, 'Best Apps');
    assert.equal(visible[0].placement, 'top');
    assert.deepEqual(visible[0].apps, ['Page AI', 'Saventify', 'Sip']);
    assert.deepEqual(visible[0].apps.slice(0, 2), ['Page AI', 'Saventify']);
    const seen = new Set();
    for (const pack of visible) {
      for (const app of pack.apps) {
        const key = packKey(app);
        assert.equal(seen.has(key), false, `${app} would render in two homepage carousels`);
        seen.add(key);
      }
    }
    assert.equal(
      visible.some((pack) => pack.name === 'Best AI Apps' && pack.apps.includes('Page AI')),
      false,
    );
    assert.equal(
      visible.some((pack) => pack.apps.includes('Page AI') && pack.name !== 'Best Apps'),
      false,
    );
    assert.equal(
      visible.some((pack) => pack.apps.includes('Saventify') && pack.name !== 'Best Apps'),
      false,
    );
    const order = homepageCategoryOrder(['Learning', 'AI Tools', 'Miscellaneous']);
    assert.equal(order[0], 'AI Tools');
    assert.ok(order.indexOf('Marketing') < order.indexOf('Learning'));
  });

  test('the homepage renders showcases from the deduped list', () => {
    const source = fs.readFileSync(homeListPath, 'utf8');
    assert.match(source, /homepageShowcases\.visibleHomepageShowcases\(Object\.keys\(categories\)\)/);
    assert.match(source, /homepageShowcases\.homepageCategoryOrder\(Object\.keys\(categories\)\)/);
    assert.match(source, /showcase=\{showcaseByCategory\[category\] \?\? null\}/);
    assert.equal(source.includes('bundle={bestApps}'), false);
    assert.equal(source.includes('bundle={aiApps}'), true);
    assert.match(source, /showcase === undefined/);
  });
});
