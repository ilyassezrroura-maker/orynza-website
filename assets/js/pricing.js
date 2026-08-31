// Orynza — Paddle localized price preview.
// Replaces the static USD price text on [data-price-key] elements with
// Paddle's own formatted, currency-converted totals for the visitor.
// Falls back silently to the static USD price already in the HTML if
// Paddle isn't configured yet, or the preview request fails — never does
// its own currency math or reformats Paddle's strings.
(function () {
  function loadPaddleScript(cb) {
    if (window.Paddle) return cb();
    var s = document.createElement("script");
    s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.onload = cb;
    s.onerror = function () {};
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

  function run() {
    var els = document.querySelectorAll("[data-price-key]");
    if (!els.length) return;

    var token = ORYNZA_CONFIG.PADDLE_CLIENT_TOKEN;
    var tokenReady = token && token.indexOf("REPLACE") === -1;
    if (!ORYNZA_CONFIG.PADDLE_ENABLED || !tokenReady) return;

    var items = [];
    els.forEach(function (el) {
      var priceId = ORYNZA_CONFIG.PRICES[el.getAttribute("data-price-key")];
      if (priceId && priceId.indexOf("REPLACE") === -1) {
        items.push({ priceId: priceId, quantity: 1 });
      }
    });
    if (!items.length) return;

    loadPaddleScript(function () {
      initPaddle();
      // No country passed — Paddle.PricePreview() auto-detects location from the visitor's IP.
      Paddle.PricePreview({ items: items })
        .then(function (result) {
          var lineItems = result.data.details.lineItems;
          els.forEach(function (el) {
            var priceId = ORYNZA_CONFIG.PRICES[el.getAttribute("data-price-key")];
            var line = null;
            for (var i = 0; i < lineItems.length; i++) {
              if (lineItems[i].price.id === priceId) {
                line = lineItems[i];
                break;
              }
            }
            if (line && line.formattedTotals && line.formattedTotals.total) {
              el.textContent = line.formattedTotals.total;
            }
          });
        })
        .catch(function () {
          // Leave the static USD prices already in the HTML.
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
