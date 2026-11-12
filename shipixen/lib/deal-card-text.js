/**
 * Homepage cards keep markdown emphasis and drop link URLs.
 * A deal written as ([label](https://example.com)) stays "(label)", not "()".
 */
function dealCardText(deal) {
  return String(deal ?? '').replace(
    /(?<!!)\[([^[\]]*)\]\((?:[^()]|\([^()]*\))*\)/g,
    (_, text) => text,
  );
}

module.exports = { dealCardText };
