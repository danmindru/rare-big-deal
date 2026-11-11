const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const { withOutboundRef } = require('../lib/outbound-ref');

describe('withOutboundRef', () => {
  test('bare URL', () => {
    assert.equal(
      withOutboundRef('https://example.com/deal'),
      'https://example.com/deal?ref=rbd',
    );
    assert.equal(
      withOutboundRef('//github.com/danmindru/rare-big-deal'),
      '//github.com/danmindru/rare-big-deal?ref=rbd',
    );
  });

  test('existing query', () => {
    assert.equal(
      withOutboundRef('https://example.com/deal?code=BF'),
      'https://example.com/deal?code=BF&ref=rbd',
    );
  });

  test('hash', () => {
    assert.equal(
      withOutboundRef('https://example.com/deal#pricing'),
      'https://example.com/deal?ref=rbd#pricing',
    );
    assert.equal(
      withOutboundRef('https://example.com/deal?code=BF#pricing'),
      'https://example.com/deal?code=BF&ref=rbd#pricing',
    );
  });

  test('already has ref=rbd', () => {
    assert.equal(
      withOutboundRef('https://example.com/deal?ref=rbd'),
      'https://example.com/deal?ref=rbd',
    );
    assert.equal(
      withOutboundRef('https://example.com/deal?code=BF&ref=rbd#pricing'),
      'https://example.com/deal?code=BF&ref=rbd#pricing',
    );
  });

  test('internal and relative links', () => {
    assert.equal(withOutboundRef('/products/page-ai'), '/products/page-ai');
    assert.equal(withOutboundRef('#pricing'), '#pricing');
    assert.equal(
      withOutboundRef('../archive/2024/README.md'),
      '../archive/2024/README.md',
    );
    assert.equal(
      withOutboundRef('https://rarebigdeal.com/products/page-ai'),
      'https://rarebigdeal.com/products/page-ai',
    );
    assert.equal(
      withOutboundRef('https://www.rarebigdeal.com/categories/ai-tools?x=1#y'),
      'https://www.rarebigdeal.com/categories/ai-tools?x=1#y',
    );
    assert.equal(
      withOutboundRef('//rarebigdeal.com/products/page-ai'),
      '//rarebigdeal.com/products/page-ai',
    );
    assert.equal(
      withOutboundRef('mailto:hello@example.com'),
      'mailto:hello@example.com',
    );
    assert.equal(withOutboundRef('tel:+15551212'), 'tel:+15551212');
    assert.equal(withOutboundRef('javascript:void(0)'), 'javascript:void(0)');
  });

  test('invalid and empty input', () => {
    assert.equal(withOutboundRef(''), '');
    assert.equal(withOutboundRef('   '), '   ');
    assert.equal(withOutboundRef('not a url'), 'not a url');
    assert.equal(
      withOutboundRef('[LINK TO RETURN POLICY]'),
      '[LINK TO RETURN POLICY]',
    );
    assert.equal(withOutboundRef(null), null);
    assert.equal(withOutboundRef(undefined), undefined);
  });
});
