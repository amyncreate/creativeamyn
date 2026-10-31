/* core.js: shared helpers on window.AP (WhatsApp links, motion preference, email opener) */
(function () {
  "use strict";
  var body = document.body;
  var raw = body.getAttribute("data-whatsapp") || "";
  var digits = raw.replace(/\D/g, "");
  var has = digits.length >= 10 && digits.length <= 15 && !/x/i.test(raw);

  var AP = window.AP = {
    email: body.getAttribute("data-email") || "creativeamyn@gmail.com",
    hasWhatsApp: has,
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

    waUrl: function (msg) {
      return "https://wa.me/" + digits + "?text=" + encodeURIComponent(msg || "Hi Amyn, I'd like to talk about a project.");
    },

    /* Point every [data-wa] link at WhatsApp. If no real number is set, links keep their safe fallback. */
    wire: function (root) {
      if (!has) return;
      (root || document).querySelectorAll("[data-wa]").forEach(function (a) {
        a.setAttribute("href", AP.waUrl(a.getAttribute("data-wa-msg")));
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      });
    },

    openMail: function (url) { window.location.href = url; },
    openWa: function (url) { window.open(url, "_blank", "noopener"); }
  };

  AP.wire();

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
