// Orynza — single source of truth for checkout + form config.
// Edit this file once you have real Paddle and Formspree credentials.
window.ORYNZA_CONFIG = {
  // Flip to true only after Paddle has approved the merchant account.
  PADDLE_ENABLED: false,

  // "sandbox" while testing each price in Paddle's sandbox, "production" at launch.
  PADDLE_ENV: "sandbox",

  // Paddle Dashboard > Developer Tools > Authentication > Client-side token.
  PADDLE_CLIENT_TOKEN: "REPLACE_WITH_PADDLE_CLIENT_TOKEN",

  // Where a Buy button sends people while Paddle isn't live yet, or a price id is missing.
  FALLBACK_URL: "contact.html?intent=quote",

  // One Paddle Price ID per package/course. Create these in the Paddle dashboard
  // after approval, then paste the real "pri_..." ids in below.
  PRICES: {
    webBasic80: "pri_REPLACE_ME",
    webStandard200: "pri_REPLACE_ME",
    webPremium500: "pri_REPLACE_ME",

    graphicsBasic10: "pri_REPLACE_ME",
    graphicsStandard50: "pri_REPLACE_ME",
    graphicsPremium80: "pri_REPLACE_ME",

    cvDesign30: "pri_REPLACE_ME",

    courseInstagram29: "pri_REPLACE_ME"
  },

  // Formspree form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  CONTACT_FORM_ENDPOINT: "https://formspree.io/f/REPLACE_ME"
};
