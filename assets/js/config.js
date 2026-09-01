// Orynza — single source of truth for checkout + form config.
// Edit this file once you have real Paddle and Formspree credentials.
window.ORYNZA_CONFIG = {
  // true = Buy buttons open real Paddle checkout (sandbox or production, per PADDLE_ENV below).
  PADDLE_ENABLED: true,

  // "sandbox" while testing — switch to "production" only once the live account is approved
  // and PRICES/PADDLE_CLIENT_TOKEN below are replaced with real live values.
  PADDLE_ENV: "sandbox",

  // Paddle Dashboard (sandbox) > Developer Tools > Authentication > Client-side token.
  PADDLE_CLIENT_TOKEN: "test_4d228a417f40461f7b568bf9be1",

  // Where a Buy button sends people if a price id is ever missing.
  FALLBACK_URL: "/contact?intent=quote",

  // Sandbox Price IDs (created via Paddle API). Swap these for live "pri_..." ids
  // from the Paddle live dashboard once the merchant account is approved.
  PRICES: {
    webBasic80: "pri_01m1cb20qvtsr31x6pexbr731t",
    webStandard200: "pri_01m1cb2efn92a6favm0knxqzbq",
    webPremium500: "pri_01m1cb2fvqq4c1wtqvdpannn7w",

    graphicsBasic10: "pri_01m1cb2h789qx3j0jcc7e52maj",
    graphicsStandard50: "pri_01m1cb2jg5gnxwhdfk6sghghd7",
    graphicsPremium80: "pri_01m1cb2m58c1nn7k9jaz9y24dg",

    cvDesign30: "pri_01m1cb2nk7cnz4gfmmy4mhw5fp",

    courseInstagram29: "pri_01m1cb2q8z2ggd707659n6cxdq"
  },

  // Formspree form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  CONTACT_FORM_ENDPOINT: "https://formspree.io/f/REPLACE_ME"
};
