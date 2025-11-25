const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(
  __dirname,
  '../data/config/export-hog-popular.csv',
);

function parseCSV() {
  console.log('[Leaderboard Utils] 📊 Loading leaderboard data...');
  console.log(`[Leaderboard Utils] 📁 Reading from: ${csvFilePath}`);

  const data = fs.readFileSync(csvFilePath, 'utf8');
  const lines = data.split('\n');
  const products = {};
  let parsedCount = 0;

  lines.forEach((line, index) => {
    if (index === 0 || !line.trim()) return; // Skip header and empty lines
    const [, pathname] = line.split(','); // Skip first column, take the pathname
    if (!pathname) return; // Skip if no pathname
    const pathParts = pathname.split('/');
    if (pathParts.length < 3) return; // Skip lines without expected format
    const productName = pathParts[2];
    products[productName] = index;
    parsedCount++;
  });

  console.log(
    `[Leaderboard Utils] ✅ Loaded ${parsedCount} products from leaderboard`,
  );
  return products;
}

const products = parseCSV();

function getLeaderboardPosition(productName) {
  const position = products[productName] || -1;
  if (position > 0) {
    console.log(
      `[Leaderboard Utils] 🏆 Found leaderboard position for ${productName}: #${position}`,
    );
  }
  return position;
}

module.exports = { getLeaderboardPosition };
