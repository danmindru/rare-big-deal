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
    // The banner is a reviewed 1200x630 screenshot of the product homepage.
    voksha: {
      logo: 'public/static/images/overrides/voksha/logo.png',
      ogImage: 'public/static/images/overrides/voksha/og-image.png',
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
    // training.thexero.co.uk favicon is 32px and the share image is a 3354x2771 photo.
    // The logo is the header mark; the banner is a 1200x630 crop of the Black Friday page.
    'wireless-operator': {
      logo: 'public/static/images/overrides/wireless-operator/logo.png',
      ogImage: 'public/static/images/overrides/wireless-operator/og-image.png',
    },
    // cloisterink.com has no icon. This is the official 512px App Store icon.
    'cloister-ink': {
      logo: 'public/static/images/overrides/cloister-ink/logo.png',
    },
    // fileminutes.com links a 32px favicon. This is the official 192px app icon from the site.
    fileminutes: {
      logo: 'public/static/images/overrides/fileminutes/logo.png',
    },
    // devapt.com serves a small favicon. This is the official 128px Chrome Web Store icon.
    'bookmark-manager-quick-search': {
      logo: 'public/static/images/overrides/bookmark-manager-quick-search/logo.png',
    },
    // indiegoodies.com/typefu uses the square app icon as og:image. This is a screenshot of the product page.
    typefu: {
      ogImage: 'public/static/images/overrides/typefu/og-image.png',
    },
    // getneotiler.com answered with a Cloudflare "Performing security verification"
    // page. The banner is a reviewed 1200x630 screenshot of the product homepage.
    neotiler: {
      ogImage: 'public/static/images/overrides/neotiler/og-image.png',
    },
    // superdevpro.com answered with a Cloudflare "Performing security verification"
    // page. The banner is a reviewed 1200x630 screenshot of the product homepage.
    'superdev-pro': {
      ogImage: 'public/static/images/overrides/superdev-pro/og-image.png',
    },
    // labex.io answered with a Cloudflare "Performing security verification"
    // page. The banner is a reviewed 1200x630 screenshot of the product homepage.
    'labex-pro': {
      ogImage: 'public/static/images/overrides/labex-pro/og-image.png',
    },
    // lidnight.app publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    lidnight: {
      ogImage: 'public/static/images/overrides/lidnight/og-image.png',
    },
    // apps.apple.com serves the generic Apple favicon. This is the WhaleDeck app icon.
    whaledeck: {
      logo: 'public/static/images/overrides/whaledeck/logo.png',
    },
    // tableplus.com's apple touch icon is the official 152px elephant. This pins that icon.
    tableplus: {
      logo: 'public/static/images/overrides/tableplus/logo.png',
    },
    // stratosapp.dev publishes an SVG share image and no favicon. The logo is that mark rasterized, and the banner is a reviewed 1200x630 screenshot of the product page.
    stratos: {
      logo: 'public/static/images/overrides/stratos/logo.png',
      ogImage: 'public/static/images/overrides/stratos/og-image.png',
    },
    // wordify.com's favicon.png is 50px. This is the site SVG mark, rasterized.
    wordify: {
      logo: 'public/static/images/overrides/wordify/logo.png',
    },
    // antshot.com publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    antshot: {
      ogImage: 'public/static/images/overrides/antshot/og-image.png',
    },
    // okaytab.app/og/okaytab.png was not a usable banner. This is a reviewed 1200x630 screenshot of the product page.
    okaytab: {
      ogImage: 'public/static/images/overrides/okaytab/og-image.png',
    },
    // robofy.ai's published share image is a 535x516 graphic. The banner is a reviewed 1200x630 screenshot of the product page.
    // The site's current favicon is 32px. This is the earlier official 180px app icon.
    robofy: {
      logo: 'public/static/images/overrides/robofy/logo.png',
      ogImage: 'public/static/images/overrides/robofy/og-image.png',
    },
    // compresto.app/pricing publishes no og:image. The banner is a reviewed 1200x630 screenshot of the pricing page.
    compresto: {
      ogImage: 'public/static/images/overrides/compresto/og-image.png',
    },
    // files2notion.com links a 32px favicon. This is the official 1024px logo.png from the site.
    'files-to-notion': {
      logo: 'public/static/images/overrides/files-to-notion/logo.png',
    },
    // keyboardstack.com publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    keyboardstack: {
      ogImage: 'public/static/images/overrides/keyboardstack/og-image.png',
    },
    // wins.cool's card.png was not a usable banner. This is a reviewed 1200x630 screenshot of the product page.
    wins: {
      ogImage: 'public/static/images/overrides/wins/og-image.png',
    },
    // duckboard.pro links a 48px favicon. This is the site SVG mark, rasterized.
    duckboard: {
      logo: 'public/static/images/overrides/duckboard/logo.png',
    },
    // infinidesk.app publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    infinidesk: {
      ogImage: 'public/static/images/overrides/infinidesk/og-image.png',
    },
    // ubidrop.com links a 48px favicon. This is the site SVG mark, rasterized.
    ubidrop: {
      logo: 'public/static/images/overrides/ubidrop/logo.png',
    },
    // assignee.app links a 32px favicon. This is the reviewed 128px product icon.
    assignee: {
      logo: 'public/static/images/overrides/assignee/logo.png',
    },
    // remotr.app publishes the square app icon as og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    remotr: {
      ogImage: 'public/static/images/overrides/remotr/og-image.png',
    },
    // dailytimetracking.com's open-graph.jpg was not a usable banner. This is a reviewed 1200x630 screenshot of the product page.
    'daily-time-tracking': {
      ogImage: 'public/static/images/overrides/daily-time-tracking/og-image.png',
    },
    // simpleum.com's og-image-en.jpg was not a usable banner. This is a reviewed 1200x630 screenshot of the product page.
    simpleumsafe: {
      ogImage: 'public/static/images/overrides/simpleumsafe/og-image.png',
    },
    // getjuicy.app links a 48px favicon. This is the reviewed 512px product icon.
    'juicy-battery': {
      logo: 'public/static/images/overrides/juicy-battery/logo.png',
    },
    // darksleep.app links a 48px favicon and publishes no og:image. The logo is the reviewed sunrise mark, and the banner is a reviewed 1200x630 screenshot of the product page.
    'dark-sleep': {
      logo: 'public/static/images/overrides/dark-sleep/logo.png',
      ogImage: 'public/static/images/overrides/dark-sleep/og-image.png',
    },
    // y-pod.app publishes the square app icon as og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    'y-pod': {
      ogImage: 'public/static/images/overrides/y-pod/og-image.png',
    },
    // ujiapps.com publishes the square FastingLady icon as og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    fastinglady: {
      ogImage: 'public/static/images/overrides/fastinglady/og-image.png',
    },
    // par.sawirstudio.com publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    par: {
      ogImage: 'public/static/images/overrides/par/og-image.png',
    },
    // blogtopin.com links a 48px favicon. This is the official 800px product icon.
    blogtopin: {
      logo: 'public/static/images/overrides/blogtopin/logo.png',
    },
    // pageduel.com publishes no og:image. The banner is a reviewed 1200x630 screenshot of the product page.
    pageduel: {
      ogImage: 'public/static/images/overrides/pageduel/og-image.png',
    },
    // own.page serves a 48px icon and publishes no og:image. The logo is the SVG mark rasterized, and the banner is a reviewed 1200x630 screenshot of the product page.
    'own-page': {
      logo: 'public/static/images/overrides/own-page/logo.png',
      ogImage: 'public/static/images/overrides/own-page/og-image.png',
    },
    // Gumroad's favicon for FlexiBackup is the maker's photo. This is the official 512px app icon from flexibackup.swiftsenpai.com.
    flexibackup: {
      logo: 'public/static/images/overrides/flexibackup/logo.png',
    },
    // The site's current favicon is 48px. This is the earlier official 256px app icon.
    almighty: {
      logo: 'public/static/images/overrides/almighty/logo.png',
    },
    // The site's current favicon is 64px. This is the earlier official 180px app icon.
    copypasta: {
      logo: 'public/static/images/overrides/copypasta/logo.png',
    },
    // The site's current favicon is 48px. This is the earlier official 180px app icon.
    cutfac: {
      logo: 'public/static/images/overrides/cutfac/logo.png',
    },
    // The site's current favicon is 48px. This is the earlier official 180px app icon.
    'let-s-trip': {
      logo: 'public/static/images/overrides/let-s-trip/logo.png',
    },
    // The site's current favicon is 64px. This is the earlier official 180px app icon.
    looq: {
      logo: 'public/static/images/overrides/looq/logo.png',
    },
    // The site's current favicon is 48px. This is the earlier official 256px app icon.
    pastepal: {
      logo: 'public/static/images/overrides/pastepal/logo.png',
    },
    // The site's current favicon is 48px. This is the earlier official 180px app icon.
    starlie: {
      logo: 'public/static/images/overrides/starlie/logo.png',
    },
    // atatapp.com's auto banner is a page screenshot partly covered by a cookie banner. This is the official 1200x630 og.png.
    atat: {
      ogImage: 'public/static/images/overrides/atat/og-image.png',
    },
    // radiantly.space/pricing publishes no og:image. This is the official 1200x630 homepage card.
    radiantly: {
      ogImage: 'public/static/images/overrides/radiantly/og-image.png',
    },
    // loshadki.app publishes the square app icon as og:image and one 180px horse icon for every app.
    // The logo is the 1024px ShellHistory icon. The banner is a reviewed 1200x630 screenshot of the product page.
    shellhistory: {
      logo: 'public/static/images/overrides/shellhistory/logo.png',
      ogImage: 'public/static/images/overrides/shellhistory/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 1024px RegExp icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    regexp: {
      logo: 'public/static/images/overrides/regexp/logo.png',
      ogImage: 'public/static/images/overrides/regexp/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 1024px RenameNinja icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    renameninja: {
      logo: 'public/static/images/overrides/renameninja/logo.png',
      ogImage: 'public/static/images/overrides/renameninja/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 512px SmartInbox icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    smartinbox: {
      logo: 'public/static/images/overrides/smartinbox/logo.png',
      ogImage: 'public/static/images/overrides/smartinbox/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 1024px CheckCraft icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    checkcraft: {
      logo: 'public/static/images/overrides/checkcraft/logo.png',
      ogImage: 'public/static/images/overrides/checkcraft/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 1024px OpenIn icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    openin: {
      logo: 'public/static/images/overrides/openin/logo.png',
      ogImage: 'public/static/images/overrides/openin/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 512px Paddock icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    paddock: {
      logo: 'public/static/images/overrides/paddock/logo.png',
      ogImage: 'public/static/images/overrides/paddock/og-image.png',
    },
    // The published share image is the square app icon. The logo is the 512px ProfileLauncher icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    profilelauncher: {
      logo: 'public/static/images/overrides/profilelauncher/logo.png',
      ogImage: 'public/static/images/overrides/profilelauncher/og-image.png',
    },
    // The App Store og:image is a Placeholder icon card, and the page icon is that same mark at 400px.
    // The logo is the App Store icon. The banner is a reviewed 1200x630 screenshot of the Mac App Store page.
    qrat: {
      logo: 'public/static/images/overrides/qrat/logo.png',
      ogImage: 'public/static/images/overrides/qrat/og-image.png',
    },
    // The course og:image is an 800x328 2024 diagram, and the course page video embed fails in headless Chrome.
    // The banner is a reviewed 1200x630 screenshot of the Modern Security homepage.
    'modern-security-ai-security-certification': {
      ogImage: 'public/static/images/overrides/modern-security-ai-security-certification/og-image.png',
    },
  },
};
