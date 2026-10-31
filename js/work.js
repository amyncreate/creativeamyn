/* work.js: category tabs (graphic / web / UI-UX) and the project details dialog */
(function () {
  "use strict";

  /* ================= Tabs ================= */
  var tablist = document.getElementById("workTabs");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var ink = tablist && tablist.querySelector(".tab-ink");
  var panels = {};
  tabs.forEach(function (t) { panels[t.getAttribute("data-tab")] = document.getElementById(t.getAttribute("aria-controls")); });
  var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];

  function moveInk(animate) {
    if (!ink || !current) return;
    if (!animate) ink.style.transition = "none";
    ink.style.width = current.offsetWidth + "px";
    ink.style.transform = "translateX(" + current.offsetLeft + "px)";
    if (!animate) { ink.offsetWidth; ink.style.transition = ""; }
  }

  function reveal(panel, animate) {
    var cards = panel.querySelectorAll(".work");
    cards.forEach(function (c, i) { c.style.setProperty("--i", i); });
    panel.classList.add("shown");
    if (animate && !AP.reduceMotion) {
      panel.classList.remove("entering");
      void panel.offsetWidth;           // restart the animation
      panel.classList.add("entering");
      setTimeout(function () { panel.classList.remove("entering"); }, 1200);
    }
  }

  function select(tab, focus) {
    if (tab === current && !focus) return;
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var p = panels[t.getAttribute("data-tab")];
      if (p) p.hidden = !on;
    });
    current = tab;
    moveInk(true);
    reveal(panels[tab.getAttribute("data-tab")], true);
    if (focus) tab.focus();
  }

  if (tablist) {
    Object.keys(panels).forEach(function (k) { panels[k].hidden = panels[k] !== panels[current.getAttribute("data-tab")]; });
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    moveInk(false);
    window.addEventListener("resize", function () { moveInk(false); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(false); });

    // First panel animates in when the work section scrolls into view
    var firstPanel = panels[current.getAttribute("data-tab")];
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { reveal(firstPanel, true); io.disconnect(); }
      }, { threshold: 0.15 });
      io.observe(tablist);
    } else {
      Object.keys(panels).forEach(function (k) { reveal(panels[k], false); });
    }
  }

  /* ================= Project dialog (with optional video) ================= */
  var dlg = document.getElementById("case");
  if (!dlg || !window.PROJECTS) return;
  var el = {
    media: document.getElementById("caseMedia"),
    img: document.getElementById("caseImg"),
    meta: document.getElementById("caseMeta"),
    title: document.getElementById("caseTitle"),
    summary: document.getElementById("caseSummary"),
    did: document.getElementById("caseDid"),
    stack: document.getElementById("caseStack"),
    cta: document.getElementById("caseCta"),
    close: document.getElementById("caseClose")
  };
  var lastTrigger = null;
  var player = null;            // the <video> or <iframe> currently shown in the popup

  var MIME = { mp4: "video/mp4", m4v: "video/mp4", webm: "video/webm", ogv: "video/ogg", mov: "video/quicktime" };
  function asList(v) { return !v ? [] : Array.isArray(v) ? v : [v]; }
  function mimeOf(url) { var m = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(url); return m ? (MIME[m[1].toLowerCase()] || "") : ""; }
  function hasMedia(p) { return asList(p.video).length > 0 || !!p.embed; }
  function addSources(node, list) {
    list.forEach(function (u) {
      var s = document.createElement("source");
      s.src = u;
      var t = mimeOf(u); if (t) s.type = t;
      node.appendChild(s);
    });
  }

  /* Cards that have a video get a "Watch" tag; an optional short silent preview plays on hover (mouse devices only) */
  document.querySelectorAll("[data-project]").forEach(function (btn) {
    var p = window.PROJECTS[btn.getAttribute("data-project")];
    if (!p || !hasMedia(p)) return;
    btn.classList.add("has-video");
    var tag = document.createElement("span");
    tag.className = "work-play";
    tag.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i><span>Watch</span>';
    btn.appendChild(tag);

    var preview = asList(p.preview);
    if (preview.length && !AP.reduceMotion && window.matchMedia("(hover: hover)").matches) {
      var pv = document.createElement("video");
      pv.className = "work-preview";
      pv.muted = true; pv.loop = true; pv.playsInline = true; pv.preload = "none"; pv.tabIndex = -1;
      pv.setAttribute("aria-hidden", "true");
      btn.querySelector("img").insertAdjacentElement("afterend", pv);
      var loaded = false;
      btn.addEventListener("mouseenter", function () {
        if (!loaded) { addSources(pv, preview); pv.load(); loaded = true; }   // download only when first hovered
        var r = pv.play(); if (r && r.catch) r.catch(function () {});
        pv.classList.add("on");
      });
      btn.addEventListener("mouseleave", function () { pv.pause(); pv.classList.remove("on"); });
    }
  });

  function clearPlayer() {
    if (!player) { el.img.hidden = false; return; }
    if (player.tagName === "VIDEO") {
      player.pause();
      player.removeAttribute("src");
      while (player.firstChild) player.removeChild(player.firstChild);
      player.load();                                                   // stop any download still in progress
    }
    if (player.parentNode) player.parentNode.removeChild(player);     // removing an embed also stops its sound
    player = null;
    el.img.hidden = false;
  }

  function mountPlayer(p) {
    var list = asList(p.video), node = null;

    if (list.length) {
      node = document.createElement("video");
      node.controls = true; node.playsInline = true; node.preload = "metadata";
      node.setAttribute("controlslist", "nodownload");
      node.poster = p.poster || p.image;
      node.setAttribute("aria-label", p.title + " video walkthrough");
      addSources(node, list);
      var last = node.lastChild;                                       // errors are reported by the <source> elements
      if (last) last.addEventListener("error", function () {
        console.error('[video] Could not load "' + list.join(", ") + '" for "' + p.title + '". Check the file name and that it is inside the assets/video folder. Showing the cover image instead.');
        clearPlayer();
      });
    } else if (p.embed) {
      if (!/^https:\/\//i.test(p.embed)) { console.warn('[video] "embed" must be a full https:// link for "' + p.title + '".'); return; }
      node = document.createElement("iframe");
      node.src = p.embed;
      node.title = p.title + " video walkthrough";
      node.allow = "autoplay; fullscreen; picture-in-picture";
      node.setAttribute("allowfullscreen", "");
      node.referrerPolicy = "strict-origin-when-cross-origin";
    }
    if (!node) return;

    node.style.setProperty("--ratio", p.ratio || "16 / 9");
    el.media.appendChild(node);
    el.img.hidden = true;
    player = node;
    if (node.tagName === "VIDEO" && !AP.reduceMotion) {                // the click that opened the popup allows sound
      var r = node.play(); if (r && r.catch) r.catch(function () {});
    }
  }

  function openProject(btn) {
    var p = window.PROJECTS[btn.getAttribute("data-project")];
    if (!p) return;
    lastTrigger = btn;
    clearPlayer();
    el.img.src = p.image;
    el.img.alt = "Cover for the " + p.title + " project";
    el.meta.textContent = p.meta;
    el.title.textContent = p.title;
    el.summary.textContent = p.summary;
    el.did.innerHTML = "";
    p.did.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      el.did.appendChild(li);
    });
    el.stack.textContent = "Built with: " + p.stack;
    el.cta.setAttribute("data-wa-msg", "Hi Amyn, I saw your " + p.title + " project and I'd like something similar for my business.");
    AP.wire(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.scrollTop = 0;
    mountPlayer(p);
  }

  function closeProject() {
    if (!dlg.open) return;
    if (player && player.pause) player.pause();
    if (AP.reduceMotion) { dlg.close(); return; }
    dlg.classList.add("closing");
    setTimeout(function () { dlg.classList.remove("closing"); dlg.close(); }, 220);
  }

  document.querySelectorAll("[data-project]").forEach(function (btn) {
    btn.addEventListener("click", function () { openProject(btn); });
  });
  el.close.addEventListener("click", closeProject);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeProject(); });
  dlg.addEventListener("close", function () { clearPlayer(); if (lastTrigger) lastTrigger.focus(); });   // also runs on Esc
  el.cta.addEventListener("click", function () { if (!AP.hasWhatsApp) closeProject(); });
})();