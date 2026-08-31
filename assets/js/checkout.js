// Orynza — Paddle Billing v2 checkout wrapper.
// Real integration, gated behind ORYNZA_CONFIG.PADDLE_ENABLED until Paddle approves
// the merchant account and real price ids replace the "pri_REPLACE_ME" placeholders.
(function () {
  function loadPaddleScript(cb) {
    if (window.Paddle) return cb();
    var s = document.createElement("script");
    s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  function initPaddle() {
    if (window.__paddleInitialized) return;
    if (ORYNZA_CONFIG.PADDLE_ENV === "sandbox") {
      Paddle.Environment.set("sandbox");
    }
    Paddle.Initialize({ token: ORYNZA_CONFIG.PADDLE_CLIENT_TOKEN });
    window.__paddleInitialized = true;
  }

  function openCheckout(priceKey) {
    var priceId = ORYNZA_CONFIG.PRICES[priceKey];
    var token = ORYNZA_CONFIG.PADDLE_CLIENT_TOKEN;
    var notReady =
      !ORYNZA_CONFIG.PADDLE_ENABLED ||
      !priceId ||
      priceId.indexOf("REPLACE") !== -1 ||
      !token ||
      token.indexOf("REPLACE") !== -1;

    if (notReady) {
      window.location.href =
        ORYNZA_CONFIG.FALLBACK_URL + "&service=" + encodeURIComponent(priceKey);
      return;
    }

    loadPaddleScript(function () {
      initPaddle();
      Paddle.Checkout.open({ items: [{ priceId: priceId, quantity: 1 }] });
    });
  }

  window.orynzaCheckout = openCheckout;
})();
