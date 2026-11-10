const { readmePath } = require('./settings');
const {
  assertStartOnOrBeforeEnd,
  validFromDateInDeal,
} = require('./lib/eligibility');
const fs = require('fs');

const skipProductNames = [];

async function parseReadme(markdown) {
  console.log('\n[Parse README] 📖 Starting README parsing...');
  console.log(
    `[Parse README] 📁 Reading from: ${markdown == null ? readmePath : 'provided markdown'}`,
  );
  const startTime = Date.now();

  const readmeContent =
    markdown == null ? fs.readFileSync(readmePath, 'utf-8') : String(markdown);
  const lines = readmeContent.split('\n');

  console.log(`[Parse README] 📋 Total lines in README: ${lines.length}`);

  let currentCategory = '';
  let currentSubcategory = '';
  const appMap = {};
  const apps = [];
  let skippedCount = 0;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      console.log(`[Parse README] 📂 Found category: ${currentCategory}`);
    } else if (line.startsWith('### ')) {
      currentSubcategory = line.replace('### ', '').trim();
      console.log(`[Parse README] 📁 Found subcategory: ${currentSubcategory}`);
    } else if (line.startsWith('|')) {
      const parts = line.split('|').map((part) => part.trim());
      if (parts.length >= 5 && parts[2].startsWith('[')) {
        const name = parts[2].match(/\[(.*?)\]/)[1];
        const website = parts[2].match(/\((.*?)\)/)[1];
        const description = parts[3];
        const deal = parts[4];
        const expiresOnDate = parts[5] || '';
        const validFromDate = validFromDateInDeal(deal);
        try {
          assertStartOnOrBeforeEnd(validFromDate, expiresOnDate);
        } catch (error) {
          throw new Error(`${name}: ${error.message}`);
        }

        if (skipProductNames.includes(name)) {
          skippedCount++;
          console.log(`[Parse README] ⏭️  Skipping product: ${name}`);
          continue;
        }

        if (!appMap[name]) {
          appMap[name] = {
            name,
            website,
            description,
            deal,
            expiresOnDate,
            validFromDate,
            categories: [],
            subcategories: [],
          };
          apps.push(appMap[name]);
          console.log(`[Parse README] ✅ Added product: ${name}`);
        }

        if (
          currentCategory &&
          !appMap[name].categories.includes(currentCategory)
        ) {
          appMap[name].categories.push(currentCategory);
        }

        if (
          currentSubcategory &&
          !appMap[name].subcategories.includes(currentSubcategory)
        ) {
          appMap[name].subcategories.push(currentSubcategory);
        }
      }
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`\n[Parse README] ========================================`);
  console.log(`[Parse README] 📊 Summary:`);
  console.log(`[Parse README]   ✅ Successfully parsed: ${apps.length} products`);
  console.log(`[Parse README]   ⏭️  Skipped: ${skippedCount} products`);
  console.log(`[Parse README]   ⏱️  Total time: ${elapsed}ms`);
  console.log(`[Parse README] ========================================\n`);

  return apps;
}

module.exports = { parseReadme };
