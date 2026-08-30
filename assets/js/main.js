// Orynza — shared page behavior: mobile nav, footer year, contact form.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Mobile nav toggle
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
      });
    }

    // Footer year
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Prefill + note on contact page when arriving from a Buy button fallback
    var params = new URLSearchParams(window.location.search);
    var service = params.get("service");
    var intent = params.get("intent");
    var select = document.getElementById("service-select");
    var note = document.getElementById("form-note");

    var serviceMap = {
      webBasic80: "web",
      webStandard200: "web",
      webPremium500: "web",
      graphicsBasic10: "graphics",
      graphicsStandard50: "graphics",
      graphicsPremium80: "graphics",
      cvDesign30: "cv",
      courseInstagram29: "course"
    };

    if (select && service && serviceMap[service]) {
      select.value = serviceMap[service];
    }
    if (note && intent === "quote") {
      note.classList.add("visible");
    }

    // Contact form: progressive-enhancement AJAX submit
    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var success = document.getElementById("form-success");
        var submitBtn = form.querySelector("button[type=submit]");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending...";
        }

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              if (success) success.classList.add("visible");
            } else {
              form.submit();
            }
          })
          .catch(function () {
            form.submit();
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Send Message";
            }
          });
      });
    }
  });
})();
