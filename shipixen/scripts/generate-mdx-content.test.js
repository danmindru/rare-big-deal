const assert = require('node:assert/strict');
const { describe, test } = require('node:test');

const {
  buildMDXContent,
  normalizeVoidHtmlTags,
} = require('./generate-mdx-content');

function radiantlyApp(overrides = {}) {
  return {
    name: 'Radiantly',
    description:
      'Radiantly helps experts turn knowledge into agents.<br>Personalized for each client.',
    deal: 'New users get **60% off** with code **BF60**.<br>Pro: $91.20.<br/>Max: $283.20.<hr>Valid through Dec 15.',
    website: 'https://radiantly.space/pricing',
    expiresOnDate: '2026-12-15',
    categories: ['AI Tools'],
    subcategories: ['Productivity'],
    metaTitle: 'Radiantly<br>agents',
    metaDescription: 'Details<hr class="rule">for the page.',
    ...overrides,
  };
}

function leftoverVoidTags(source) {
  const closed = source.replace(
    /<(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b[^<>]*\/>/gi,
    '',
  );
  return closed.match(
    /<\/?(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/gi,
  );
}

describe('void HTML tags in generated MDX', () => {
  test('self-closes README <br> and other void tags in deal and description text', () => {
    const mdx = buildMDXContent(radiantlyApp());
    assert.equal(leftoverVoidTags(mdx), null);
    assert.match(mdx, /<br \/>/);
    assert.match(mdx, /<hr \/>/);
    assert.match(mdx, /<hr class="rule" \/>/);
    assert.equal(mdx.includes('<br/>'), false);
    assert.equal(mdx.includes('<hr>'), false);

    const dealLine =
      'New users get **60% off** with code **BF60**.<br />Pro: $91.20.<br />Max: $283.20.<hr />Valid through Dec 15.';
    assert.equal(mdx.split(dealLine).length - 1, 2);

    assert.match(
      mdx,
      /summary: >\n {2}Radiantly helps experts[\s\S]*<br \/>Personalized/,
    );
    assert.match(
      mdx,
      /## Product Overview\n\nRadiantly helps experts[\s\S]*<br \/>Personalized/,
    );
    assert.match(mdx, /metaTitle: >\n {2}Radiantly<br \/>agents/);
    assert.match(mdx, /## Product Details\n\nRadiantly<br \/>agents/);
  });

  test('self-closes void tags copied from a JSON-LD description', () => {
    const mdx = buildMDXContent(
      radiantlyApp({
        jsonLd: { description: 'Agents.<br>For experts.' },
      }),
    );
    assert.match(mdx, /## Product Overview\n\nAgents\.<br \/>For experts\./);
    assert.equal(leftoverVoidTags(mdx), null);
  });

  test('keeps markdown code samples and non-void markup', () => {
    assert.equal(
      normalizeVoidHtmlTags('Write `<br>` in HTML, then <br> in the page.'),
      'Write `<br>` in HTML, then <br /> in the page.',
    );
    assert.equal(
      normalizeVoidHtmlTags('```html\n<br>\n```\n<br>'),
      '```html\n<br>\n```\n<br />',
    );
    assert.equal(
      normalizeVoidHtmlTags('<span>ok</span> and 1 < 2'),
      '<span>ok</span> and 1 < 2',
    );
    assert.equal(
      normalizeVoidHtmlTags('<metaDescription>'),
      '<metaDescription>',
    );
    assert.equal(normalizeVoidHtmlTags('<br></br>'), '<br />');
    assert.equal(normalizeVoidHtmlTags('<BR/>'), '<br />');
    assert.equal(
      normalizeVoidHtmlTags('already <br /> fine'),
      'already <br /> fine',
    );
    assert.equal(
      normalizeVoidHtmlTags('<img src="a.png" alt="b">'),
      '<img src="a.png" alt="b" />',
    );
    assert.equal(normalizeVoidHtmlTags(null), null);
    assert.equal(normalizeVoidHtmlTags(undefined), undefined);
  });
});
