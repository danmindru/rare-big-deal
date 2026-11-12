// Live per-product overrides. The 2025 snapshot is ../../archive/2025/product-overrides.js.
// Page AI's live banner lives here so an update does not replace the public
// file that the 2024 archive page still serves.
//
// An entry here is official media and wins over an auto-fetched og:image.
// Look at the words in a share image before accepting it. When the banner
// text is not English, do not ship that capture. Prefer the owner's official
// English marketing art, stored under public/static/images/overrides/.
module.exports = {
  overrides: {
    facescreen: {
      logo: 'public/static/images/overrides/facescreen/logo.png',
      ogImage: 'public/static/images/overrides/facescreen/og-image.png',
    },
    'page-ai': {
      ogImage: 'public/static/images/overrides/page-ai/og-image.png',
    },
    pimosa: {
      logo: 'public/static/images/overrides/pimosa/logo.png',
      ogImage: 'public/static/images/overrides/pimosa/og-image.png',
    },
    // Official English Saventify marketing image: wordmark, "Mobile-first
    // wedding invitations", Create yours, and the Ava & Rohan invitation.
    saventify: {
      ogImage: 'public/static/images/overrides/saventify/og-image.png',
    },
    // Official 192px Sip icon. The 2024 archive still serves the older 72px file.
    sip: {
      logo: 'public/static/images/overrides/sip/logo.png',
    },
    // noteifyapp.com serves one MacPlus favicon for every app, so each logo is that app's own icon.
    contextclip: {
      logo: 'public/static/images/overrides/contextclip/logo.png',
    },
    'dockview-2': {
      logo: 'public/static/images/overrides/dockview-2/logo.png',
    },
    'stage-view-2': {
      logo: 'public/static/images/overrides/stage-view-2/logo.png',
    },
    'tree-outliner': {
      logo: 'public/static/images/overrides/tree-outliner/logo.png',
    },
    // The published share image is the app icon or the shared MacPlus mark, not a 1200px banner.
    'activedock-2': {
      logo: 'public/static/images/overrides/activedock-2/logo.png',
      ogImage: 'public/static/images/overrides/activedock-2/og-image.png',
    },
    'multidock-2': {
      logo: 'public/static/images/overrides/multidock-2/logo.png',
      ogImage: 'public/static/images/overrides/multidock-2/og-image.png',
    },
    'supertab-7': {
      logo: 'public/static/images/overrides/supertab-7/logo.png',
      ogImage: 'public/static/images/overrides/supertab-7/og-image.png',
    },
    'command-tab-plus-2': {
      logo: 'public/static/images/overrides/command-tab-plus-2/logo.png',
      ogImage: 'public/static/images/overrides/command-tab-plus-2/og-image.png',
    },
    'tab-finder-2': {
      logo: 'public/static/images/overrides/tab-finder-2/logo.png',
      ogImage: 'public/static/images/overrides/tab-finder-2/og-image.png',
    },
    clipboardgrid: {
      logo: 'public/static/images/overrides/clipboardgrid/logo.png',
      ogImage: 'public/static/images/overrides/clipboardgrid/og-image.png',
    },
    'plus-ai': {
      logo: 'public/static/images/overrides/plus-ai/logo.png',
      ogImage: 'public/static/images/overrides/plus-ai/og-image.png',
    },
    // Official SVG marks, rasterized to PNG. Vantagepoint's apple-touch icon is the default React logo.
    vantagepoint: {
      logo: 'public/static/images/overrides/vantagepoint/logo.png',
    },
    fidiora: {
      logo: 'public/static/images/overrides/fidiora/logo.png',
    },
    orwellix: {
      logo: 'public/static/images/overrides/orwellix/logo.png',
    },
    // The site favicon is 32px and the share image is a wireframe. The logo is the official app icon.
    koofr: {
      logo: 'public/static/images/overrides/koofr/logo.png',
      ogImage: 'public/static/images/overrides/koofr/og-image.png',
    },
  },
};
