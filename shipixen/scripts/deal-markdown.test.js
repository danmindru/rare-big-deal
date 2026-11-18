const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { prepareDealMarkdown } = require('../lib/deal-markdown');

const EZYSTUDIO =
  '**10% OFF** every payment, for good, on every regular plan (monthly, yearly or lifetime) with code **EARLYBF26**: Website ~~$5~~ $4.50/mo billed yearly, App ~~$24~~ $21.60/mo, Business ~~$39~~ $35.10/mo';

describe('prepareDealMarkdown', () => {
  test('turns README line breaks into markdown hard breaks', () => {
    assert.equal(
      prepareDealMarkdown('A.<br>B.<br/>C.<br />D.<BR>E'),
      'A.  \nB.  \nC.  \nD.  \nE',
    );
    assert.equal(prepareDealMarkdown('plain **bold**'), 'plain **bold**');
    assert.equal(prepareDealMarkdown(''), '');
    assert.equal(prepareDealMarkdown(null), '');
  });
});

describe('deal markdown on cards', () => {
  test('renders strikethrough prices, emphasis, code, and breaks, and drops links', async () => {
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
    const DealMarkdown = await loadDealMarkdown();

    const html = renderToStaticMarkup(
      React.createElement(DealMarkdown, null, EZYSTUDIO),
    );
    assert.match(html, /<del[^>]*>\$5<\/del>/);
    assert.match(html, /<del[^>]*>\$24<\/del>/);
    assert.match(html, /<del[^>]*>\$39<\/del>/);
    assert.match(html, /<strong[^>]*>10% OFF<\/strong>/);
    assert.match(html, /<strong[^>]*>EARLYBF26<\/strong>/);
    assert.match(html, /\$4\.50\/mo/);
    assert.equal(html.includes('~~'), false);
    assert.match(html, /text-gray-500/);
    assert.match(html, /line-through/);
    assert.match(html, /font-semibold/);

    const withBreaks = renderToStaticMarkup(
      React.createElement(
        DealMarkdown,
        null,
        'New users get **60% off** with code **BF60**.<br>Pro: $91.20.<br />Max: $283.20. Use `BF60`. See [details](https://example.com/deal).',
      ),
    );
    assert.equal(withBreaks.includes('&lt;br'), false);
    assert.match(withBreaks, /<br\s*\/?>/);
    assert.match(withBreaks, /<code[^>]*>BF60<\/code>/);
    assert.match(withBreaks, /<strong[^>]*>60% off<\/strong>/);
    assert.match(withBreaks, /details/);
    assert.equal(withBreaks.includes('<a'), false);
    assert.equal(withBreaks.includes('https://'), false);

    const wrappedLink = renderToStaticMarkup(
      React.createElement(
        DealMarkdown,
        null,
        '**50% OFF** ([Black Friday page](https://sipapp.io/blackfriday/))',
      ),
    );
    assert.match(wrappedLink, /\(Black Friday page\)/);
    assert.equal(wrappedLink.includes('()'), false);
    assert.equal(wrappedLink.includes('https://'), false);
    assert.equal(wrappedLink.includes('<a'), false);
  });

  test('keeps product MDX on remark-gfm 3 and stops single-dollar math from eating prices', async () => {
    const root = path.join(__dirname, '..');
    const v3 = JSON.parse(
      fs.readFileSync(
        path.join(root, 'node_modules/remark-gfm/package.json'),
        'utf8',
      ),
    ).version;
    const v4 = JSON.parse(
      fs.readFileSync(
        path.join(root, 'node_modules/remark-gfm-react/package.json'),
        'utf8',
      ),
    ).version;
    assert.equal(v3.startsWith('3.'), true);
    assert.equal(v4.startsWith('4.'), true);

    const config = fs.readFileSync(
      path.join(root, 'contentlayer.config.ts'),
      'utf8',
    );
    assert.match(config, /from 'remark-gfm'/);
    assert.match(config, /singleDollarTextMath: false/);
    assert.equal(config.includes('remark-gfm-react'), false);

    const { remark } = await import('remark');
    const remarkGfm = (await import('remark-gfm')).default;
    const remarkMath = (await import('remark-math')).default;
    const remarkRehype = (await import('remark-rehype')).default;
    const rehypeStringify = (await import('rehype-stringify')).default;
    const file = await remark()
      .use(remarkGfm)
      .use(remarkMath, { singleDollarTextMath: false })
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(EZYSTUDIO);
    const html = String(file);
    assert.match(html, /<del>\$5<\/del>/);
    assert.match(html, /<del>\$24<\/del>/);
    assert.match(html, /<del>\$39<\/del>/);
    assert.equal(html.includes('math-inline'), false);
    assert.equal(html.includes('~~'), false);
  });
});

async function loadDealMarkdown() {
  const esbuild = require('esbuild');
  const outfile = path.join(
    __dirname,
    '../node_modules/.cache/deal-markdown-test.cjs',
  );
  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  await esbuild.build({
    absWorkingDir: path.join(__dirname, '..'),
    entryPoints: ['components/shared/DealMarkdown.tsx'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outfile,
    // react-markdown and remark-gfm are ESM. Bundle them. React stays shared
    // with react-dom/server, so this file has to live under the app.
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    jsx: 'automatic',
    alias: {
      '@/lib/deal-card-text': path.join(__dirname, '../lib/deal-card-text.js'),
      '@/lib/deal-markdown': path.join(__dirname, '../lib/deal-markdown.js'),
    },
  });
  delete require.cache[outfile];
  return require(outfile).DealMarkdown;
}
