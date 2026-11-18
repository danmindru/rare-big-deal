/**
 * README deal cells use HTML breaks. react-markdown does not render raw HTML,
 * so `<br>` would show up as text. A markdown hard break keeps the line break.
 */
function prepareDealMarkdown(deal) {
  return String(deal ?? '').replace(/<br\s*\/?\s*>/gi, '  \n');
}

module.exports = { prepareDealMarkdown };
