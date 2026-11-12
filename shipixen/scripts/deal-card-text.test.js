const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { dealCardText } = require('../lib/deal-card-text');

describe('dealCardText', () => {
  test('keeps link text and drops the URL, including parentheses wrapped around the link', () => {
    const deal =
      '**50% OFF** ($29.99 per seat, 1 year of updates) with code **BLACKFRIDAY26** on Nov 27–29 ([Black Friday page](https://sipapp.io/blackfriday/)) and code **CYBERMONDAY26** on Nov 30–Dec 2 ([Cyber Monday page](https://sipapp.io/cybermonday/)). Starts on 2026-11-27';
    assert.equal(
      dealCardText(deal),
      '**50% OFF** ($29.99 per seat, 1 year of updates) with code **BLACKFRIDAY26** on Nov 27–29 (Black Friday page) and code **CYBERMONDAY26** on Nov 30–Dec 2 (Cyber Monday page). Starts on 2026-11-27',
    );
    assert.equal(dealCardText(deal).includes('()'), false);
    assert.equal(dealCardText(deal).includes('https://'), false);
  });

  test('keeps a bare link label and leaves deals without links unchanged', () => {
    assert.equal(
      dealCardText('25% OFF with the [iKnow Suite](https://iknowmydisplay.com/suite)'),
      '25% OFF with the iKnow Suite',
    );
    assert.equal(dealCardText('**40% OFF** with code **BF2026**'), '**40% OFF** with code **BF2026**');
    assert.equal(dealCardText(''), '');
  });
});
