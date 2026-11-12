const ISO_DAY = /^(\d{4}-\d{2}-\d{2})/;

function calendarDay(value) {
  if (value == null || value === 'Never') return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const text = String(value).trim();
  if (!text || text === 'Never') return '';
  const match = ISO_DAY.exec(text);
  return match ? match[1] : '';
}

function todayIsoDate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// A deal is expired when its end date is before `today`. The end date itself
// is still active, matching the product card. Missing or non-date values are
// not treated as expired.
function isExpiredOn(expiresOnDate, today) {
  const end = calendarDay(expiresOnDate);
  const day = calendarDay(today);
  if (!end || !day) return false;
  return end < day;
}

function currentProductsFromPosts(posts) {
  const products = {};
  const postsBySlug = {};
  for (const post of posts || []) {
    if (!post || post.draft === true || !post.slug) continue;
    const productPath = post.path == null ? '' : String(post.path);
    if (productPath && !productPath.startsWith('products/')) continue;
    if (products[post.slug]) continue;
    products[post.slug] = {
      expiresOnDate:
        post.expiresOnDate == null ? '' : String(post.expiresOnDate),
    };
    postsBySlug[post.slug] = post;
  }
  return { products, postsBySlug };
}

/**
 * Rank page-view rows against the current edition.
 * Highest count first. Ties share a rank (1, 2, 2, 4) and keep source order.
 * Archived, expired, and unknown slugs are omitted and do not take a rank.
 * `entries` and `products` are not mutated.
 */
function rankLeaderboard(entries, options = {}) {
  const list = Array.isArray(entries) ? entries : [];
  const products = options.products || {};
  const archived = new Set(options.archivedSlugs || []);
  const today = options.today || todayIsoDate();
  const skipped = [];
  const active = [];

  list.forEach((entry, index) => {
    const slug = entry && entry.slug;
    const count = entry && entry.count;
    const product = slug ? products[slug] : undefined;
    if (product) {
      if (isExpiredOn(product.expiresOnDate, today)) {
        skipped.push({ slug, count, reason: 'expired' });
      } else {
        active.push({ slug, count, index });
      }
      return;
    }
    if (slug && archived.has(slug)) {
      skipped.push({ slug, count, reason: 'archived' });
      return;
    }
    skipped.push({ slug, count, reason: 'unknown' });
  });

  active.sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    return a.index - b.index;
  });

  let rank = 0;
  const ranked = active.map((entry, position) => {
    if (position === 0 || entry.count !== active[position - 1].count) {
      rank = position + 1;
    }
    return { slug: entry.slug, count: entry.count, rank };
  });

  return { ranked, skipped };
}

function rankDeals(posts, entries, options = {}) {
  const { products, postsBySlug } = currentProductsFromPosts(posts);
  const { ranked, skipped } = rankLeaderboard(entries, {
    products,
    archivedSlugs: options.archivedSlugs,
    today: options.today,
  });
  return {
    ranked: ranked.map((entry) => ({
      ...entry,
      post: postsBySlug[entry.slug],
    })),
    skipped,
  };
}

module.exports = {
  calendarDay,
  todayIsoDate,
  isExpiredOn,
  currentProductsFromPosts,
  rankLeaderboard,
  rankDeals,
};
