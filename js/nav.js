/* nav.js: mobile menu, header state, scroll progress, scroll-spy, sticky CTA, back-to-top */
(function () {
  "use strict";

  /* ----- Mobile menu ----- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !e.target.closest("#nav") && !e.target.closest("#menuBtn")) setMenu(false);
    });
    window.matchMedia("(min-width: 981px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ----- Scroll-linked UI (one throttled listener) ----- */
  var header = document.querySelector(".site-header");
  var progress = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  var ticking = false;
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });

  function onScroll() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (toTop) toTop.classList.toggle("show", y > 900);
    // Nothing is "current" while the hero is on screen
    if (y < 300) Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: AP.reduceMotion ? "auto" : "smooth" }); });

  if (!("IntersectionObserver" in window)) return;

  /* ----- Scroll-spy: highlight the current section in the menu ----- */
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && links[en.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });

  /* ----- Sticky mobile CTA: show after the hero buttons, hide at the contact section ----- */
  var sticky = document.getElementById("stickyCta");
  var heroCta = document.querySelector(".hero .cta-row");
  var contact = document.getElementById("contact");
  if (sticky && heroCta && contact) {
    var heroGone = false, contactSeen = false;
    var link = sticky.querySelector("a");
    var update = function () {
      var show = heroGone && !contactSeen;
      sticky.classList.toggle("show", show);
      sticky.setAttribute("aria-hidden", String(!show));
      if (link) link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (en) {
      heroGone = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      update();
    }).observe(heroCta);
    new IntersectionObserver(function (en) { contactSeen = en[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(contact);
  }
})();
