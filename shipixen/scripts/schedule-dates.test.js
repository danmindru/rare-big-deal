const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { describe, test } = require('node:test');

const { applyMetaOverrides } = require('./apply-overrides');
const {
  buildMDXContent,
  generateMDXContent,
} = require('./generate-mdx-content');
const { assessEligibility, validFromDateInDeal } = require('./lib/eligibility');
const { parseCatalog } = require('./lib/readme-catalog');
const { parseReadme } = require('./parse-readme');
const { validateSubmission } = require('./validate-submission');

const README = path.join(__dirname, '..', '..', 'README.md');
const FIXTURES = path.join(__dirname, 'fixtures', 'submission');
const TODAY = '2026-11-10';

const HABIT_DEAL =
  '**33% OFF** Lifetime ($29.99 → $19.99), applied automatically in the app. Starts on 2026-11-19';
const JSON_DEAL =
  '**25% OFF** the first year of yearly plans with code **BF2026**: Professional $299.70 (was $399.60), Hobby $149.63 (was $199.50). Starts on 2026-11-24';

function table(rows) {
  return `## Productivity
### Todo Apps, Notes & Writing
| | Name | Description | Deal | Expires on date |
| - | - | - | - | - |
${rows}
`;
}

function row(
  deal,
  expires,
  name = 'Habit Pixel',
  description = 'A habit tracker.',
) {
  return `| ✅ | [${name}](https://habitpixel.com/get) | ${description} | ${deal} | ${expires} |`;
}

describe('validFromDate parsing', () => {
  test('reads an ISO start date and leaves the phrase in the deal cell', async () => {
    const apps = await parseReadme(table(row(HABIT_DEAL, '2026-12-02')));
    assert.equal(apps.length, 1);
    assert.equal(apps[0].validFromDate, '2026-11-19');
    assert.equal(apps[0].expiresOnDate, '2026-12-02');
    assert.equal(apps[0].deal, HABIT_DEAL);
    assert.equal(apps[0].deal.includes('Starts on 2026-11-19'), true);
  });

  test('ignores a missing phrase, a datetime, and a calendar date that is not real', async () => {
    assert.equal(validFromDateInDeal('**33% OFF** Lifetime'), '');
    assert.equal(validFromDateInDeal('Starts on 2026-11-19T00:00:00'), '');
    assert.equal(validFromDateInDeal('Starts on 2026-02-31'), '');
    assert.equal(validFromDateInDeal('starts on 2026-11-19'), '');
    const apps = await parseReadme(
      table(
        [
          row(
            '**33% OFF** Lifetime. Starts on 2026-11-19T00:00:00',
            '2026-12-02',
            'Datetime',
          ),
          row(
            '**33% OFF** Lifetime',
            '2026-12-02',
            'Plain',
            'The description says Starts on 2026-11-01.',
          ),
        ].join('\n'),
      ),
    );
    assert.deepEqual(
      apps.map((app) => app.validFromDate),
      ['', ''],
    );
    assert.equal(apps[1].description.includes('Starts on 2026-11-01'), true);
    assert.equal(apps[1].deal.includes('Starts on'), false);
  });

  test('rejects a start date after the end date and allows the same day', async () => {
    await assert.rejects(
      () =>
        parseReadme(
          table(
            row('**33% OFF** Lifetime. Starts on 2026-12-03', '2026-12-02'),
          ),
        ),
      (error) =>
        error.message ===
        'Habit Pixel: Start date 2026-12-03 is after end date 2026-12-02.',
    );
    const sameDay = await parseReadme(
      table(row('**33% OFF** Lifetime. Starts on 2026-12-02', '2026-12-02')),
    );
    assert.equal(sameDay[0].validFromDate, '2026-12-02');
    assert.equal(sameDay[0].expiresOnDate, '2026-12-02');
  });
});

describe('validFromDate MDX generation', () => {
  test('writes validFromDate beside expiresOnDate and keeps the deal phrase', () => {
    const mdx = buildMDXContent({
      name: 'Habit Pixel',
      description: 'A habit tracker.',
      deal: HABIT_DEAL,
      website: 'https://habitpixel.com/get',
      expiresOnDate: '2026-12-02',
      categories: ['Productivity'],
      subcategories: ['Todo Apps, Notes & Writing'],
    });
    assert.match(mdx, /^validFromDate: 2026-11-19$/m);
    assert.match(mdx, /^expiresOnDate: 2026-12-02$/m);
    assert.match(
      mdx,
      /website: https:\/\/habitpixel\.com\/get\nvalidFromDate: 2026-11-19\nexpiresOnDate: 2026-12-02\nlayout: ProductLayout/,
    );
    assert.equal(mdx.includes('Starts on 2026-11-19'), true);
  });

  test('writes a file when the start date is present and refuses an inverted range', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbd-mdx-'));
    await generateMDXContent(
      {
        name: 'JSON2Video',
        description: 'A video API.',
        deal: JSON_DEAL,
        website: 'https://json2video.com/pricing/blackfriday-2026/',
        expiresOnDate: '2026-12-01',
        categories: ['Developer Tools'],
        subcategories: ['APIs, Tools & SaaS'],
      },
      dir,
    );
    const written = fs.readFileSync(path.join(dir, 'json2video.mdx'), 'utf8');
    assert.match(written, /^validFromDate: 2026-11-24$/m);
    assert.match(written, /^expiresOnDate: 2026-12-01$/m);
    assert.equal(written.includes('?c=rbd'), false);
    assert.equal(written.includes('BF2026RBD'), false);

    await assert.rejects(
      () =>
        generateMDXContent(
          {
            name: 'Late Start',
            description: 'A paid tool.',
            deal: '**10% OFF** the paid plan. Starts on 2026-12-05',
            website: 'https://late.example',
            expiresOnDate: '2026-12-01',
            categories: [],
            subcategories: [],
          },
          dir,
        ),
      (error) =>
        error.message ===
        'Late Start: Start date 2026-12-05 is after end date 2026-12-01.',
    );
    assert.equal(fs.existsSync(path.join(dir, 'late-start.mdx')), false);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('applyMetaOverrides forwards validFromDate the same way as expiresOnDate', () => {
    const app = {
      description: 'A habit tracker.',
      deal: HABIT_DEAL,
      website: 'https://habitpixel.com/get',
      expiresOnDate: '2026-12-02',
      validFromDate: '2026-11-19',
    };
    const passed = applyMetaOverrides('habit-pixel', app, {});
    assert.equal(passed.validFromDate, '2026-11-19');
    assert.equal(passed.expiresOnDate, '2026-12-02');

    const overridden = applyMetaOverrides('habit-pixel', app, {
      'habit-pixel': {
        validFromDate: '2026-11-20',
        expiresOnDate: '2026-12-03',
      },
    });
    assert.equal(overridden.validFromDate, '2026-11-20');
    assert.equal(overridden.expiresOnDate, '2026-12-03');
    const mdx = buildMDXContent({
      ...app,
      name: 'Habit Pixel',
      categories: ['Productivity'],
      subcategories: [],
    });
    assert.match(mdx, /^validFromDate: 2026-11-19$/m);
  });

  test('leaves expiresOnDate-only deals without a start field', () => {
    const mdx = buildMDXContent({
      name: 'Shotomatic',
      description: 'Screenshots.',
      deal: '**40% OFF** Lifetime licenses with code **BF2026**',
      website: 'https://shotomatic.com',
      expiresOnDate: '2026-12-31',
      categories: ['Developer Tools'],
      subcategories: ['macOS Apps'],
    });
    assert.equal(mdx.includes('validFromDate'), false);
    assert.match(mdx, /^expiresOnDate: 2026-12-31$/m);
  });
});

describe('scheduled deal eligibility', () => {
  test('a future start is allowed when the end date is today or later', () => {
    const findings = assessEligibility(
      { deal: JSON_DEAL, expires: '2026-12-01' },
      TODAY,
    );
    assert.equal(
      findings.some((item) => item.status === 'fail'),
      false,
    );
    assert.equal(
      findings.find((item) => item.check === 'expiry').status,
      'pass',
    );

    const missingEnd = assessEligibility(
      { deal: JSON_DEAL, expires: '' },
      TODAY,
    );
    assert.equal(
      missingEnd.find((item) => item.check === 'expiry').status,
      'needs-human',
    );
    assert.equal(
      missingEnd.some((item) => item.status === 'fail'),
      false,
    );
  });

  test('a start after the end fails, and a past end date still fails', () => {
    const inverted = assessEligibility(
      {
        deal: '**25% OFF** yearly. Starts on 2026-12-03',
        expires: '2026-12-01',
      },
      TODAY,
    );
    assert.equal(
      inverted.find((item) => item.check === 'expiry').status,
      'fail',
    );
    assert.match(
      inverted.find((item) => item.check === 'expiry').reason,
      /after end date/,
    );

    const pastEnd = assessEligibility(
      {
        deal: '**25% OFF** yearly. Starts on 2026-11-19',
        expires: '2026-11-01',
      },
      TODAY,
    );
    assert.equal(
      pastEnd.find((item) => item.check === 'expiry').status,
      'fail',
    );
    assert.match(
      pastEnd.find((item) => item.check === 'expiry').reason,
      /before 2026-11-10/,
    );
  });

  test('the submission check accepts a future start at the bottom and rejects an inverted one', async () => {
    const base = fs.readFileSync(path.join(FIXTURES, 'base.md'), 'utf8');
    const alpha =
      '| 🧰 | [Alpha](https://alpha.example) | A paid tool for shipping. | **30% off** the Pro plan with code SAVE | 2026-12-01 |';
    const withStart = base.replace(
      alpha,
      `${alpha}\n| 🎬 | [JSON2Video](https://json2video.com/pricing/blackfriday-2026/) | Video API. | ${JSON_DEAL} | 2026-12-01 |`,
    );
    const accepted = await validateSubmission({
      baseMarkdown: base,
      headMarkdown: withStart,
      today: TODAY,
      headSha: 'abc123',
    });
    assert.equal(
      accepted.failures.some((item) => item.code === 'expiry'),
      false,
    );
    assert.deepEqual(accepted.failures, []);

    const inverted = base.replace(
      alpha,
      `${alpha}\n| 🎬 | [JSON2Video](https://json2video.com/pricing/blackfriday-2026/) | Video API. | **25% OFF** yearly. Starts on 2026-12-03 | 2026-12-01 |`,
    );
    const rejected = await validateSubmission({
      baseMarkdown: base,
      headMarkdown: inverted,
      today: TODAY,
      headSha: 'abc123',
    });
    assert.equal(
      rejected.failures.some((item) => item.code === 'expiry'),
      true,
    );
    assert.match(
      rejected.failures.find((item) => item.code === 'expiry').message,
      /after end date/,
    );
  });
});

describe('scheduled README rows', () => {
  test('Habit Pixel and JSON2Video keep their scheduled rows', async () => {
    const readme = fs.readFileSync(README, 'utf8');
    const catalog = parseCatalog(readme);
    const todos = catalog.tables.find(
      (entry) =>
        entry.category === 'Productivity' &&
        entry.subcategory === 'Todo Apps, Notes & Writing',
    );
    const apis = catalog.tables.find(
      (entry) =>
        entry.category === 'Developer Tools' &&
        entry.subcategory === 'APIs, Tools & SaaS',
    );
    const habitRow = todos.rows.find((entry) => entry.name === 'Habit Pixel');
    const jsonRow = apis.rows.find((entry) => entry.name === 'JSON2Video');
    // Added at the bottom of tables that had no other rows. Later deals are
    // appended after these, so these rows stay first. The tables can list more products.
    assert.ok(habitRow);
    assert.ok(jsonRow);
    assert.equal(todos.rows[0], habitRow);
    assert.equal(apis.rows[0], jsonRow);
    assert.equal(habitRow.website, 'https://habitpixel.com/get');
    assert.equal(habitRow.expires, '2026-12-02');
    assert.equal(habitRow.deal, HABIT_DEAL);
    assert.equal(
      jsonRow.website,
      'https://json2video.com/pricing/blackfriday-2026/',
    );
    assert.equal(jsonRow.expires, '2026-12-01');
    assert.equal(jsonRow.deal, JSON_DEAL);
    assert.equal(jsonRow.website.includes('c=rbd'), false);
    assert.equal(jsonRow.deal.includes('BF2026'), true);
    assert.equal(jsonRow.deal.includes('BF2026RBD'), false);

    const aiTools = catalog.tables.find(
      (entry) =>
        entry.category === 'AI Tools' &&
        entry.subcategory === 'Developer Tools',
    );
    const misc = catalog.tables.find(
      (entry) =>
        entry.category === 'Miscellaneous' && entry.subcategory === 'All',
    );
    const mac = catalog.tables.find(
      (entry) =>
        entry.category === 'Developer Tools' &&
        entry.subcategory === 'macOS Apps',
    );
    assert.equal(aiTools.rows[0].name, 'Page AI');
    assert.equal(misc.rows[0].name, 'Saventify');
    assert.equal(mac.rows[0].name, 'Shotomatic');

    const apps = await parseReadme(readme);
    const habit = apps.find((app) => app.name === 'Habit Pixel');
    const json = apps.find((app) => app.name === 'JSON2Video');
    const shotomatic = apps.find((app) => app.name === 'Shotomatic');
    assert.equal(habit.validFromDate, '2026-11-19');
    assert.equal(habit.categories[0], 'Productivity');
    assert.equal(habit.subcategories[0], 'Todo Apps, Notes & Writing');
    assert.equal(json.validFromDate, '2026-11-24');
    assert.equal(json.categories[0], 'Developer Tools');
    assert.equal(json.subcategories[0], 'APIs, Tools & SaaS');
    assert.equal(shotomatic.validFromDate, '');
    assert.equal(shotomatic.expiresOnDate, '2026-12-31');

    const habitMdx = buildMDXContent(habit);
    const jsonMdx = buildMDXContent(json);
    assert.match(habitMdx, /^validFromDate: 2026-11-19$/m);
    assert.match(habitMdx, /^expiresOnDate: 2026-12-02$/m);
    assert.match(jsonMdx, /^validFromDate: 2026-11-24$/m);
    assert.match(jsonMdx, /^expiresOnDate: 2026-12-01$/m);
  });
});
