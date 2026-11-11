const bestApps = require('./picks/best-apps');
const aiApps = require('./picks/ai-apps');
const developerTools = require('./picks/developer-tools');
const iosApps = require('./picks/ios-apps');
const macApps = require('./picks/mac-apps');
const boilerplates = require('./picks/boilerplates');
const marketingApps = require('./picks/marketing-apps');
const nicheApps = require('./picks/niche-apps');
const theJohnApps = require('./picks/the-john-apps');

// Same order HomeList uses for category sections. Priority categories are
// always present; every other live category follows, sorted.
const PRIORITY_CATEGORIES = [
  'AI Tools',
  'Developer Tools',
  'iOS Apps',
  'MacOS Apps',
  'Boilerplates, Starters & Libraries',
  'Marketing',
];

// Pack rendered immediately above that category section on the homepage.
const PACK_BEFORE_CATEGORY = {
  'AI Tools': aiApps,
  'Developer Tools': developerTools,
  'iOS Apps': iosApps,
  'MacOS Apps': macApps,
  'Boilerplates, Starters & Libraries': boilerplates,
  Marketing: marketingApps,
  Learning: nicheApps,
  'John Rush Extravaganza': theJohnApps,
};

function packKey(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function homepageCategoryOrder(categoryNames) {
  const present = Array.isArray(categoryNames) ? categoryNames : [];
  const others = present.filter((category) => !PRIORITY_CATEGORIES.includes(category)).sort();
  return [...PRIORITY_CATEGORIES, ...others];
}

/**
 * Drop products already shown in an earlier homepage carousel.
 * An empty pack, or one whose remaining products are the same set as a
 * carousel already shown (including Best Apps), is not returned.
 * Inputs are not mutated.
 */
function dedupeHomepagePacks(packs) {
  const shown = new Set();
  const signatures = new Set();
  const visible = [];
  for (const pack of packs || []) {
    const apps = [];
    const local = new Set();
    for (const name of pack.apps || []) {
      const key = packKey(name);
      if (!key || shown.has(key) || local.has(key)) continue;
      local.add(key);
      apps.push(name);
    }
    if (apps.length === 0) continue;
    const signature = [...local].sort().join('\0');
    if (signatures.has(signature)) continue;
    for (const key of local) shown.add(key);
    signatures.add(signature);
    visible.push({ ...pack, apps });
  }
  return visible;
}

/**
 * Homepage carousels in the order they render. Best Apps is the editorial
 * highlight and stays first. Later packs keep only products not already shown.
 */
function visibleHomepageShowcases(categoryNames) {
  const ordered = [
    {
      name: bestApps.name,
      description: bestApps.description,
      apps: bestApps.apps.slice(),
      placement: 'top',
    },
  ];
  for (const category of homepageCategoryOrder(categoryNames)) {
    const pack = PACK_BEFORE_CATEGORY[category];
    if (!pack) continue;
    ordered.push({
      name: pack.name,
      description: pack.description,
      apps: pack.apps.slice(),
      beforeCategory: category,
    });
  }
  return dedupeHomepagePacks(ordered);
}

module.exports = {
  PRIORITY_CATEGORIES,
  PACK_BEFORE_CATEGORY,
  packKey,
  homepageCategoryOrder,
  dedupeHomepagePacks,
  visibleHomepageShowcases,
};
