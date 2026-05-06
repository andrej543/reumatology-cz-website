(function () {
  const btn = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav-panel]");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (e.target === btn || btn.contains(e.target)) return;
    if (nav.contains(e.target)) return;
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });
})();
