(function () {
  const STORAGE_KEY = "oj-lang";

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "cs";
    } catch (_) {
      return "cs";
    }
  }

  function setLang(lang) {
    const L = lang === "en" ? "en" : "cs";
    document.documentElement.lang = L === "en" ? "en" : "cs";
    document.documentElement.setAttribute("data-lang", L);
    try {
      localStorage.setItem(STORAGE_KEY, L);
    } catch (_) {}
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      const active = btn.getAttribute("data-lang-switch") === L;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });
    window.dispatchEvent(new CustomEvent("oj-lang-change", { detail: { lang: L } }));
  }

  function applyMetaFromTags() {
    const titleCs = document.querySelector('meta[name="i18n-title-cs"]');
    const titleEn = document.querySelector('meta[name="i18n-title-en"]');
    const descCs = document.querySelector('meta[name="i18n-description-cs"]');
    const descEn = document.querySelector('meta[name="i18n-description-en"]');

    const sync = () => {
      const en = document.documentElement.getAttribute("data-lang") === "en";
      if (titleCs && titleEn) {
        document.title = en ? titleEn.getAttribute("content") : titleCs.getAttribute("content");
      }
      const desc = document.querySelector('meta[name="description"]');
      if (desc && descCs && descEn) {
        desc.setAttribute("content", en ? descEn.getAttribute("content") : descCs.getAttribute("content"));
      }
    };

    sync();
    window.addEventListener("oj-lang-change", sync);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setLang(getLang());
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-switch")));
    });
    applyMetaFromTags();
  });

  window.OJLang = { getLang, setLang };
})();
