const productDates = require('../data/config/product-dates');

function getProductDates(productName) {
  const dates = productDates[productName] || null;
  if (dates) {
    console.log(`[Product Dates] 📅 Found dates for ${productName}:`, dates);
  }
  return dates;
}

module.exports = { getProductDates };
