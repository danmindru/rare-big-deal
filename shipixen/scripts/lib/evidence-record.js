const crypto = require('crypto');

const VISUAL_REVIEW = {
  status: 'pending',
  reason:
    'A person still has to look at the product site. Machine checks do not decide product quality or replace that review.',
};

function bindingId(binding) {
  const canonical = JSON.stringify({
    pullRequest: binding.pullRequest ?? null,
    headSha: binding.headSha,
    product: binding.product,
    category: binding.category,
    subcategory: binding.subcategory || '',
    checkedOn: binding.checkedOn,
  });
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

function machineRecord(binding, checks, extra = {}) {
  if (checks.visualReview && checks.visualReview.status !== 'pending') {
    throw new Error('a machine record cannot set visual review');
  }
  const record = {
    schemaVersion: 1,
    id: bindingId(binding),
    binding: {
      pullRequest: binding.pullRequest ?? null,
      headSha: binding.headSha,
      product: binding.product,
      category: binding.category,
      subcategory: binding.subcategory || '',
      checkedOn: binding.checkedOn,
    },
    website: extra.website || null,
    checks: {
      ...checks,
      visualReview: VISUAL_REVIEW,
    },
    humanNotes: null,
    actions: [],
  };
  return record;
}

function emptyLedger() {
  return { schemaVersion: 1, records: [] };
}

/**
 * Insert or refresh a machine record. The same binding does not create a
 * second record. A person's visual review and notes, and any action already
 * claimed, are left in place.
 */
function upsertRecord(ledger, incoming) {
  if (!ledger.records) ledger.records = [];
  if (incoming.checks.visualReview?.status !== 'pending') {
    throw new Error('a machine record cannot set visual review');
  }
  const existing = ledger.records.find((record) => record.id === incoming.id);
  if (!existing) {
    ledger.records.push(structuredClone(incoming));
    return { created: true, record: ledger.records[ledger.records.length - 1] };
  }
  const preservedReview = existing.checks.visualReview;
  existing.website = incoming.website;
  existing.checks = {
    ...incoming.checks,
    visualReview:
      preservedReview && preservedReview.status !== 'pending'
        ? preservedReview
        : incoming.checks.visualReview,
  };
  existing.actions = existing.actions || [];
  return { created: false, record: existing };
}

function claimAction(record, type, target) {
  const key = `${type}:${target}`;
  record.actions = record.actions || [];
  if (record.actions.some((action) => action.key === key)) {
    return { claimed: false, key, reason: 'this action was already claimed for the review' };
  }
  record.actions.push({
    key,
    type,
    target,
    status: 'started',
    at: new Date().toISOString(),
  });
  return { claimed: true, key };
}

function finishAction(record, key, status) {
  const action = (record.actions || []).find((item) => item.key === key);
  if (!action) return false;
  action.status = status;
  return true;
}

module.exports = {
  VISUAL_REVIEW,
  bindingId,
  claimAction,
  emptyLedger,
  finishAction,
  machineRecord,
  upsertRecord,
};
