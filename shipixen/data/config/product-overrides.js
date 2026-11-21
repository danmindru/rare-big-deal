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
    heystream: {
      logo: 'public/static/images/overrides/heystream/logo.png',
      ogImage: 'public/static/images/overrides/heystream/og-image.png',
    },
    facescreen: {
      logo: 'public/static/images/overrides/facescreen/logo.png',
      ogImage: 'public/static/images/overrides/facescreen/og-image.png',
    },
    // pageai.pro's apple-touch icon is 180px. This is the official 512px icon
    // from /static/favicons/android-chrome-512x512.png in the site manifest.
    'page-ai': {
      logo: 'public/static/images/overrides/page-ai/logo.png',
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
    // elevenapril.com publishes the square app icon as og:image.
    // The logo is the official 512px DuePal icon. The banner is a reviewed 1200x630 screenshot of the product page.
    duepal: {
      logo: 'public/static/images/overrides/duepal/logo.png',
      ogImage: 'public/static/images/overrides/duepal/og-image.png',
    },
    // The logo is the official 512px Focus Train icon. The banner is a reviewed 1200x630 screenshot of the product page.
    'focus-train': {
      logo: 'public/static/images/overrides/focus-train/logo.png',
      ogImage: 'public/static/images/overrides/focus-train/og-image.png',
    },
    // The logo is the official 512px Fern icon. The banner is a reviewed 1200x630 screenshot of the product page.
    fern: {
      logo: 'public/static/images/overrides/fern/logo.png',
      ogImage: 'public/static/images/overrides/fern/og-image.png',
    },
    // The logo is the official 512px YumPal icon. The banner is a reviewed 1200x630 screenshot of the product page.
    yumpal: {
      logo: 'public/static/images/overrides/yumpal/logo.png',
      ogImage: 'public/static/images/overrides/yumpal/og-image.png',
    },
    // The logo is the official 512px Succulent icon. The banner is a reviewed 1200x630 screenshot of the product page.
    succulent: {
      logo: 'public/static/images/overrides/succulent/logo.png',
      ogImage: 'public/static/images/overrides/succulent/og-image.png',
    },
    // The logo is the official 512px MusicPal icon. The banner is a reviewed 1200x630 screenshot of the product page.
    musicpal: {
      logo: 'public/static/images/overrides/musicpal/logo.png',
      ogImage: 'public/static/images/overrides/musicpal/og-image.png',
    },
    // The sale page share image is not a banner of the 25 apps. The logo is the official 640px site mark.
    // The banner is a reviewed 1200x630 screenshot of elevenapril.com/black-friday.
    // The slug keeps the trailing hyphen from sanitizeName("ElevenApril (25 iPhone Apps)").
    'elevenapril-25-iphone-apps-': {
      logo: 'public/static/images/overrides/elevenapril-25-iphone-apps-/logo.png',
      ogImage: 'public/static/images/overrides/elevenapril-25-iphone-apps-/og-image.png',
    },
    // urtti.com/weather publishes the square app icon as og:image. The logo is the 512px Mac App Store icon.
    // The banner is a reviewed 1200x630 screenshot of the product page.
    'big-weather': {
      logo: 'public/static/images/overrides/big-weather/logo.png',
      ogImage: 'public/static/images/overrides/big-weather/og-image.png',
    },
    // sitely.app's largest official icon is the 180px apple-touch icon.
    // The banner is a reviewed 1200x630 screenshot of the product homepage.
    'sitely-8': {
      logo: 'public/static/images/overrides/sitely-8/logo.png',
      ogImage: 'public/static/images/overrides/sitely-8/og-image.png',
    },
    // leavemealone.com's largest official icon is the 192px android-icon.
    'leave-me-alone': {
      logo: 'public/static/images/overrides/leave-me-alone/logo.png',
    },
    // actionclip.app publishes only an SVG app icon. This is that icon, rasterized at 512px.
    actionclip: {
      logo: 'public/static/images/overrides/actionclip/logo.png',
    },
    // The auto banner is the generic SwipeToLaunch directory card, not the kit.
    // The banner is a reviewed screenshot of the kit hero on swipetolaunch.com/kit.
    'launch-agent-kit': {
      ogImage: 'public/static/images/overrides/launch-agent-kit/og-image.png',
    },
    // screenotter.com publishes no og:image and only a 32px favicon.
    // The logo is the otter S mark from the left of the official wordmark, on white at 256px.
    // The banner is a 1200x630 screenshot of the English homepage hero.
    screenotter: {
      logo: 'public/static/images/overrides/screenotter/logo.png',
      ogImage: 'public/static/images/overrides/screenotter/og-image.png',
    },
    // gleam.io/black-friday is not published until 2026-11-20, so the generator cannot fetch it.
    // The logo is the official 180px apple-touch icon.
    // The banner is the official 1200x630 homepage og:image.
    'gleam-io': {
      logo: 'public/static/images/overrides/gleam-io/logo.png',
      ogImage: 'public/static/images/overrides/gleam-io/og-image.png',
    },
    // ezystudio.com's only icon is an SVG. This is that mark, rasterized at 512px.
    // The homepage og:image is left for the generator.
    ezystudio: {
      logo: 'public/static/images/overrides/ezystudio/logo.png',
    },
    // The App Store page publishes the square app icon as og:image.
    // The logo is the official 180px apple-touch icon from mhmtoo.app.
    // The banner is the official 1200x630 English homepage og:image.
    mhm: {
      logo: 'public/static/images/overrides/mhm/logo.png',
      ogImage: 'public/static/images/overrides/mhm/og-image.png',
    },
    // sky-blue1111.github.io/screenshield-site is a GitHub Pages project subpath.
    // Favicon fallback requests the icon at the domain root and gets 404s.
    // The logo is the official 180px icon.
    // The banner is the official 1200x630 og image.
    screenshield: {
      logo: 'public/static/images/overrides/screenshield/logo.png',
      ogImage: 'public/static/images/overrides/screenshield/og-image.png',
    },
    // mailzzy.com's favicon.png is 48px. The site publishes no apple-touch icon and no manifest.
    // The logo is the icon on the left of the official wordmark SVG, rasterized at 512px.
    // The published og:image is that wordmark on white. The banner is a 1200x630 screenshot of the English homepage hero.
    mailzzy: {
      logo: 'public/static/images/overrides/mailzzy/logo.png',
      ogImage: 'public/static/images/overrides/mailzzy/og-image.png',
    },
    // The App Store share image is a 600x1299 screenshot. The offer page publishes no og:image.
    // The banner is a 1200x630 screenshot of the English offer page.
    dopy: {
      ogImage: 'public/static/images/overrides/dopy/og-image.png',
    },
    // hapday.app's og:image is the 512px icon. The banner is a 1200x630 screenshot of the English offer page.
    hapday: {
      ogImage: 'public/static/images/overrides/hapday/og-image.png',
    },
    // habyy.app publishes no og:image. The banner is a 1200x630 screenshot of the English offer page.
    sunrise: {
      ogImage: 'public/static/images/overrides/sunrise/og-image.png',
    },
    // breakup.one's og:image is a 510px square. The banner is a 1200x630 screenshot of the English offer page.
    'breakup-ai': {
      ogImage: 'public/static/images/overrides/breakup-ai/og-image.png',
    },
    // The App Store share image is a tall screenshot. This is the official 1200x630 og:image from praylift.io.
    lift: {
      ogImage: 'public/static/images/overrides/lift/og-image.png',
    },
    // transcrybe.app only publishes a 32px favicon. The logo is the official 512px Mac App Store icon. The banner is left for the generator.
    'transcrybe-live-translation': {
      logo: 'public/static/images/overrides/transcrybe-live-translation/logo.png',
    },
    // The logo is the official 512px App Store icon for Nihongo.
    'nihongo-japanese-dictionary': {
      logo: 'public/static/images/overrides/nihongo-japanese-dictionary/logo.png',
    },
    // The logo is the official 512px App Store icon for Nihongo Lessons.
    'nihongo-lessons': {
      logo: 'public/static/images/overrides/nihongo-lessons/logo.png',
    },
    // alttextlab.com/black-friday publishes no og:image. The banner is the official 1200x630 homepage share image, and the logo is the official 256px icon.
    alttextlab: {
      logo: 'public/static/images/overrides/alttextlab/logo.png',
      ogImage: 'public/static/images/overrides/alttextlab/og-image.png',
    },
    // cyberwarfare.live publishes no og:image. The logo is the official 500px mark, and the banner is a 1200x630 screenshot of the English homepage.
    'cyberwarfare-labs': {
      logo: 'public/static/images/overrides/cyberwarfare-labs/logo.png',
      ogImage: 'public/static/images/overrides/cyberwarfare-labs/og-image.png',
    },
    // ivaboard.com/lifetime/ saved no banner. This is the official 1200x630 og:image: "Collect feedback. Decide what to build. Tell people you shipped it."
    ivaboard: {
      ogImage: 'public/static/images/overrides/ivaboard/og-image.png',
    },
    // www.videowalllive.com's fetched logo is 180px. This is the official 512px icon.
    'video-wall-live': {
      logo: 'public/static/images/overrides/video-wall-live/logo.png',
    },
    // datapeek.dev's favicon.ico is the default Next.js triangle, and og-image.png returns 404. The logo is the official 1024px app icon resized to 512px. The banner is a 1200x630 screenshot of the English homepage hero.
    'data-peek': {
      logo: 'public/static/images/overrides/data-peek/logo.png',
      ogImage: 'public/static/images/overrides/data-peek/og-image.png',
    },
    // imagineyourbook.com only links a 48px favicon. This is the official 514px icon. The banner is left for the generator.
    imagineyourbook: {
      logo: 'public/static/images/overrides/imagineyourbook/logo.png',
    },
    // roadsaudio.com's larger icon links fail; only a 48px favicon decodes. The logo is the official 512px App Store icon. The banner is the official 1200x630 Black Friday share image: Lifetime, $49.99 once.
    'roads-audio': {
      logo: 'public/static/images/overrides/roads-audio/logo.png',
      ogImage: 'public/static/images/overrides/roads-audio/og-image.png',
    },
    // litur.app only links a 48px favicon, and its og:image is a 2071x2071 square icon. The logo is the official 512px Mac App Store icon. The banner is a 1200x630 screenshot of the English homepage hero.
    litur: {
      logo: 'public/static/images/overrides/litur/logo.png',
      ogImage: 'public/static/images/overrides/litur/og-image.png',
    },
    // thinkdown.app published no saved banner. This is the official 1200x630 og:image: "Say it messy. Read it clean."
    thinkdown: {
      ogImage: 'public/static/images/overrides/thinkdown/og-image.png',
    },
    // liftonic.app published no saved banner. This is the official 1200x630 og:image: "Lift with a plan, every day."
    liftonic: {
      ogImage: 'public/static/images/overrides/liftonic/og-image.png',
    },
    // tryhelix.app published no saved banner. This is the official 1200x630 og:image: "A weapon wheel for your Mac."
    helix: {
      ogImage: 'public/static/images/overrides/helix/og-image.png',
    },
    // www.plomer.app's og:image is a 1200x801 photo. Center-cropped to 1200x630 so the phone stays in frame.
    plomer: {
      ogImage: 'public/static/images/overrides/plomer/og-image.png',
    },
    // www.craft.do published no saved banner. This is the official 1200x630 og:image, the CRAFT wordmark.
    craft: {
      ogImage: 'public/static/images/overrides/craft/og-image.png',
    },
    // www.blark.app's og:image is a 3000x2000 render of two phones. Scaled to fit inside 1200x630 and padded with black so both phones stay visible.
    blark: {
      ogImage: 'public/static/images/overrides/blark/og-image.png',
    },
    // usekuroko.com's generated logo is a 32px favicon. This is the official 512px Mac App Store icon.
    kuroko: {
      logo: 'public/static/images/overrides/kuroko/logo.png',
    },
    // appgridmac.com/pricing/ has no og:image (404). The banner is a 1200x630 screenshot of the English pricing hero: Black Friday, one purchase covers up to five Macs, 50% off $25 $12.50.
    appgrid: {
      ogImage: 'public/static/images/overrides/appgrid/og-image.png',
    },
    // launchosapp.com's generated logo is a 32px favicon. This is the official favicon.svg rasterized to a 512px PNG, transparent background kept.
    launchos: {
      logo: 'public/static/images/overrides/launchos/logo.png',
    },
    // photok.app's generated og:image is a 512x512 square icon. The banner is a 1200x630 screenshot of the English homepage hero.
    'photok-secure-photo-vault': {
      ogImage: 'public/static/images/overrides/photok-secure-photo-vault/og-image.png',
    },
    // www.exploitpack.com/products/exploit-pack publishes a 1254px square og:image and a 32px favicon. The banner is a 1200x630 screenshot of the English product hero. The logo is the official 512px Exploitpack.png.
    'exploit-pack': {
      logo: 'public/static/images/overrides/exploit-pack/logo.png',
      ogImage: 'public/static/images/overrides/exploit-pack/og-image.png',
    },
    // www.exploitpack.com/products/control-pack publishes a 1254px square og:image. The banner is a 1200x630 screenshot of the English product hero. The logo is the same official 512px Exploit Pack icon.
    'control-pack': {
      logo: 'public/static/images/overrides/control-pack/logo.png',
      ogImage: 'public/static/images/overrides/control-pack/og-image.png',
    },
    // www.exploitpack.com/products/kernel-pack publishes a 1254px square og:image. The banner is a 1200x630 screenshot of the English product hero. The logo is the same official 512px Exploit Pack icon.
    'kernel-pack': {
      logo: 'public/static/images/overrides/kernel-pack/logo.png',
      ogImage: 'public/static/images/overrides/kernel-pack/og-image.png',
    },
    // translatemanga.net's generated og:image is a blank 1200x630. The banner is a 1200x630 screenshot of the English homepage hero. The logo is the official logo.svg rasterized at 512px.
    translatemanga: {
      logo: 'public/static/images/overrides/translatemanga/logo.png',
      ogImage: 'public/static/images/overrides/translatemanga/og-image.png',
    },
    // checkcam.zorrinapps.com's og:image is the square app icon. The banner is a 1200x630 screenshot of the English homepage hero.
    checkcam: {
      ogImage: 'public/static/images/overrides/checkcam/og-image.png',
    },
    // The generated logo is the Tappect agency mark, and the og:image is a 1284x2778 portrait screenshot. The logo is the official 512px Nomu App Store icon. The banner is a 1200x630 screenshot of the English product hero.
    nomu: {
      logo: 'public/static/images/overrides/nomu/logo.png',
      ogImage: 'public/static/images/overrides/nomu/og-image.png',
    },
    // The generated logo is the Tappect agency mark. This is the official 512px Meanwhile App Store icon. The 1200x630 og:image stays.
    meanwhile: {
      logo: 'public/static/images/overrides/meanwhile/logo.png',
    },
    // The saved og:image is a 598x1300 portrait. Scaled to fit inside 1200x630 and padded with its dominant green, the way blark is padded. The 400px logo stays.
    nutrify: {
      ogImage: 'public/static/images/overrides/nutrify/og-image.png',
    },
    // 3droomdesign.ai's generated logo is a 32px favicon. This is the official favicon.svg rasterized at 512px.
    '3droomdesign-ai': {
      logo: 'public/static/images/overrides/3droomdesign-ai/logo.png',
    },
    // bibigpt.co's generated logo is a 48px favicon. This is the official 512px manifest icon.
    bibigpt: {
      logo: 'public/static/images/overrides/bibigpt/logo.png',
    },
    // secretshot.zorrinapps.com's generated logo is a 48px favicon. This is the official 512px App Store icon.
    secretshot: {
      logo: 'public/static/images/overrides/secretshot/logo.png',
    },
    // vocalremover.one's generated logo is a 48px favicon. This is the official logo.svg rasterized at 512px.
    'vocalremover-one': {
      logo: 'public/static/images/overrides/vocalremover-one/logo.png',
    },
    // relaybrook.bytesell.app publishes no favicon. Its CDN logo and og:image
    // answer with a Cloudflare challenge, and Google's favicon service returns 404.
    // The logo is the owner's GitHub avatar. The banner is a 1200x630 screenshot of the English storefront.
    'relaybrook-n8n-workflow-packs': {
      logo: 'public/static/images/overrides/relaybrook-n8n-workflow-packs/logo.png',
      ogImage: 'public/static/images/overrides/relaybrook-n8n-workflow-packs/og-image.png',
    },
    // codesnippets.pro answered with a Cloudflare "Just a moment..." page, which left a 32px favicon and no banner.
    // The logo is the official 512px icon. The banner is the official English product hero.
    'code-snippets-pro': {
      logo: 'public/static/images/overrides/code-snippets-pro/logo.png',
      ogImage: 'public/static/images/overrides/code-snippets-pro/og-image.png',
    },
    // clarpex.ai links a 48px favicon. This is the official favicon.svg rasterized at 512px.
    'clarpex-ai': {
      logo: 'public/static/images/overrides/clarpex-ai/logo.png',
    },
    // orchard.5km.tech's favicon is a 24px SVG. This is the official app icon.
    orchard: {
      logo: 'public/static/images/overrides/orchard/logo.png',
    },
    // The linked favicon is the 100px crop. This is the official 512px Logo-final-512.png.
    'transync-ai': {
      logo: 'public/static/images/overrides/transync-ai/logo.png',
    },
    // translatewp.ai's only icon is an SVG. This is that mark, rasterized at 512px.
    translatewp: {
      logo: 'public/static/images/overrides/translatewp/logo.png',
    },
    // The favicon is 64px. The logo is the official logo.svg rasterized at 512px.
    // The banner is the official English og-image.jpg.
    viralreel: {
      logo: 'public/static/images/overrides/viralreel/logo.png',
      ogImage: 'public/static/images/overrides/viralreel/og-image.png',
    },
    // The App Store og:image is the app icon on white, and the saved capture was a 600x1300 portrait.
    // The banner is a 1200x630 screenshot of the English App Store page.
    mypdf: {
      ogImage: 'public/static/images/overrides/mypdf/og-image.png',
    },
    // The App Store og:image is the app icon on white, and the saved capture was a 598x1300 portrait.
    // The banner is a 1200x630 screenshot of the English App Store page.
    selfos: {
      ogImage: 'public/static/images/overrides/selfos/og-image.png',
    },
    // The published cover is an 800x450 price-tag drawing. The banner is a 1200x630 screenshot of the English homepage.
    'whisper-memos': {
      ogImage: 'public/static/images/overrides/whisper-memos/og-image.png',
    },
    // snapperon.com's og:image is a 1200x1413 editor capture. The banner is a 1200x630 screenshot of the English homepage.
    snapperon: {
      ogImage: 'public/static/images/overrides/snapperon/og-image.png',
    },
    // cutfa.st's published hero is Chinese. The banner is a 1200x630 screenshot of the English pricing page.
    cutfast: {
      ogImage: 'public/static/images/overrides/cutfast/og-image.png',
    },
    // The App Store screenshot's menu bar is Chinese. The banner is a 1200x630 screenshot of the English App Store page.
    'timego-clock': {
      ogImage: 'public/static/images/overrides/timego-clock/og-image.png',
    },
    // openpi.uk's captured share image includes a cookie banner over the hero. The banner is a 1200x630 screenshot of the English homepage with that banner dismissed.
    'open-pi-raspberry-pi-manager': {
      ogImage: 'public/static/images/overrides/open-pi-raspberry-pi-manager/og-image.png',
    },
    // scribetoany.com/pricing's captured share image includes a cookie banner. The banner is a 1200x630 screenshot of the English pricing page with that banner dismissed.
    scribetoany: {
      ogImage: 'public/static/images/overrides/scribetoany/og-image.png',
    },
    // apptorium.com serves one shared favicon, so the saved logo is not this app's icon.
    // This is the official SideNotes icon.
    sidenotes: {
      logo: 'public/static/images/overrides/sidenotes/logo.png',
    },
    // apptorium.com serves one shared favicon, so the saved logo is not this app's icon.
    // This is the official FiveNotes icon.
    fivenotes: {
      logo: 'public/static/images/overrides/fivenotes/logo.png',
    },
    // apptorium.com serves one shared favicon, so the saved logo is not this app's icon.
    // This is the official Workspaces icon.
    workspaces: {
      logo: 'public/static/images/overrides/workspaces/logo.png',
    },
    // apptorium.com serves one shared favicon, so the saved logo is not this app's icon.
    // This is the official Cursor Teleporter icon.
    'cursor-teleporter': {
      logo: 'public/static/images/overrides/cursor-teleporter/logo.png',
    },
    // Official wordmark cropped from the site header; serpwrap.com has no favicon.
    serpwrap: {
      logo: 'public/static/images/overrides/serpwrap/logo.png',
    },
  },
};
