/* =========================================================
   ECON KITCHEN — ENGLISH / HINDI TRANSLATOR
   Uses Google Website Translator for whole-page translation.
========================================================= */
(function () {
  "use strict";

  function setCookie(name, value) {
    var host = location.hostname;
    document.cookie = name + "=" + value + ";path=/;SameSite=Lax";
    if (host && host.indexOf(".") !== -1 && host !== "localhost") {
      document.cookie = name + "=" + value + ";path=/;domain=." + host.replace(/^www\./, "") + ";SameSite=Lax";
    }
  }

  function currentLanguage() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    return m && decodeURIComponent(m[1]).endsWith("/hi") ? "hi" : "en";
  }

  function renderSwitcher() {
    if (document.querySelector(".econ-language-switcher")) return;
    var wrap = document.createElement("div");
    wrap.className = "econ-language-switcher notranslate";
    wrap.setAttribute("translate", "no");
    wrap.setAttribute("aria-label", "Website language");
    wrap.innerHTML = '<button type="button" class="econ-lang-btn" data-lang="en" aria-label="View website in English">EN</button>' +
      '<button type="button" class="econ-lang-btn" data-lang="hi" aria-label="वेबसाइट हिंदी में देखें">हिंदी</button>' +
      '<div id="econGoogleTranslate"></div>';
    document.body.appendChild(wrap);
    updateActive();

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lang]");
      if (!btn) return;
      switchLanguage(btn.getAttribute("data-lang"));
    });
  }

  function updateActive() {
    var lang = currentLanguage();
    document.querySelectorAll(".econ-lang-btn").forEach(function (b) {
      var active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.documentElement.lang = lang;
  }

  function switchLanguage(lang) {
    if (lang !== "hi" && lang !== "en") return;
    if (lang === "en") {
      setCookie("googtrans", "/en/en");
    } else {
      setCookie("googtrans", "/en/hi");
    }

    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      setTimeout(function () { location.reload(); }, 250);
    } else {
      location.reload();
    }
  }

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate) return;
    new google.translate.TranslateElement({
      pageLanguage: "en",
      includedLanguages: "en,hi",
      autoDisplay: false,
      multilanguagePage: true
    }, "econGoogleTranslate");
    updateActive();
  };

  function loadGoogleTranslator() {
    if (document.querySelector('script[data-econ-translator="1"]')) return;
    var s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-econ-translator", "1");
    document.head.appendChild(s);
  }

  function init() {
    renderSwitcher();
    loadGoogleTranslator();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
