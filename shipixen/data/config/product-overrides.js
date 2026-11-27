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
    // ay-grants / ay-tenders: the sites only publish an inline SVG favicon. The logo is that SVG, rasterized.
    // Pinned official og:image; a CI fetch hit DNS timeouts.
    'ay-grants': {
      logo: 'public/static/images/overrides/ay-grants/logo.png',
      ogImage: 'public/static/images/overrides/ay-grants/og-image.png',
    },
    'ay-tenders': {
      logo: 'public/static/images/overrides/ay-tenders/logo.png',
      ogImage: 'public/static/images/overrides/ay-tenders/og-image.png',
    },
    // narrationbox.com/pricing gave no usable banner. This is the official og:image.
    // The logo is the official 180px apple-touch-icon.
    'narration-box': {
      logo: 'public/static/images/overrides/narration-box/logo.png',
      ogImage: 'public/static/images/overrides/narration-box/og-image.png',
    },
    // babapic.cc's og:image headline is Chinese. The banner is a reviewed screenshot of the English homepage.
    babapic: {
      ogImage: 'public/static/images/overrides/babapic/og-image.png',
    },
    // The saved logo was a 32px favicon. This is the official 180px apple-touch-icon.
    // Pinned official og:image; a CI fetch hit DNS timeouts.
    stashkin: {
      logo: 'public/static/images/overrides/stashkin/logo.png',
      ogImage: 'public/static/images/overrides/stashkin/og-image.png',
    },
    // Pinned official og:image; a CI fetch hit DNS timeouts.
    screenpost: {
      ogImage: 'public/static/images/overrides/screenpost/og-image.png',
    },
    // Pinned official og:image; a CI fetch hit DNS timeouts.
    waitlyze: {
      ogImage: 'public/static/images/overrides/waitlyze/og-image.png',
    },
    // Pinned official og:image; a CI fetch hit DNS timeouts.
    zhenzhu: {
      ogImage: 'public/static/images/overrides/zhenzhu/og-image.png',
    },
    // keystro.app's og:image is 256x192. The banner is a reviewed 1200x630 homepage screenshot.
    keystro: {
      ogImage: 'public/static/images/overrides/keystro/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    'clipboard-ai': {
      ogImage: 'public/static/images/overrides/clipboard-ai/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    reelloft: {
      ogImage: 'public/static/images/overrides/reelloft/og-image.png',
    },
    // The App Store page has no usable og:image. The banner is a reviewed screenshot of that page.
    tablinker: {
      ogImage: 'public/static/images/overrides/tablinker/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    meetmic: {
      ogImage: 'public/static/images/overrides/meetmic/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    docrenewal: {
      ogImage: 'public/static/images/overrides/docrenewal/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    highseat: {
      ogImage: 'public/static/images/overrides/highseat/og-image.png',
    },
    // Parse Submission kept the generic site banner. This is the reviewed official banner.
    yovid: {
      ogImage: 'public/static/images/overrides/yovid/og-image.png',
    },
    // No usable official og:image. The banner is a reviewed screenshot of the Black Friday page.
    'vector-ink': {
      ogImage: 'public/static/images/overrides/vector-ink/og-image.png',
    },
    // Official og:image and official icon.
    imagetopes: {
      logo: 'public/static/images/overrides/imagetopes/logo.png',
      ogImage: 'public/static/images/overrides/imagetopes/og-image.png',
    },
    // Official og:image and official icon.
    'poop-tracker-log-ease': {
      logo: 'public/static/images/overrides/poop-tracker-log-ease/logo.png',
      ogImage: 'public/static/images/overrides/poop-tracker-log-ease/og-image.png',
    },
    // Official og:image and official icon.
    'relationship-tracker-duo': {
      logo: 'public/static/images/overrides/relationship-tracker-duo/logo.png',
      ogImage: 'public/static/images/overrides/relationship-tracker-duo/og-image.png',
    },
    // Official og:image and official icon.
    'visual-timer-for-kids-tim': {
      logo: 'public/static/images/overrides/visual-timer-for-kids-tim/logo.png',
      ogImage: 'public/static/images/overrides/visual-timer-for-kids-tim/og-image.png',
    },
    // Official og:image and official icon.
    'omni-brain': {
      logo: 'public/static/images/overrides/omni-brain/logo.png',
      ogImage: 'public/static/images/overrides/omni-brain/og-image.png',
    },
    // Official og:image and official icon.
    glowlink: {
      logo: 'public/static/images/overrides/glowlink/logo.png',
      ogImage: 'public/static/images/overrides/glowlink/og-image.png',
    },
    // Official icon. The og image is the maker's English version of its official German Black Week banner.
    bookable: {
      logo: 'public/static/images/overrides/bookable/logo.png',
      ogImage: 'public/static/images/overrides/bookable/og-image.png',
    },
    // Official og:image.
    wallper: {
      ogImage: 'public/static/images/overrides/wallper/og-image.png',
    },
    // Official og:image. The logo is its official SVG icon, rasterized.
    snapapp: {
      logo: 'public/static/images/overrides/snapapp/logo.png',
      ogImage: 'public/static/images/overrides/snapapp/og-image.png',
    },
    // Official og:image and official icon.
    fadeclock: {
      logo: 'public/static/images/overrides/fadeclock/logo.png',
      ogImage: 'public/static/images/overrides/fadeclock/og-image.png',
    },
    // usetantra.com links a 64px icon. This is the official 180px apple-touch icon.
    // The banner is the official 1200x630 opengraph image.
    tantra: {
      logo: 'public/static/images/overrides/tantra/logo.png',
      ogImage: 'public/static/images/overrides/tantra/og-image.png',
    },
    // Official 1200x630 share image published at getvoibe.com/images/og-share.png.
    voibe: {
      logo: 'public/static/images/overrides/voibe/logo.png',
      ogImage: 'public/static/images/overrides/voibe/og-image.png',
    },
    // Official og:image and official icon.
    'android-app-hacking-mastery': {
      logo: 'public/static/images/overrides/android-app-hacking-mastery/logo.png',
      ogImage: 'public/static/images/overrides/android-app-hacking-mastery/og-image.png',
    },
    // Official og:image and official icon.
    mockvid: {
      logo: 'public/static/images/overrides/mockvid/logo.png',
      ogImage: 'public/static/images/overrides/mockvid/og-image.png',
    },
    // Official og:image and official icon.
    hooktide: {
      logo: 'public/static/images/overrides/hooktide/logo.png',
      ogImage: 'public/static/images/overrides/hooktide/og-image.png',
    },
    // Official og:image.
    mixpost: {
      ogImage: 'public/static/images/overrides/mixpost/og-image.png',
    },
    // Official 1200x630 homepage share image. The pricing page publishes its own card.
    cryptokeyhole: {
      logo: 'public/static/images/overrides/cryptokeyhole/logo.png',
      ogImage: 'public/static/images/overrides/cryptokeyhole/og-image.png',
    },
    // Official og:image and official icon.
    'aso-atlas': {
      logo: 'public/static/images/overrides/aso-atlas/logo.png',
      ogImage: 'public/static/images/overrides/aso-atlas/og-image.png',
    },
    // Official og:image and official icon.
    'latw-ai-translation-plugins': {
      logo: 'public/static/images/overrides/latw-ai-translation-plugins/logo.png',
      ogImage: 'public/static/images/overrides/latw-ai-translation-plugins/og-image.png',
    },
    // Official og:image and official icon.
    morse: {
      logo: 'public/static/images/overrides/morse/logo.png',
      ogImage: 'public/static/images/overrides/morse/og-image.png',
    },
    // Official og:image and official icon.
    'checkout-page': {
      logo: 'public/static/images/overrides/checkout-page/logo.png',
      ogImage: 'public/static/images/overrides/checkout-page/og-image.png',
    },
    // Official WordPress.org plugin icon.
    reviso: {
      logo: 'public/static/images/overrides/reviso/logo.png',
    },
    // Official og:image and official icon.
    narva: {
      logo: 'public/static/images/overrides/narva/logo.png',
      ogImage: 'public/static/images/overrides/narva/og-image.png',
    },
    // Official og:image and official icon.
    'band-je': {
      logo: 'public/static/images/overrides/band-je/logo.png',
      ogImage: 'public/static/images/overrides/band-je/og-image.png',
    },
    // Official og:image and official icon.
    heynews: {
      logo: 'public/static/images/overrides/heynews/logo.png',
      ogImage: 'public/static/images/overrides/heynews/og-image.png',
    },
    // Official og:image and official icon.
    'knitting-chart': {
      logo: 'public/static/images/overrides/knitting-chart/logo.png',
      ogImage: 'public/static/images/overrides/knitting-chart/og-image.png',
    },
    // Official og:image and official icon.
    'the-cross-stitch-pattern-maker': {
      logo: 'public/static/images/overrides/the-cross-stitch-pattern-maker/logo.png',
      ogImage: 'public/static/images/overrides/the-cross-stitch-pattern-maker/og-image.png',
    },
    // Official og:image and official icon.
    'post-saver': {
      logo: 'public/static/images/overrides/post-saver/logo.png',
      ogImage: 'public/static/images/overrides/post-saver/og-image.png',
    },
    // Official og:image and official icon.
    postsyncer: {
      logo: 'public/static/images/overrides/postsyncer/logo.png',
      ogImage: 'public/static/images/overrides/postsyncer/og-image.png',
    },
    // Official og:image and official icon.
    supaseo: {
      logo: 'public/static/images/overrides/supaseo/logo.png',
      ogImage: 'public/static/images/overrides/supaseo/og-image.png',
    },
    // Official og:image and official icon.
    vibefather: {
      logo: 'public/static/images/overrides/vibefather/logo.png',
      ogImage: 'public/static/images/overrides/vibefather/og-image.png',
    },
    // Official og:image and official icon.
    socialapis: {
      logo: 'public/static/images/overrides/socialapis/logo.png',
      ogImage: 'public/static/images/overrides/socialapis/og-image.png',
    },
    // Official og:image and official icon.
    'headroom-for-mac': {
      logo: 'public/static/images/overrides/headroom-for-mac/logo.png',
      ogImage: 'public/static/images/overrides/headroom-for-mac/og-image.png',
    },
    // Official og:image and official icon.
    peektheday: {
      logo: 'public/static/images/overrides/peektheday/logo.png',
      ogImage: 'public/static/images/overrides/peektheday/og-image.png',
    },
    // Official App Store icon and App Store share image.
    note: {
      logo: 'public/static/images/overrides/note/logo.png',
      ogImage: 'public/static/images/overrides/note/og-image.png',
    },
    // Official og:image and official icon.
    'code-maestro': {
      logo: 'public/static/images/overrides/code-maestro/logo.png',
      ogImage: 'public/static/images/overrides/code-maestro/og-image.png',
    },
    // Official og:image and official icon.
    earlylore: {
      logo: 'public/static/images/overrides/earlylore/logo.png',
      ogImage: 'public/static/images/overrides/earlylore/og-image.png',
    },
    // Official og:image and official icon.
    backdrop: {
      logo: 'public/static/images/overrides/backdrop/logo.png',
      ogImage: 'public/static/images/overrides/backdrop/og-image.png',
    },
    // Official og:image and official icon.
    sensei: {
      logo: 'public/static/images/overrides/sensei/logo.png',
      ogImage: 'public/static/images/overrides/sensei/og-image.png',
    },
    // Official App Store icon and App Store share image.
    daydare: {
      logo: 'public/static/images/overrides/daydare/logo.png',
      ogImage: 'public/static/images/overrides/daydare/og-image.png',
    },
    // Official og:image and official icon.
    clino: {
      logo: 'public/static/images/overrides/clino/logo.png',
      ogImage: 'public/static/images/overrides/clino/og-image.png',
    },
    // Official icon and official product image.
    papermac: {
      logo: 'public/static/images/overrides/papermac/logo.png',
      ogImage: 'public/static/images/overrides/papermac/og-image.png',
    },
    // Official og:image and official icon.
    udemie: {
      logo: 'public/static/images/overrides/udemie/logo.png',
      ogImage: 'public/static/images/overrides/udemie/og-image.png',
    },
    // Official og:image and official icon.
    kollab: {
      logo: 'public/static/images/overrides/kollab/logo.png',
      ogImage: 'public/static/images/overrides/kollab/og-image.png',
    },
    // Official og:image and official icon.
    moordeck: {
      logo: 'public/static/images/overrides/moordeck/logo.png',
      ogImage: 'public/static/images/overrides/moordeck/og-image.png',
    },
    // Official og:image and official icon.
    vaneform: {
      logo: 'public/static/images/overrides/vaneform/logo.png',
      ogImage: 'public/static/images/overrides/vaneform/og-image.png',
    },
    // Official og:image and official icon.
    'indie-kit': {
      logo: 'public/static/images/overrides/indie-kit/logo.png',
      ogImage: 'public/static/images/overrides/indie-kit/og-image.png',
    },
    // Official og:image and official icon.
    gitcms: {
      logo: 'public/static/images/overrides/gitcms/logo.png',
      ogImage: 'public/static/images/overrides/gitcms/og-image.png',
    },
    // Official og:image and official icon.
    beamly: {
      logo: 'public/static/images/overrides/beamly/logo.png',
      ogImage: 'public/static/images/overrides/beamly/og-image.png',
    },
    // Official og:image and official icon.
    expandi: {
      logo: 'public/static/images/overrides/expandi/logo.png',
      ogImage: 'public/static/images/overrides/expandi/og-image.png',
    },
    // Official og:image and official icon.
    grai: {
      logo: 'public/static/images/overrides/grai/logo.png',
      ogImage: 'public/static/images/overrides/grai/og-image.png',
    },
    // Official og:image and official icon.
    betterdisplay: {
      logo: 'public/static/images/overrides/betterdisplay/logo.png',
      ogImage: 'public/static/images/overrides/betterdisplay/og-image.png',
    },
    // Official og:image and official icon.
    shadcnstore: {
      logo: 'public/static/images/overrides/shadcnstore/logo.png',
      ogImage: 'public/static/images/overrides/shadcnstore/og-image.png',
    },
    // Official og:image and official icon.
    backlinkgenie: {
      logo: 'public/static/images/overrides/backlinkgenie/logo.png',
      ogImage: 'public/static/images/overrides/backlinkgenie/og-image.png',
    },
    // Official og:image and official icon.
    shiftapp: {
      logo: 'public/static/images/overrides/shiftapp/logo.png',
      ogImage: 'public/static/images/overrides/shiftapp/og-image.png',
    },
    // Official og:image and official icon.
    dockspace: {
      logo: 'public/static/images/overrides/dockspace/logo.png',
      ogImage: 'public/static/images/overrides/dockspace/og-image.png',
    },
    // Official og:image and official icon.
    a1: {
      logo: 'public/static/images/overrides/a1/logo.png',
      ogImage: 'public/static/images/overrides/a1/og-image.png',
    },
    // Official og:image and official icon.
    'fluidcast-podcast-player': {
      logo: 'public/static/images/overrides/fluidcast-podcast-player/logo.png',
      ogImage: 'public/static/images/overrides/fluidcast-podcast-player/og-image.png',
    },
    // Official og:image and official icon.
    rakazo: {
      logo: 'public/static/images/overrides/rakazo/logo.png',
      ogImage: 'public/static/images/overrides/rakazo/og-image.png',
    },
    // Official og:image and official icon.
    meboki: {
      logo: 'public/static/images/overrides/meboki/logo.png',
      ogImage: 'public/static/images/overrides/meboki/og-image.png',
    },
    // Official og:image and official icon.
    hermoso: {
      logo: 'public/static/images/overrides/hermoso/logo.png',
      ogImage: 'public/static/images/overrides/hermoso/og-image.png',
    },
    // Official og:image and official icon.
    'ninja-compress': {
      logo: 'public/static/images/overrides/ninja-compress/logo.png',
      ogImage: 'public/static/images/overrides/ninja-compress/og-image.png',
    },
    // Official og:image and official icon.
    apprankhero: {
      logo: 'public/static/images/overrides/apprankhero/logo.png',
      ogImage: 'public/static/images/overrides/apprankhero/og-image.png',
    },
    // Official og:image and official icon.
    ontrk: {
      logo: 'public/static/images/overrides/ontrk/logo.png',
      ogImage: 'public/static/images/overrides/ontrk/og-image.png',
    },
    // Official og:image and official icon.
    dropcue: {
      logo: 'public/static/images/overrides/dropcue/logo.png',
      ogImage: 'public/static/images/overrides/dropcue/og-image.png',
    },
    // Official og:image and official icon.
    blendcue: {
      logo: 'public/static/images/overrides/blendcue/logo.png',
      ogImage: 'public/static/images/overrides/blendcue/og-image.png',
    },
    // Official og:image and official icon.
    whizi: {
      logo: 'public/static/images/overrides/whizi/logo.png',
      ogImage: 'public/static/images/overrides/whizi/og-image.png',
    },
    // Official og:image and official icon.
    wassenger: {
      logo: 'public/static/images/overrides/wassenger/logo.png',
      ogImage: 'public/static/images/overrides/wassenger/og-image.png',
    },
    // Official og:image and official icon.
    'clothsy-ai': {
      logo: 'public/static/images/overrides/clothsy-ai/logo.png',
      ogImage: 'public/static/images/overrides/clothsy-ai/og-image.png',
    },
    // Official og:image and official icon.
    outlierkit: {
      logo: 'public/static/images/overrides/outlierkit/logo.png',
      ogImage: 'public/static/images/overrides/outlierkit/og-image.png',
    },
    // Official og:image and official icon.
    crawlraven: {
      logo: 'public/static/images/overrides/crawlraven/logo.png',
      ogImage: 'public/static/images/overrides/crawlraven/og-image.png',
    },
    // Official og:image and official icon.
    faxio: {
      logo: 'public/static/images/overrides/faxio/logo.png',
      ogImage: 'public/static/images/overrides/faxio/og-image.png',
    },
    // Official og:image and official icon.
    sitedata: {
      logo: 'public/static/images/overrides/sitedata/logo.png',
      ogImage: 'public/static/images/overrides/sitedata/og-image.png',
    },
    // Official og:image and official icon.
    zeptap: {
      logo: 'public/static/images/overrides/zeptap/logo.png',
      ogImage: 'public/static/images/overrides/zeptap/og-image.png',
    },
    // Official og:image and official icon.
    'post-affiliate-pro': {
      logo: 'public/static/images/overrides/post-affiliate-pro/logo.png',
      ogImage: 'public/static/images/overrides/post-affiliate-pro/og-image.png',
    },
    // Official og:image and official icon.
    liveagent: {
      logo: 'public/static/images/overrides/liveagent/logo.png',
      ogImage: 'public/static/images/overrides/liveagent/og-image.png',
    },
    // Official og:image and official icon.
    'baby-monitor-private-cam': {
      logo: 'public/static/images/overrides/baby-monitor-private-cam/logo.png',
      ogImage: 'public/static/images/overrides/baby-monitor-private-cam/og-image.png',
    },
    // Official og:image and official icon.
    'home-pet-monitor': {
      logo: 'public/static/images/overrides/home-pet-monitor/logo.png',
      ogImage: 'public/static/images/overrides/home-pet-monitor/og-image.png',
    },
    // Official og:image and official icon.
    gridpin: {
      logo: 'public/static/images/overrides/gridpin/logo.png',
      ogImage: 'public/static/images/overrides/gridpin/og-image.png',
    },
    // Official og:image and official icon.
    voxscribe: {
      logo: 'public/static/images/overrides/voxscribe/logo.png',
      ogImage: 'public/static/images/overrides/voxscribe/og-image.png',
    },
    // Official og:image and official icon.
    reui: {
      logo: 'public/static/images/overrides/reui/logo.png',
      ogImage: 'public/static/images/overrides/reui/og-image.png',
    },
    // Official og:image and official icon.
    whatsteam: {
      logo: 'public/static/images/overrides/whatsteam/logo.png',
      ogImage: 'public/static/images/overrides/whatsteam/og-image.png',
    },
    // Official og:image and official icon.
    'spring-prompt': {
      logo: 'public/static/images/overrides/spring-prompt/logo.png',
      ogImage: 'public/static/images/overrides/spring-prompt/og-image.png',
    },
    // Official og:image and official icon.
    'backpack-for-laravel': {
      logo: 'public/static/images/overrides/backpack-for-laravel/logo.png',
      ogImage: 'public/static/images/overrides/backpack-for-laravel/og-image.png',
    },
    // The banner is a screenshot of the official pricing page because the official og:image 404s.
    recurrr: {
      logo: 'public/static/images/overrides/recurrr/logo.png',
      ogImage: 'public/static/images/overrides/recurrr/og-image.png',
    },
    // Official og:image and official icon.
    'quiet-winners': {
      logo: 'public/static/images/overrides/quiet-winners/logo.png',
      ogImage: 'public/static/images/overrides/quiet-winners/og-image.png',
    },
    // Official og:image and official icon.
    lurkapi: {
      logo: 'public/static/images/overrides/lurkapi/logo.png',
      ogImage: 'public/static/images/overrides/lurkapi/og-image.png',
    },
    // Official og:image and official icon.
    filebo: {
      logo: 'public/static/images/overrides/filebo/logo.png',
      ogImage: 'public/static/images/overrides/filebo/og-image.png',
    },
    // Official og:image and official icon.
    focusito: {
      logo: 'public/static/images/overrides/focusito/logo.png',
      ogImage: 'public/static/images/overrides/focusito/og-image.png',
    },
    // Official og:image and official icon.
    'mochi-type': {
      logo: 'public/static/images/overrides/mochi-type/logo.png',
      ogImage: 'public/static/images/overrides/mochi-type/og-image.png',
    },
    // Official og:image and official icon.
    audiobo: {
      logo: 'public/static/images/overrides/audiobo/logo.png',
      ogImage: 'public/static/images/overrides/audiobo/og-image.png',
    },
    // Official og:image and official icon.
    autentique: {
      logo: 'public/static/images/overrides/autentique/logo.png',
      ogImage: 'public/static/images/overrides/autentique/og-image.png',
    },
    // Official og:image and official icon.
    miget: {
      logo: 'public/static/images/overrides/miget/logo.png',
      ogImage: 'public/static/images/overrides/miget/og-image.png',
    },
    // Official og:image and official icon.
    stepfinch: {
      logo: 'public/static/images/overrides/stepfinch/logo.png',
      ogImage: 'public/static/images/overrides/stepfinch/og-image.png',
    },
    // Official og:image and official icon.
    shiprust: {
      logo: 'public/static/images/overrides/shiprust/logo.png',
      ogImage: 'public/static/images/overrides/shiprust/og-image.png',
    },
    // Official og:image and official icon.
    uptimecheck: {
      logo: 'public/static/images/overrides/uptimecheck/logo.png',
      ogImage: 'public/static/images/overrides/uptimecheck/og-image.png',
    },
    // Official og:image and official icon.
    vimninja: {
      logo: 'public/static/images/overrides/vimninja/logo.png',
      ogImage: 'public/static/images/overrides/vimninja/og-image.png',
    },
    // Official og:image and official icon.
    screenpipe: {
      logo: 'public/static/images/overrides/screenpipe/logo.png',
      ogImage: 'public/static/images/overrides/screenpipe/og-image.png',
    },
    // Official og:image and official icon.
    'utobo-email': {
      logo: 'public/static/images/overrides/utobo-email/logo.png',
      ogImage: 'public/static/images/overrides/utobo-email/og-image.png',
    },
    // Official og:image and official icon.
    shorvo: {
      logo: 'public/static/images/overrides/shorvo/logo.png',
      ogImage: 'public/static/images/overrides/shorvo/og-image.png',
    },
    // Official og:image and official icon.
    'vibe-island': {
      logo: 'public/static/images/overrides/vibe-island/logo.png',
      ogImage: 'public/static/images/overrides/vibe-island/og-image.png',
    },
    // Official og:image and official icon.
    easyswitch: {
      logo: 'public/static/images/overrides/easyswitch/logo.png',
      ogImage: 'public/static/images/overrides/easyswitch/og-image.png',
    },
    // Official og:image and official icon.
    chatseo: {
      logo: 'public/static/images/overrides/chatseo/logo.png',
      ogImage: 'public/static/images/overrides/chatseo/og-image.png',
    },
    // Official og:image and official icon.
    firecut: {
      logo: 'public/static/images/overrides/firecut/logo.png',
      ogImage: 'public/static/images/overrides/firecut/og-image.png',
    },
    // Official og:image and official icon.
    hardcopy: {
      logo: 'public/static/images/overrides/hardcopy/logo.png',
      ogImage: 'public/static/images/overrides/hardcopy/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    genmagic: {
      logo: 'public/static/images/overrides/genmagic/logo.png',
      ogImage: 'public/static/images/overrides/genmagic/og-image.png',
    },
    // Official og:image and official icon.
    astrolinks: {
      logo: 'public/static/images/overrides/astrolinks/logo.png',
      ogImage: 'public/static/images/overrides/astrolinks/og-image.png',
    },
    // Official og:image and official icon.
    'horcrux-email-backup': {
      logo: 'public/static/images/overrides/horcrux-email-backup/logo.png',
      ogImage: 'public/static/images/overrides/horcrux-email-backup/og-image.png',
    },
    // Official og:image and official icon.
    quicksnip: {
      logo: 'public/static/images/overrides/quicksnip/logo.png',
      ogImage: 'public/static/images/overrides/quicksnip/og-image.png',
    },
    // Official og:image and official icon.
    intropi: {
      logo: 'public/static/images/overrides/intropi/logo.png',
      ogImage: 'public/static/images/overrides/intropi/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    thastock: {
      logo: 'public/static/images/overrides/thastock/logo.png',
      ogImage: 'public/static/images/overrides/thastock/og-image.png',
    },
    // Official og:image and official icon.
    lunille: {
      logo: 'public/static/images/overrides/lunille/logo.png',
      ogImage: 'public/static/images/overrides/lunille/og-image.png',
    },
    // Official og:image and official icon.
    shepetal: {
      logo: 'public/static/images/overrides/shepetal/logo.png',
      ogImage: 'public/static/images/overrides/shepetal/og-image.png',
    },
    // Official og:image and official icon.
    seenin: {
      logo: 'public/static/images/overrides/seenin/logo.png',
      ogImage: 'public/static/images/overrides/seenin/og-image.png',
    },
    // Official og:image and official icon.
    'rebit-pro': {
      logo: 'public/static/images/overrides/rebit-pro/logo.png',
      ogImage: 'public/static/images/overrides/rebit-pro/og-image.png',
    },
    // Official og:image and official icon.
    secdim: {
      logo: 'public/static/images/overrides/secdim/logo.png',
      ogImage: 'public/static/images/overrides/secdim/og-image.png',
    },
    // Official og:image and official icon.
    fundalyze: {
      logo: 'public/static/images/overrides/fundalyze/logo.png',
      ogImage: 'public/static/images/overrides/fundalyze/og-image.png',
    },
    // Official og:image and official icon.
    recapone: {
      logo: 'public/static/images/overrides/recapone/logo.png',
      ogImage: 'public/static/images/overrides/recapone/og-image.png',
    },
    // Official og:image and official icon.
    'brasswell': {
      logo: 'public/static/images/overrides/brasswell/logo.png',
      ogImage: 'public/static/images/overrides/brasswell/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'caddy-docs': {
      logo: 'public/static/images/overrides/caddy-docs/logo.png',
      ogImage: 'public/static/images/overrides/caddy-docs/og-image.png',
    },
    // The site publishes no og:image. The og-image is a screenshot of the official site. The logo is the official SVG icon rasterized to PNG.
    'cacheflo': {
      logo: 'public/static/images/overrides/cacheflo/logo.png',
      ogImage: 'public/static/images/overrides/cacheflo/og-image.png',
    },
    // Official og:image and official icon.
    'adstudio': {
      logo: 'public/static/images/overrides/adstudio/logo.png',
      ogImage: 'public/static/images/overrides/adstudio/og-image.png',
    },
    // Official og:image and official icon.
    'timeactor': {
      logo: 'public/static/images/overrides/timeactor/logo.png',
      ogImage: 'public/static/images/overrides/timeactor/og-image.png',
    },
    // Official og:image and official icon.
    'bettermerge': {
      logo: 'public/static/images/overrides/bettermerge/logo.png',
      ogImage: 'public/static/images/overrides/bettermerge/og-image.png',
    },
    // Official og:image and official icon.
    '1devtool': {
      logo: 'public/static/images/overrides/1devtool/logo.png',
      ogImage: 'public/static/images/overrides/1devtool/og-image.png',
    },
    // Official og:image and official icon.
    '1designtool': {
      logo: 'public/static/images/overrides/1designtool/logo.png',
      ogImage: 'public/static/images/overrides/1designtool/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    'stoicsoft': {
      logo: 'public/static/images/overrides/stoicsoft/logo.png',
      ogImage: 'public/static/images/overrides/stoicsoft/og-image.png',
    },
    // Official og:image and official icon.
    'outflo-ai': {
      logo: 'public/static/images/overrides/outflo-ai/logo.png',
      ogImage: 'public/static/images/overrides/outflo-ai/og-image.png',
    },
    // Official og:image and official icon.
    'bugsmash': {
      logo: 'public/static/images/overrides/bugsmash/logo.png',
      ogImage: 'public/static/images/overrides/bugsmash/og-image.png',
    },
    // Official og:image and official icon.
    'cloudways': {
      logo: 'public/static/images/overrides/cloudways/logo.png',
      ogImage: 'public/static/images/overrides/cloudways/og-image.png',
    },
    // Official og:image and official icon.
    'clearpane': {
      logo: 'public/static/images/overrides/clearpane/logo.png',
      ogImage: 'public/static/images/overrides/clearpane/og-image.png',
    },
    // Official og:image and official icon.
    'mole': {
      logo: 'public/static/images/overrides/mole/logo.png',
      ogImage: 'public/static/images/overrides/mole/og-image.png',
    },
    // Official og:image and official icon.
    'fynk': {
      logo: 'public/static/images/overrides/fynk/logo.png',
      ogImage: 'public/static/images/overrides/fynk/og-image.png',
    },
    // Official og:image and official icon.
    'innernote': {
      logo: 'public/static/images/overrides/innernote/logo.png',
      ogImage: 'public/static/images/overrides/innernote/og-image.png',
    },
    // Official og:image and official icon.
    'falconry-drive': {
      logo: 'public/static/images/overrides/falconry-drive/logo.png',
      ogImage: 'public/static/images/overrides/falconry-drive/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'stitchpdf': {
      logo: 'public/static/images/overrides/stitchpdf/logo.png',
      ogImage: 'public/static/images/overrides/stitchpdf/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'mirroring-for-chromecast-castx': {
      logo: 'public/static/images/overrides/mirroring-for-chromecast-castx/logo.png',
      ogImage: 'public/static/images/overrides/mirroring-for-chromecast-castx/og-image.png',
    },
    // Official og:image and official icon.
    'vernalo-plant-anywhere': {
      logo: 'public/static/images/overrides/vernalo-plant-anywhere/logo.png',
      ogImage: 'public/static/images/overrides/vernalo-plant-anywhere/og-image.png',
    },
    // The site publishes no og:image. The og-image is a screenshot of the official site. The logo is the official SVG icon rasterized to PNG.
    'onehostbox': {
      logo: 'public/static/images/overrides/onehostbox/logo.png',
      ogImage: 'public/static/images/overrides/onehostbox/og-image.png',
    },
    // Official og:image and official icon.
    'switchy': {
      logo: 'public/static/images/overrides/switchy/logo.png',
      ogImage: 'public/static/images/overrides/switchy/og-image.png',
    },
    // Official og:image and official icon.
    'pastenotch': {
      logo: 'public/static/images/overrides/pastenotch/logo.png',
      ogImage: 'public/static/images/overrides/pastenotch/og-image.png',
    },
    // Official og:image and official icon.
    'exit-loop': {
      logo: 'public/static/images/overrides/exit-loop/logo.png',
      ogImage: 'public/static/images/overrides/exit-loop/og-image.png',
    },
    // Official og:image and official icon.
    'mailsketch': {
      logo: 'public/static/images/overrides/mailsketch/logo.png',
      ogImage: 'public/static/images/overrides/mailsketch/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'xeos-external-display-desktop': {
      logo: 'public/static/images/overrides/xeos-external-display-desktop/logo.png',
      ogImage: 'public/static/images/overrides/xeos-external-display-desktop/og-image.png',
    },
    // Official og:image and official icon.
    'abctab': {
      logo: 'public/static/images/overrides/abctab/logo.png',
      ogImage: 'public/static/images/overrides/abctab/og-image.png',
    },
    // Official og:image and official icon.
    'tweetsmash': {
      logo: 'public/static/images/overrides/tweetsmash/logo.png',
      ogImage: 'public/static/images/overrides/tweetsmash/og-image.png',
    },
    // Official og:image and official icon.
    'linkedmash': {
      logo: 'public/static/images/overrides/linkedmash/logo.png',
      ogImage: 'public/static/images/overrides/linkedmash/og-image.png',
    },
    // Official og:image and official icon.
    'mash-fleet': {
      logo: 'public/static/images/overrides/mash-fleet/logo.png',
      ogImage: 'public/static/images/overrides/mash-fleet/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    'headsup': {
      logo: 'public/static/images/overrides/headsup/logo.png',
      ogImage: 'public/static/images/overrides/headsup/og-image.png',
    },
    // Official og:image and official icon.
    'twinsweep': {
      logo: 'public/static/images/overrides/twinsweep/logo.png',
      ogImage: 'public/static/images/overrides/twinsweep/og-image.png',
    },
    // Official og:image and official icon.
    'localvoice': {
      logo: 'public/static/images/overrides/localvoice/logo.png',
      ogImage: 'public/static/images/overrides/localvoice/og-image.png',
    },
    // Official og:image and official icon.
    'batchshift': {
      logo: 'public/static/images/overrides/batchshift/logo.png',
      ogImage: 'public/static/images/overrides/batchshift/og-image.png',
    },
    // Official og:image and official icon.
    'noteporter': {
      logo: 'public/static/images/overrides/noteporter/logo.png',
      ogImage: 'public/static/images/overrides/noteporter/og-image.png',
    },
    // Official og:image and official icon.
    'awakelet': {
      logo: 'public/static/images/overrides/awakelet/logo.png',
      ogImage: 'public/static/images/overrides/awakelet/og-image.png',
    },
    // Official og:image and official icon.
    'screen-studio': {
      logo: 'public/static/images/overrides/screen-studio/logo.png',
      ogImage: 'public/static/images/overrides/screen-studio/og-image.png',
    },
    // Official og:image and official icon.
    'logogogo': {
      logo: 'public/static/images/overrides/logogogo/logo.png',
      ogImage: 'public/static/images/overrides/logogogo/og-image.png',
    },
    // Official og:image and official icon.
    'killswitch': {
      logo: 'public/static/images/overrides/killswitch/logo.png',
      ogImage: 'public/static/images/overrides/killswitch/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'my-nurse-shift-planner': {
      logo: 'public/static/images/overrides/my-nurse-shift-planner/logo.png',
      ogImage: 'public/static/images/overrides/my-nurse-shift-planner/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'my-work-shift-planner': {
      logo: 'public/static/images/overrides/my-work-shift-planner/logo.png',
      ogImage: 'public/static/images/overrides/my-work-shift-planner/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'proscan-pdf': {
      logo: 'public/static/images/overrides/proscan-pdf/logo.png',
      ogImage: 'public/static/images/overrides/proscan-pdf/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'eye-color-cam-live-filters': {
      logo: 'public/static/images/overrides/eye-color-cam-live-filters/logo.png',
      ogImage: 'public/static/images/overrides/eye-color-cam-live-filters/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'doseplan-glp-1-peptide-tracker': {
      logo: 'public/static/images/overrides/doseplan-glp-1-peptide-tracker/logo.png',
      ogImage: 'public/static/images/overrides/doseplan-glp-1-peptide-tracker/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'water-fasting-beyond': {
      logo: 'public/static/images/overrides/water-fasting-beyond/logo.png',
      ogImage: 'public/static/images/overrides/water-fasting-beyond/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'you-become-daily-motivation': {
      logo: 'public/static/images/overrides/you-become-daily-motivation/logo.png',
      ogImage: 'public/static/images/overrides/you-become-daily-motivation/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'matchflare-live-football': {
      logo: 'public/static/images/overrides/matchflare-live-football/logo.png',
      ogImage: 'public/static/images/overrides/matchflare-live-football/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'viento-minimal-weather': {
      logo: 'public/static/images/overrides/viento-minimal-weather/logo.png',
      ogImage: 'public/static/images/overrides/viento-minimal-weather/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'dash-pal-gps-speedometer': {
      logo: 'public/static/images/overrides/dash-pal-gps-speedometer/logo.png',
      ogImage: 'public/static/images/overrides/dash-pal-gps-speedometer/og-image.png',
    },
    // The og-image is a screenshot of the official site because it has no usable og:image.
    'sky-os-ai': {
      logo: 'public/static/images/overrides/sky-os-ai/logo.png',
      ogImage: 'public/static/images/overrides/sky-os-ai/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'oriel-habit-tracker': {
      logo: 'public/static/images/overrides/oriel-habit-tracker/logo.png',
      ogImage: 'public/static/images/overrides/oriel-habit-tracker/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'finance-three-budget-tracker': {
      logo: 'public/static/images/overrides/finance-three-budget-tracker/logo.png',
      ogImage: 'public/static/images/overrides/finance-three-budget-tracker/og-image.png',
    },
    // Official og:image and official icon.
    'once-upon-your-mac': {
      logo: 'public/static/images/overrides/once-upon-your-mac/logo.png',
      ogImage: 'public/static/images/overrides/once-upon-your-mac/og-image.png',
    },
    // Official og:image and official icon.
    'channel-surfer': {
      logo: 'public/static/images/overrides/channel-surfer/logo.png',
      ogImage: 'public/static/images/overrides/channel-surfer/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    'holoform': {
      logo: 'public/static/images/overrides/holoform/logo.png',
      ogImage: 'public/static/images/overrides/holoform/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'ai-teleprompter-voice-sync': {
      logo: 'public/static/images/overrides/ai-teleprompter-voice-sync/logo.png',
      ogImage: 'public/static/images/overrides/ai-teleprompter-voice-sync/og-image.png',
    },
    // The og-image is a screenshot of the official site because it has no usable og:image.
    'plane-deals': {
      logo: 'public/static/images/overrides/plane-deals/logo.png',
      ogImage: 'public/static/images/overrides/plane-deals/og-image.png',
    },
    // Official og:image and official icon.
    'flowlister': {
      logo: 'public/static/images/overrides/flowlister/logo.png',
      ogImage: 'public/static/images/overrides/flowlister/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    'woopsocial': {
      logo: 'public/static/images/overrides/woopsocial/logo.png',
      ogImage: 'public/static/images/overrides/woopsocial/og-image.png',
    },
    // Official og:image and official icon.
    'pake': {
      logo: 'public/static/images/overrides/pake/logo.png',
      ogImage: 'public/static/images/overrides/pake/og-image.png',
    },
    // Official og:image and official icon.
    'yado': {
      logo: 'public/static/images/overrides/yado/logo.png',
      ogImage: 'public/static/images/overrides/yado/og-image.png',
    },
    // The og-image is a screenshot of the official site because it has no usable og:image.
    'alertondown': {
      logo: 'public/static/images/overrides/alertondown/logo.png',
      ogImage: 'public/static/images/overrides/alertondown/og-image.png',
    },
    // Official og:image. The logo is the official SVG icon rasterized to PNG.
    'repoflock': {
      logo: 'public/static/images/overrides/repoflock/logo.png',
      ogImage: 'public/static/images/overrides/repoflock/og-image.png',
    },
    // Official og:image and official icon.
    'krevaya': {
      logo: 'public/static/images/overrides/krevaya/logo.png',
      ogImage: 'public/static/images/overrides/krevaya/og-image.png',
    },
    // The og-image is a screenshot of the official site because it has no usable og:image.
    'progressio': {
      logo: 'public/static/images/overrides/progressio/logo.png',
      ogImage: 'public/static/images/overrides/progressio/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'tempo': {
      logo: 'public/static/images/overrides/tempo/logo.png',
      ogImage: 'public/static/images/overrides/tempo/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'clock-widget-': {
      logo: 'public/static/images/overrides/clock-widget-/logo.png',
      ogImage: 'public/static/images/overrides/clock-widget-/og-image.png',
    },
    // Official App Store icon and App Store share image.
    'app-screenshots': {
      logo: 'public/static/images/overrides/app-screenshots/logo.png',
      ogImage: 'public/static/images/overrides/app-screenshots/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'hazeover': {
      logo: 'public/static/images/overrides/hazeover/logo.png',
      ogImage: 'public/static/images/overrides/hazeover/og-image.png',
    },
    // Official og:image and official app icon.
    'voxipaw': {
      logo: 'public/static/images/overrides/voxipaw/logo.png',
      ogImage: 'public/static/images/overrides/voxipaw/og-image.png',
    },
    // Official og:image from clipwing.pro (the /pricing link's own banner is a plain "Pricing" card).
    'clipwing': {
      ogImage: 'public/static/images/overrides/clipwing/og-image.png',
    },
    // Official og:image and official icon.
    'ricly': {
      logo: 'public/static/images/overrides/ricly/logo.png',
      ogImage: 'public/static/images/overrides/ricly/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'nearleaf': {
      logo: 'public/static/images/overrides/nearleaf/logo.png',
      ogImage: 'public/static/images/overrides/nearleaf/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'cleanstorage-swipe-clean': {
      logo: 'public/static/images/overrides/cleanstorage-swipe-clean/logo.png',
      ogImage: 'public/static/images/overrides/cleanstorage-swipe-clean/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'babyanalytic-baby-tracker': {
      logo: 'public/static/images/overrides/babyanalytic-baby-tracker/logo.png',
      ogImage: 'public/static/images/overrides/babyanalytic-baby-tracker/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'math-daily-mental-math-games': {
      logo: 'public/static/images/overrides/math-daily-mental-math-games/logo.png',
      ogImage: 'public/static/images/overrides/math-daily-mental-math-games/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'squishu-squishy-dumpling-game': {
      logo: 'public/static/images/overrides/squishu-squishy-dumpling-game/logo.png',
      ogImage: 'public/static/images/overrides/squishu-squishy-dumpling-game/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'pawlitics-election-simulator': {
      logo: 'public/static/images/overrides/pawlitics-election-simulator/logo.png',
      ogImage: 'public/static/images/overrides/pawlitics-election-simulator/og-image.png',
    },
    // Official og:image and official icon.
    'loudwell': {
      logo: 'public/static/images/overrides/loudwell/logo.png',
      ogImage: 'public/static/images/overrides/loudwell/og-image.png',
    },
    // Official icon. The og-image is a screenshot of the official site (its og:image is only the square app icon).
    'foca-for-mac': {
      logo: 'public/static/images/overrides/foca-for-mac/logo.png',
      ogImage: 'public/static/images/overrides/foca-for-mac/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'foca': {
      logo: 'public/static/images/overrides/foca/logo.png',
      ogImage: 'public/static/images/overrides/foca/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'core-interval-hiit-timer': {
      logo: 'public/static/images/overrides/core-interval-hiit-timer/logo.png',
      ogImage: 'public/static/images/overrides/core-interval-hiit-timer/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'dayfold': {
      logo: 'public/static/images/overrides/dayfold/logo.png',
      ogImage: 'public/static/images/overrides/dayfold/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'screencommand': {
      logo: 'public/static/images/overrides/screencommand/logo.png',
      ogImage: 'public/static/images/overrides/screencommand/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'spaceclear': {
      logo: 'public/static/images/overrides/spaceclear/logo.png',
      ogImage: 'public/static/images/overrides/spaceclear/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'skywall': {
      logo: 'public/static/images/overrides/skywall/logo.png',
      ogImage: 'public/static/images/overrides/skywall/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'goaley-savings-goal-tracker': {
      logo: 'public/static/images/overrides/goaley-savings-goal-tracker/logo.png',
      ogImage: 'public/static/images/overrides/goaley-savings-goal-tracker/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'windfall-expense-tracker': {
      logo: 'public/static/images/overrides/windfall-expense-tracker/logo.png',
      ogImage: 'public/static/images/overrides/windfall-expense-tracker/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'pass-maker-wallet-pass': {
      logo: 'public/static/images/overrides/pass-maker-wallet-pass/logo.png',
      ogImage: 'public/static/images/overrides/pass-maker-wallet-pass/og-image.png',
    },
    // Official og:image. The logo is the official App Store icon.
    'domenu': {
      logo: 'public/static/images/overrides/domenu/logo.png',
      ogImage: 'public/static/images/overrides/domenu/og-image.png',
    },
    // Official og:image and official icon.
    'kopialens': {
      logo: 'public/static/images/overrides/kopialens/logo.png',
      ogImage: 'public/static/images/overrides/kopialens/og-image.png',
    },
    // Official og:image and official icon.
    'wireway': {
      logo: 'public/static/images/overrides/wireway/logo.png',
      ogImage: 'public/static/images/overrides/wireway/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'clip-keyboard-paste-snippets': {
      logo: 'public/static/images/overrides/clip-keyboard-paste-snippets/logo.png',
      ogImage: 'public/static/images/overrides/clip-keyboard-paste-snippets/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'rereminder-presentation-timer': {
      logo: 'public/static/images/overrides/rereminder-presentation-timer/logo.png',
      ogImage: 'public/static/images/overrides/rereminder-presentation-timer/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'goldweek-pto-and-vacation': {
      logo: 'public/static/images/overrides/goldweek-pto-and-vacation/logo.png',
      ogImage: 'public/static/images/overrides/goldweek-pto-and-vacation/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'sekki-photo-food-diary': {
      logo: 'public/static/images/overrides/sekki-photo-food-diary/logo.png',
      ogImage: 'public/static/images/overrides/sekki-photo-food-diary/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'dalbit-sleep-sounds-noise': {
      logo: 'public/static/images/overrides/dalbit-sleep-sounds-noise/logo.png',
      ogImage: 'public/static/images/overrides/dalbit-sleep-sounds-noise/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'staffsinger-sight-reading': {
      logo: 'public/static/images/overrides/staffsinger-sight-reading/logo.png',
      ogImage: 'public/static/images/overrides/staffsinger-sight-reading/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'not-my-tempo-voice-metronome': {
      logo: 'public/static/images/overrides/not-my-tempo-voice-metronome/logo.png',
      ogImage: 'public/static/images/overrides/not-my-tempo-voice-metronome/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'hantam-bead-cross-stitch': {
      logo: 'public/static/images/overrides/hantam-bead-cross-stitch/logo.png',
      ogImage: 'public/static/images/overrides/hantam-bead-cross-stitch/og-image.png',
    },
    // Official og:image and official icon.
    'clipcreator-ai': {
      logo: 'public/static/images/overrides/clipcreator-ai/logo.png',
      ogImage: 'public/static/images/overrides/clipcreator-ai/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'fridge-lock-screen-notes': {
      logo: 'public/static/images/overrides/fridge-lock-screen-notes/logo.png',
      ogImage: 'public/static/images/overrides/fridge-lock-screen-notes/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'silver-black-white-camera': {
      logo: 'public/static/images/overrides/silver-black-white-camera/logo.png',
      ogImage: 'public/static/images/overrides/silver-black-white-camera/og-image.png',
    },
    // Official og:image and official icon.
    'propixel': {
      logo: 'public/static/images/overrides/propixel/logo.png',
      ogImage: 'public/static/images/overrides/propixel/og-image.png',
    },
    // Official og:image and official icon.
    'one-personal-assistant': {
      logo: 'public/static/images/overrides/one-personal-assistant/logo.png',
      ogImage: 'public/static/images/overrides/one-personal-assistant/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'spiik-ai-voice-recorder-notes': {
      logo: 'public/static/images/overrides/spiik-ai-voice-recorder-notes/logo.png',
      ogImage: 'public/static/images/overrides/spiik-ai-voice-recorder-notes/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'vidcap-ai-captions-for-videos': {
      logo: 'public/static/images/overrides/vidcap-ai-captions-for-videos/logo.png',
      ogImage: 'public/static/images/overrides/vidcap-ai-captions-for-videos/og-image.png',
    },
    // The logo and og-image are the official App Store icon and App Store share image.
    'teleprompter-ai': {
      logo: 'public/static/images/overrides/teleprompter-ai/logo.png',
      ogImage: 'public/static/images/overrides/teleprompter-ai/og-image.png',
    },
    // Official og:image and official icon.
    'pixafind': {
      logo: 'public/static/images/overrides/pixafind/logo.png',
      ogImage: 'public/static/images/overrides/pixafind/og-image.png',
    },
    // Official og:image and official icon.
    'apxy': {
      logo: 'public/static/images/overrides/apxy/logo.png',
      ogImage: 'public/static/images/overrides/apxy/og-image.png',
    },
    // Official og:image and official icon.
    'bordfeed': {
      logo: 'public/static/images/overrides/bordfeed/logo.png',
      ogImage: 'public/static/images/overrides/bordfeed/og-image.png',
    },
    // Official og:image and official icon.
    'osintverse': {
      logo: 'public/static/images/overrides/osintverse/logo.png',
      ogImage: 'public/static/images/overrides/osintverse/og-image.png',
    },
    // Official og:image. The logo is the maker's official Gumroad avatar (jumpertheme).
    'scopeforge-studio': {
      logo: 'public/static/images/overrides/scopeforge-studio/logo.png',
      ogImage: 'public/static/images/overrides/scopeforge-studio/og-image.png',
    },
    // Official og:image. The logo is the maker's official Gumroad avatar (jumpertheme).
    'quietcraft-ui-pro': {
      logo: 'public/static/images/overrides/quietcraft-ui-pro/logo.png',
      ogImage: 'public/static/images/overrides/quietcraft-ui-pro/og-image.png',
    },
    // Official og:image. The logo is the maker's official Gumroad avatar (jumpertheme).
    'sololedger-pro': {
      logo: 'public/static/images/overrides/sololedger-pro/logo.png',
      ogImage: 'public/static/images/overrides/sololedger-pro/og-image.png',
    },
    // Official og:image and official icon.
    '1-pixel-workout': {
      logo: 'public/static/images/overrides/1-pixel-workout/logo.png',
      ogImage: 'public/static/images/overrides/1-pixel-workout/og-image.png',
    },
    // Official og:image and official icon.
    'ultrascale': {
      logo: 'public/static/images/overrides/ultrascale/logo.png',
      ogImage: 'public/static/images/overrides/ultrascale/og-image.png',
    },
    // Official og:image and official icon.
    'smbact': {
      logo: 'public/static/images/overrides/smbact/logo.png',
      ogImage: 'public/static/images/overrides/smbact/og-image.png',
    },
    // Official itch.io cover image. The logo is cropped from the mountain mark on that cover (the page has no separate icon).
    'highground-kit': {
      logo: 'public/static/images/overrides/highground-kit/logo.png',
      ogImage: 'public/static/images/overrides/highground-kit/og-image.png',
    },
    // Official og:image and official icon.
    'voxwrite': {
      logo: 'public/static/images/overrides/voxwrite/logo.png',
      ogImage: 'public/static/images/overrides/voxwrite/og-image.png',
    },
  },
};
