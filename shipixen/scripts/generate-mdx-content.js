const {
  applyCategoryOverrides,
  applyMetaOverrides,
} = require('./apply-overrides');
const { sanitizeName } = require('./sanitize-name');
const { markdownDir } = require('./settings');
const {
  assertStartOnOrBeforeEnd,
  validFromDateInDeal,
} = require('./lib/eligibility');
const fs = require('fs');
const path = require('path');
const { getLeaderboardPosition } = require('./leaderboard-utils');

function plainText(value) {
  if (Array.isArray(value)) return value.map(plainText).filter(Boolean).join(', ');
  if (value && typeof value === 'object') {
    return plainText(value.name || value['@value'] || '');
  }
  return String(value || '').trim();
}

function buildMDXContent(app) {
  const tags = applyCategoryOverrides(
    app.categories,
    app.subcategories,
    sanitizeName(app.name),
  );
  const {
    description,
    metaDescription,
    metaTitle,
    website,
    deal,
    expiresOnDate,
    validFromDate,
  } = applyMetaOverrides(sanitizeName(app.name), app);
  const startDate = (validFromDate || validFromDateInDeal(deal) || '').trim();
  const endDate = (expiresOnDate || '').trim();
  try {
    assertStartOnOrBeforeEnd(startDate, endDate);
  } catch (error) {
    throw new Error(`${app.name}: ${error.message}`);
  }

  // Extract JSON-LD data with fallbacks
  const jsonLd = app.jsonLd || {};
  const hasJsonLd = jsonLd && Object.keys(jsonLd).length > 0;

  // Use JSON-LD description if available, append meta description
  let finalDescription = description?.trim() || '';
  if (hasJsonLd && jsonLd.description) {
    finalDescription = jsonLd.description.trim();
    // improve formatting of bullets for markdown
    finalDescription = finalDescription.replace(/•/g, '-');
  }

  let mdxContent = `---
title: >
  ${app.name?.trim()}
date: ${new Date().toISOString().split('T')[0]}
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
`;

  if (app.images && app.images.length > 0) {
    mdxContent += `images:\n`;
    app.images.forEach((image) => {
      mdxContent += `  - ${image}\n`;
    });
  }

  if (app.logo) {
    mdxContent += `logo: ${app.logo}
`;
  }

  mdxContent += `summary: >
  ${description?.trim()}
categories:
${(app.categories || []).map((category) => `  - ${category}`).join('\n')}
subcategories:
${(app.subcategories || [])
  .map((subcategory) => `  - ${subcategory}`)
  .join('\n')}
deal: >
  ${deal?.trim()}
website: ${website}
${startDate ? `validFromDate: ${startDate}\n` : ''}${endDate ? `expiresOnDate: ${endDate}` : ''}
layout: ProductLayout
`;

  // Add JSON-LD fields if available
  if (hasJsonLd) {
    if (jsonLd.applicationCategory) {
      mdxContent += `appCategory: ${jsonLd.applicationCategory}\n`;
    }
    if (jsonLd.price !== null && jsonLd.price !== undefined) {
      mdxContent += `appPrice: ${jsonLd.price}\n`;
    }
    if (jsonLd.priceCurrency) {
      mdxContent += `appPriceCurrency: ${jsonLd.priceCurrency}\n`;
    }
    if (jsonLd.ratingValue !== null && jsonLd.ratingValue !== undefined) {
      mdxContent += `appRating: ${jsonLd.ratingValue}\n`;
    }
    if (jsonLd.reviewCount !== null && jsonLd.reviewCount !== undefined) {
      mdxContent += `appReviewCount: ${jsonLd.reviewCount}\n`;
    }
    if (jsonLd.operatingSystem) {
      const operatingSystem = plainText(jsonLd.operatingSystem);
      if (operatingSystem) {
        mdxContent += `appOperatingSystem: >
  ${operatingSystem}\n`;
      }
    }
    if (jsonLd.availableOnDevice) {
      mdxContent += `appAvailableOnDevice: ${jsonLd.availableOnDevice}\n`;
    }
    if (jsonLd.authorName) {
      mdxContent += `appAuthorName: ${jsonLd.authorName}\n`;
    }
    if (jsonLd.authorUrl) {
      mdxContent += `appAuthorUrl: ${jsonLd.authorUrl}\n`;
    }
  }

  const leaderboardPosition = getLeaderboardPosition(sanitizeName(app.name));
  if (leaderboardPosition !== null) {
    mdxContent += `leaderboardPosition: ${leaderboardPosition}
`;
  }

  if (metaDescription) {
    // Properly indent each line of metaDescription
    const formattedMetaDescription = metaDescription
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `  ${line}`)
      .join('\n');

    mdxContent += `metaDescription: >
${formattedMetaDescription}
`;
  }

  if (metaTitle) {
    // Properly indent metaTitle
    const formattedMetaTitle = metaTitle
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `  ${line}`)
      .join('\n');

    mdxContent += `metaTitle: >
${formattedMetaTitle}
`;
  }

  mdxContent += `---

## Discount / Deal

<div className="deal-paragraph not-prose">
${deal}
</div>
${app.expiresOnDate ? `\n<ExpirationDate date="${app.expiresOnDate}" />\n` : ''}

## Product Overview

${finalDescription || description}
`;

  // Only add Product Details section if metaTitle exists or if metaDescription is different from JSON-LD description
  const shouldShowProductDetails =
    metaTitle ||
    (metaDescription &&
      (!hasJsonLd ||
        !jsonLd.description ||
        metaDescription.trim() !== jsonLd.description.trim()));

  if (shouldShowProductDetails) {
    // Format the content section differently from frontmatter
    const formattedContentMetaTitle = (metaTitle || '').trim();
    const formattedContentMetaDescription = (metaDescription || '').trim();

    mdxContent += `
## Product Details

${formattedContentMetaTitle}

${formattedContentMetaDescription}
`;
  }

  return mdxContent;
}

async function generateMDXContent(app, directory = markdownDir) {
  console.log(`[Generate MDX Content] 📝 Generating MDX for: ${app.name}`);
  const startTime = Date.now();
  const mdxContent = buildMDXContent(app);

  const markdownOutputPath = path.join(
    directory,
    `${sanitizeName(app.name)}.mdx`,
  );
  fs.writeFileSync(markdownOutputPath, mdxContent);

  const elapsed = Date.now() - startTime;
  console.log(
    `[Generate MDX Content] ✅ MDX file created: ${sanitizeName(app.name)}.mdx (${elapsed}ms)`,
  );
}

module.exports = { buildMDXContent, generateMDXContent };
