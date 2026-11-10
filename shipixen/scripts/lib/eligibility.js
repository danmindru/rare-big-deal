const DISCOUNT_SIGNAL =
  /(\d+\s*%|\b(?:discount|coupon|promo)\s+code\b|\bcode\b|\bcoupon\b|\bpromo\b|\$\s?\d|€\s?\d|£\s?\d|\blifetime\b)/i;
const FREE_ONLY =
  /^(?:\*\*)?(?:100%\s*)?free(?:\s+forever|\s+only)?(?:\*\*)?$/i;
const FREE_ONLY_PHRASE =
  /\b(completely free|free forever|free tier only|free only|no paid plan|nothing to buy|100%\s*free)\b/i;

function plainDeal(deal) {
  return (deal || '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Objective text and date checks only. A stated discount is not treated as
 * proof that the price is live, and a freemium product with a discounted paid
 * plan is not rejected. Unknowns stay for a person.
 */
function assessEligibility(row, today) {
  const deal = plainDeal(row.deal);
  const findings = [];
  const expires = (row.expires || '').trim();

  if (!expires) {
    findings.push({
      check: 'expiry',
      status: 'needs-human',
      reason: 'No end date is written. A person has to confirm the offer is still running.',
    });
  } else if (!validDate(expires)) {
    findings.push({
      check: 'expiry',
      status: 'fail',
      reason: `Expiry "${expires}" is not a real YYYY-MM-DD date.`,
    });
  } else if (expires < today) {
    findings.push({
      check: 'expiry',
      status: 'fail',
      reason: `Offer date ${expires} is before ${today}.`,
    });
  } else {
    findings.push({
      check: 'expiry',
      status: 'pass',
      reason: `End date ${expires} is today or later. This does not prove the price on the site.`,
    });
  }

  const statesDiscount = DISCOUNT_SIGNAL.test(deal);
  const freeOnly = FREE_ONLY.test(deal) || (FREE_ONLY_PHRASE.test(deal) && !statesDiscount);

  if (!deal) {
    findings.push({
      check: 'discount',
      status: 'fail',
      reason: 'The deal cell is empty.',
    });
    findings.push({
      check: 'paidPlan',
      status: 'needs-human',
      reason: 'There is no deal text from which to judge a paid plan.',
    });
  } else if (freeOnly) {
    findings.push({
      check: 'discount',
      status: 'fail',
      reason: 'The deal text describes a free offer, not a discount on a paid product.',
    });
    findings.push({
      check: 'paidPlan',
      status: 'fail',
      reason: 'The deal text does not show a paid plan.',
    });
  } else if (statesDiscount) {
    findings.push({
      check: 'discount',
      status: 'needs-human',
      reason:
        'The deal text states a discount or a price. A person has to confirm it is live on the product site. No minimum discount is assumed.',
    });
    findings.push({
      check: 'paidPlan',
      status: 'needs-human',
      reason:
        'The deal text mentions a price or a paid offer. A person has to confirm the product normally costs money. A freemium product with a discounted paid plan is not rejected by this check.',
    });
  } else {
    findings.push({
      check: 'discount',
      status: 'needs-human',
      reason: 'The deal text does not state a discount that can be checked from the words alone.',
    });
    findings.push({
      check: 'paidPlan',
      status: 'needs-human',
      reason: 'The deal text does not prove or disprove a paid plan.',
    });
  }

  return findings;
}

module.exports = {
  assessEligibility,
  plainDeal,
  validDate,
};
