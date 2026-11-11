# Curating Rare Big Deal

The live catalog is the root `README.md`. Product pages are generated from those tables. Past years live under `shipixen/archive/` and are not current offers.

Issue #130 still explains the basic edit: add a row, do not reformat the file, English products, and the same offer may appear in more than one category. Those steps stay there. This file is the bar used when deciding whether a row belongs on the live list.

## What can be added

List a product only when all of these are true:

- It normally costs money. A free app, a free-only plan, or a trial with nothing to buy does not belong here.
- It has a genuine discount that is live now. The regular price and the offer have to be visible on the product's own site or store. A code, a marked-down price, or an offer already applied at that URL all count when they can be checked.
- The date it ends is in the future, or the offer is clearly still running. Expired deals and offers that cannot be checked are not added.
- The product works. Broken pages, empty shells, and generic templates are not added. A screenshot has to be looked at for every product. The picture is evidence of the product itself, not of how it was built.
- There is a usable logo (or favicon) and a banner. The banner is the share image already published by the site (`og:image` or the store's main image). If that image is missing or unusable, use a screenshot of the actual website instead. Do not invent a banner. Look at the words in that picture before accepting it. If the banner text is not English, do not use the auto-fetched image. When the owner supplies official English marketing art, store it under `shipixen/public/static/images/overrides/` and point `shipixen/data/config/product-overrides.js` at it. That override is what the product page and homepage serve, and a later fetch must not replace it.

A row is one line at the **bottom** of a category table. Do not insert it higher and do not reorder rows that are already there. The same product can be added to more than one category when it really fits each one. On the website, deals in a category are shown alphabetically. That display order is separate from the README order.

The generator saves a favicon as the logo and the site's share image as the banner. When that share image is missing or is not a real picture at a usable size, the trusted generator captures a screenshot of the website itself. It does not draw a replacement. Fork pull requests are checked with the repository's own scripts and without secrets; those checks read the README as data and do not run the pull request's code or open a browser. A person still has to look at the picture before a deal is accepted. The checks do not decide that the product is good, and they do not treat a written discount as proof until someone has looked at the live offer.

## Deal packs

Packs are optional highlights, not a second catalog. They live in `shipixen/data/picks/*.js`:

```js
module.exports = {
  name: 'Best Mac Apps',
  description: 'Mac apps worth a look this season.',
  apps: ['Exact Name From The README'],
};
```

`shipixen/data/picks/index.js` is generated from those filenames. The site matches each name to a product page, and a pack with no matching live products shows nothing.

After the current submission backlog has been decided:

- Review new pull requests every 12 hours.
- Every 24 hours, decide whether one category deserves a pack of its strongest current deals.

Publish a pack only when the deals are real and the set belongs together. Skip the day when it does not. There is no quota. Do not invent popularity, do not arrange a special discount with a vendor, and do not relax the paid, current, quality, or image rules to fill a pack. A pack must not move rows in the README. The names in `apps` have to match the README titles exactly.

Best Apps is the editorial highlight on the homepage and can list Page AI and Saventify. A homepage carousel further down the page must not show a product that a carousel above it already showed. If removing those repeats would leave the pack empty, or would leave the same set of products, do not render that carousel. Do not add filler products to keep a second carousel.

The 2025 packs are kept in `shipixen/archive/2025/picks/`. The live pack files are the same slots with empty `apps` lists, ready for a later selection.

## Notes on pull requests

Keep notes short, friendly, and in plain language.

When a deal is accepted and merged, thank them and ask, politely, for a star on the repo if the list was useful. For example: "Added this at the bottom of the category. If Rare Big Deal is useful to you, a star on the repo is appreciated."

When a deal is not a fit, say why in one or two sentences and do not argue. For example: "Thanks for sending this. This list is for products people normally pay for, with a discount that is live right now, so I can't add this one."

Do not negotiate a custom offer. Do not promise a feature, a rank, or a place at the top.
