// Orynza — single source of truth for checkout + form config.
// Edit this file once you have real Paddle and Formspree credentials.
window.ORYNZA_CONFIG = {
  // true = Buy buttons open real Paddle checkout (sandbox or production, per PADDLE_ENV below).
  PADDLE_ENABLED: true,

  // LIVE-MIGRATION BRANCH: pointed at production. Do not merge to master
  // until Part 3 (verification + domain approval) has actually passed —
  // live checkout will fail to load on an unapproved domain regardless.
  PADDLE_ENV: "production",

  // Paddle Dashboard (LIVE) > Developer Tools > Authentication > Client-side token.
  PADDLE_CLIENT_TOKEN: "live_07dbb63a7a3c278404dc1a37fc3",

  // Where a Buy button sends people if a price id is ever missing.
  FALLBACK_URL: "/contact?intent=quote",

  // LIVE Price IDs (created via Paddle API against api.paddle.com).
  PRICES: {
    webBasic80: "pri_01m1cjby1tscf8w9kfdqh6egte",
    webStandard200: "pri_01m1cjc1wt9pxh85cferpz48vm",
    webPremium500: "pri_01m1cjc9x6e4mnc0ze0ntj98a1",

    graphicsBasic10: "pri_01m1cjcc115771h3wgw2pdh3z9",
    graphicsStandard50: "pri_01m1cjcksdq0y3et9c7fk9ynek",
    graphicsPremium80: "pri_01m1cjcpnqka2mxbtebvyej7ar",

    cvDesign30: "pri_01m1cjcsdc0rc9e5zgbdge1e61",

    courseInstagram29: "pri_01m1cjd0f3vf0brw0hzv2nnct1"
  },

  // Formspree form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  CONTACT_FORM_ENDPOINT: "https://formspree.io/f/REPLACE_ME"
};
