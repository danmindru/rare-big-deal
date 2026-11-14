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
    // The live banner is the reviewed product-site screenshot. The product path
    // is pinned by the archive, so a fetch would replace it with the icon card.
    sip: {
      logo: 'public/static/images/overrides/sip/logo.png',
      ogImage: 'public/static/images/overrides/sip/og-image.png',
    },
    // rewritebar.com/black-friday publishes no og:image. The banner is a screenshot of that page.
    rewritebar: {
      ogImage: 'public/static/images/overrides/rewritebar/og-image.png',
    },
    // noteifyapp.com serves one MacPlus favicon for every app, so each logo is that app's own icon.
    // Quick Exposé 3's published share image is the app icon. The banner is a screenshot of the product hero.
    'quick-expos-3': {
      logo: 'public/static/images/overrides/quick-expos-3/logo.png',
      ogImage: 'public/static/images/overrides/quick-expos-3/og-image.png',
    },
    'classic-commander': {
      logo: 'public/static/images/overrides/classic-commander/logo.png',
    },
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
    // extensions.loopspec.com answers every fetch with a Cloudflare challenge,
    // so the Chrome Web Store icon and the English store screenshot are the art.
    gramcheck: {
      logo: 'public/static/images/overrides/gramcheck/logo.png',
      ogImage: 'public/static/images/overrides/gramcheck/og-image.png',
    },
    roomtape: {
      logo: 'public/static/images/overrides/roomtape/logo.png',
      ogImage: 'public/static/images/overrides/roomtape/og-image.png',
    },
    // The deal page is a Cloudflare challenge, and the apple-touch icon fetch
    // failed, which left a 48px favicon. Keep the reviewed 180px icon.
    voksha: {
      logo: 'public/static/images/overrides/voksha/logo.png',
    },
    // rapstarstudio.com publishes no og:image, and its only icon is an SVG.
    // The banner is a screenshot of the product homepage. The logo is that SVG, rasterized.
    'rapstar-studio': {
      logo: 'public/static/images/overrides/rapstar-studio/logo.png',
      ogImage: 'public/static/images/overrides/rapstar-studio/og-image.png',
    },
    // zerorank.ai publishes no og:image. The banner is a screenshot of the product homepage.
    zerorank: {
      ogImage: 'public/static/images/overrides/zerorank/og-image.png',
    },
    // The pricing page has no og:image. This is the official 1200x630 homepage card.
    outlier: {
      ogImage: 'public/static/images/overrides/outlier/og-image.png',
    },
    // The pricing page has no og:image. This is the official 1200x630 homepage card.
    crisp: {
      ogImage: 'public/static/images/overrides/crisp/og-image.png',
    },
    // The linked favicon is 48px. This is the official 500px logo.png from the site.
    getyoutubetranscript: {
      logo: 'public/static/images/overrides/getyoutubetranscript/logo.png',
    },
    // The linked favicon is a 32px ico. This is the official 400px icon.webp.
    aikeedo: {
      logo: 'public/static/images/overrides/aikeedo/logo.png',
    },
    // devapt.com serves a small favicon. This is the official SinceWhen app icon.
    'sincewhen-days-since-tracker': {
      logo: 'public/static/images/overrides/sincewhen-days-since-tracker/logo.png',
    },
    // devapt.com serves a small favicon. This is the official 128px product icon.
    'copy-text-easily': {
      logo: 'public/static/images/overrides/copy-text-easily/logo.png',
    },
    // These three sites answer with a Cloudflare challenge from CI. The banners
    // are the official og:image files: MGC_cover.png and mingcute_animation.png
    // from mingcute-docs, and ui.mingcute.com/images/social-preview.png.
    // MingCute UI's apple-touch icon is the logo. Icons and Animation publish
    // their own favicons, which the parser can still download.
    'mingcute-icons': {
      ogImage: 'public/static/images/overrides/mingcute-icons/og-image.png',
    },
    'mingcute-ui': {
      logo: 'public/static/images/overrides/mingcute-ui/logo.png',
      ogImage: 'public/static/images/overrides/mingcute-ui/og-image.png',
    },
    'animation-icons': {
      ogImage: 'public/static/images/overrides/animation-icons/og-image.png',
    },
  },
};
