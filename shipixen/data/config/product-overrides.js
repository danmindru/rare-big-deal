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
  },
};
