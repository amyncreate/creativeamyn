/* motion.js: scroll reveals, the process timeline, and smooth FAQ open/close */
(function () {
  "use strict";
  var reduce = AP.reduceMotion;

  /* ----- Scroll reveals ----- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute("data-reveal", "");
      child.style.setProperty("--i", i);
    });
  });

  var items = document.querySelectorAll("[data-reveal], #steps");
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (n) { n.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        // Reveal when entering view, or immediately if it is already above the viewport (anchor jumps)
        if (en.isIntersecting || en.boundingClientRect.top < 0) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ----- FAQ: animated open/close ----- */
  document.querySelectorAll(".faq details").forEach(function (d) {
    var summary = d.querySelector("summary");
    var anim = null;

    function run(from, to, done) {
      if (anim) anim.cancel();
      d.style.height = from + "px";
      anim = d.animate({ height: [from + "px", to + "px"] }, { duration: 380, easing: "cubic-bezier(.2,.7,.2,1)" });
      anim.onfinish = function () { anim = null; d.style.height = ""; if (done) done(); };
      anim.oncancel = function () { d.style.height = ""; };
    }

    summary.addEventListener("click", function (e) {
      if (reduce || !d.animate) return;       // fall back to the native toggle
      e.preventDefault();
      var start = d.offsetHeight;
      if (d.open) {
        d.open = false; var closed = d.offsetHeight; d.open = true;
        run(start, closed, function () { d.open = false; });
      } else {
        d.open = true; var full = d.offsetHeight;
        run(start, full);
      }
    });
  });
})();
