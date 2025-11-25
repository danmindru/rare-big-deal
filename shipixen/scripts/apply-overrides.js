const { overrides } = require('../data/config/product-overrides');

const categoryTags = {
  'Developer Tools': ['Developer', 'Tools', 'DevTools', 'Programming'],
  'AI Tools': ['AI', 'Machine Learning', 'Automation'],
  'Other AI tools': ['AI', 'Voice', 'Text to Speech'],
  'Design Tools': ['Design', 'Graphics', 'Marketing'],
  'Code Libraries': ['NextJs', 'React', 'SaaS'],
  Productivity: ['Productivity', 'Efficiency', 'Tools'],
  'Marketing Tools': ['Marketing', 'SEO', 'Promotion'],
  'SEO Tools': ['SEO', 'Optimization', 'Marketing'],
  'Startup SaaS/Tools': ['Startup', 'SaaS', 'Business'],
  'Themes, Plugins': ['Themes', 'Plugins', 'Customization'],
  Books: ['Books', 'Learning', 'Programming'],
  'Health and Fitness': ['Health', 'Fitness', 'Wellness'],
  'MacOS Apps': ['macOS', 'Apps', 'Productivity'],
  'iOS Apps': ['iOS', 'Apps', 'Productivity'],
  Marketing: [
    'Marketing',
    'SEO',
    'Promotion',
    'Social Media',
    'Analytics',
    'Automation',
  ],
  'Boilerplates, Starters & Libraries': [
    'Boilerplates',
    'Starters',
    'Libraries',
    'React',
    'NextJs',
  ],
  Learning: ['Learning', 'Courses', 'Tutorials', 'Books'],
  Finance: ['Finance', 'Investing', 'Money', 'Budgeting'],
  'Mailing Lists, Newsletters & Blogs': [
    'Mailing Lists',
    'Newsletters',
    'Blogs',
    'Content',
  ],
  'Productized Services': ['Productized Services', 'Services', 'Business'],
  Miscellaneous: ['Miscellaneous', 'Other', 'Random'],
};

const subcategoryTags = {
  'macOS Apps': ['macOS', 'Apps', 'Desktop Apps', 'Native Apps'],
  'tvOS Apps': ['tvOS', 'Apps', 'TV Apps', 'Native Apps'],
  'macOS:': ['macOS', 'Apps', 'Desktop Apps', 'Native Apps'],
  'APIs, Tools & SaaS': ['APIs', 'Tools', 'SaaS'],
  'Browser Extensions': ['Browser Extensions'],
  'Productivity & AI': ['Productivity', 'AI'],
  'Chat UI': ['Chat UI'],
  Other: ['Other'],
  Lifestyle: ['Lifestyle'],
  'Design Tools': ['Design Tools'],
  'Health & Fitness': ['Health', 'Fitness'],
  'Writing & Notes': ['Writing', 'Notes'],
  'AI Design Tools': ['AI', 'Design Tools'],
  'Video Tools': ['Video Tools'],
  Social: ['Social'],
  'Todo Apps, Notes & Writing': ['Todo Apps', 'Notes', 'Writing'],
  'Email Marketing': ['Email Marketing'],
  'Content Creation': ['Content Creation'],
  'Affiliate Marketing': ['Affiliate Marketing'],
  Analytics: ['Analytics'],
  'Website Builders': ['Website Builders'],
  'Ads & Paid listings': ['Ads', 'Paid listings'],
  Backlinks: ['Backlinks'],
  Tools: ['Tools'],
  'Analyze & Audit': ['Analyze', 'Audit'],
  'React/Next.js': ['React', 'Next.js'],
  Nuxt: ['Nuxt'],
  iOS: ['iOS', 'Apps', 'Mobile Apps', 'Native Apps'],
  Flutter: ['Flutter'],
  Laravel: ['Laravel'],
  Django: ['Django'],
  Rails: ['Rails'],
  Astro: ['Astro'],
  Remix: ['Remix'],
  SvelteKit: ['SvelteKit'],
  HTML: ['HTML'],
  'Chrome Extensions': ['Chrome Extensions'],
  'Libraries & More': ['Libraries'],
  Courses: ['Courses'],
  'Art Courses': ['Art Courses'],
  SEO: ['SEO'],
  Books: ['Books'],
  Apps: ['Apps'],
  Dashboards: ['Dashboards'],
  Databases: ['Databases'],
  'Design Agencies': ['Design Agencies'],
  'Video Production Agencies': ['Video Production Agencies'],
};

function applyCategoryOverrides(categories, subcategories, productName) {
  console.log(`[Apply Overrides] 🏷️  Processing tags for: ${productName}`);

  const overrideTags = overrides[productName]?.tags || [];
  if (overrideTags.length > 0) {
    console.log(`[Apply Overrides] ✅ Using ${overrideTags.length} override tags:`, overrideTags);
    return [...new Set(overrideTags)];
  }

  console.log(`[Apply Overrides] 🔨 Building tags from categories: ${categories?.length || 0}, subcategories: ${subcategories?.length || 0}`);

  const categoryTagsList = (categories || []).reduce((acc, category) => {
    const tags = categoryTags[category] || [];
    if (tags.length > 0) {
      console.log(`[Apply Overrides]   📂 Category "${category}" → ${tags.length} tags`);
    }
    return acc.concat(tags);
  }, []);

  const subcategoryTagsList = (subcategories || []).reduce(
    (acc, subcategory) => {
      const tags = subcategoryTags[subcategory] || [];
      if (tags.length > 0) {
        console.log(`[Apply Overrides]   📁 Subcategory "${subcategory}" → ${tags.length} tags`);
      }
      return acc.concat(tags);
    },
    [],
  );

  const finalTags = [...new Set([...categoryTagsList, ...subcategoryTagsList])];
  console.log(`[Apply Overrides] ✅ Generated ${finalTags.length} unique tags:`, finalTags);

  return finalTags;
}

function applyMetaOverrides(productName, app) {
  console.log(`[Apply Overrides] 📝 Processing metadata for: ${productName}`);

  const productOverrides = overrides[productName] || {};
  const hasOverrides = Object.keys(productOverrides).length > 0;

  if (hasOverrides) {
    const overriddenFields = Object.keys(productOverrides);
    console.log(`[Apply Overrides] ✅ Found ${overriddenFields.length} override fields:`, overriddenFields);
  } else {
    console.log(`[Apply Overrides] 📋 No overrides found, using original metadata`);
  }

  return {
    description: productOverrides.description || app.description,
    metaDescription: productOverrides.metaDescription || app.metaDescription,
    metaTitle: productOverrides.metaTitle || app.metaTitle,
    website: productOverrides.website || app.website,
    deal: productOverrides.deal || app.deal,
    category: productOverrides.category || app.category,
    subcategory: productOverrides.subcategory || app.subcategory,
    tags: productOverrides.tags || app.tags,
    categories: productOverrides.categories || app.categories,
    subcategories: productOverrides.subcategories || app.subcategories,
    expiresOnDate: productOverrides.expiresOnDate || app.expiresOnDate,
  };
}

module.exports = { applyCategoryOverrides, applyMetaOverrides };
