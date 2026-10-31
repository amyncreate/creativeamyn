/* lens.js: hero visual. A pixelated picture with a sharp "focus lens" that follows the pointer.
   The picture is the file named in data-hero-image on the <body> tag in index.html.
   If no image is set, or it fails to load, the built-in "A" brand mark is drawn instead. */
(function () {
  "use strict";
  var canvas = document.getElementById("lens");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var frame = canvas.parentElement;
  var hint = document.getElementById("lensHint");
  var reduce = AP.reduceMotion;

  // Settings live on the <body> tag in index.html (data-hero-image, data-hero-alt).
  // The canvas itself may also carry data-image / data-alt (older setup); those win if filled in.
  var bodyEl = document.body;
  var imageSrc = (canvas.getAttribute("data-image") || bodyEl.getAttribute("data-hero-image") || "").trim();
  var imageAlt = (canvas.getAttribute("data-alt") || bodyEl.getAttribute("data-hero-alt") || "").trim();
  var photo = null;              // loaded <img>, or null to use the "A" mark
  var debug = /[?&]debug\b/.test(window.location.search);

  /* Forgiving paths: fixes backslashes, stray quotes/spaces, a leading "./", a bare file name
     (tries the assets folder) and upper/lower case (some hosts, like Netlify, are case-sensitive). */
  function candidates(raw) {
    var v = String(raw || "").replace(/\\/g, "/").replace(/^["'\s]+|["'\s]+$/g, "").replace(/^\.\//, "");
    if (!v) return [];
    var list = [v];
    if (!/^(https?:)?\/\//.test(v) && v.indexOf("/") === -1) list.push("assets/" + v);
    var lower = v.toLowerCase();
    if (lower !== v) list.push(lower);
    return list;
  }

  function report(state, detail) {
    canvas.setAttribute("data-lens", state);
    if (state === "image-failed") {
      console.error("[lens] Could not load your hero image. Tried: " + detail.join(", ") +
        ". Check the file name, the extension (Windows can hide a second .webp) and that the file is inside the site folder you uploaded.");
    }
    if (debug) {
      var badge = document.createElement("div");
      badge.style.cssText = "position:absolute;left:10px;right:10px;bottom:10px;padding:8px 12px;border-radius:10px;background:#121633;color:#fff;font:600 13px/1.4 system-ui,sans-serif;z-index:5";
      badge.textContent = state === "image" ? "Hero image loaded: " + detail
        : state === "image-failed" ? "Hero image NOT found. Tried: " + detail.join(", ")
        : "No hero image set (data-hero-image is empty). Showing the A mark.";
      frame.style.position = "relative";
      frame.appendChild(badge);
    }
  }

  if (imageAlt) {                // a real picture should be announced to screen readers
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", imageAlt);
    canvas.removeAttribute("aria-hidden");
  }

  var CELL = 16;                 // mosaic cell size in CSS px
  var INTRO_DELAY = 0.6;         // seconds, lets the page-load sequence settle first
  var size = 0, dpr = 1;
  var sharp = document.createElement("canvas");
  var mosaic = document.createElement("canvas");
  var sctx = sharp.getContext("2d");
  var mctx = mosaic.getContext("2d");
  var lens = { x: 0, y: 0, r: 0 };
  var target = { x: 0, y: 0 };
  var pointerActive = false, lastPointer = 0;
  var rafId = 0, visible = true, t0 = 0, intro = true;

  function drawSharp() {
    var s = sharp.width;
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.fillStyle = "#121633";
    sctx.fillRect(0, 0, s, s);

    if (photo) {
      // "cover" fit: fill the square, crop the overflow, keep the picture centered
      var iw = photo.naturalWidth, ih = photo.naturalHeight;
      var k = Math.max(s / iw, s / ih);
      var w = iw * k, h = ih * k;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(photo, (s - w) / 2, (s - h) / 2, w, h);
      return;
    }

    // sctx.fillStyle = "#FFC21A";
    // sctx.beginPath();
    // sctx.arc(s * 0.79, s * 0.21, s * 0.075, 0, Math.PI * 2);
    // sctx.fill();
    // sctx.fillStyle = "#FFFFFF";
    // sctx.textAlign = "center";
    // sctx.textBaseline = "alphabetic";
    // sctx.font = "800 " + Math.round(s * 0.74) + 'px Bricolage, "Segoe UI", sans-serif';
    // sctx.fillText("A", s * 0.5, s * 0.78);
  }

  /* Pixelate by shrinking the sharp picture to a tiny grid, then blowing it back up with no smoothing.
     (Works for photos too, and needs no pixel reading, so it also works when opened straight from a folder.) */
  function buildMosaic() {
    var s = sharp.width;
    var cell = Math.max(2, Math.round(CELL * dpr));
    var n = Math.max(1, Math.round(s / cell));
    var tiny = document.createElement("canvas");
    tiny.width = tiny.height = n;
    var tctx = tiny.getContext("2d");
    tctx.imageSmoothingQuality = "high";
    tctx.drawImage(sharp, 0, 0, n, n);
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.imageSmoothingEnabled = false;
    mctx.drawImage(tiny, 0, 0, n, n, 0, 0, s, s);
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(mosaic, 0, 0);
    if (lens.r > 0.5) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(lens.x * dpr, lens.y * dpr, lens.r * dpr, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(sharp, 0, 0);
      ctx.restore();
      if (lens.r < size * 0.9) {
        ctx.beginPath();
        ctx.arc(lens.x * dpr, lens.y * dpr, lens.r * dpr, 0, Math.PI * 2);
        ctx.lineWidth = 3 * dpr;
        ctx.strokeStyle = "#FFC21A";
        ctx.stroke();
      }
    }
  }

  function resize() {
    var rect = frame.getBoundingClientRect();
    if (!rect.width) return;
    size = rect.width;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var px = Math.round(size * dpr);
    canvas.width = canvas.height = px;
    sharp.width = sharp.height = px;
    mosaic.width = mosaic.height = px;
    drawSharp();
    buildMosaic();
    if (!lens.r && !intro) { lens.x = target.x = size * 0.5; lens.y = target.y = size * 0.5; }
    render();
  }

  function baseRadius() { return size * 0.2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function tick(now) {
    rafId = 0;
    if (!visible) return;
    if (!t0) t0 = now;
    var t = (now - t0) / 1000 - INTRO_DELAY;

    if (intro) {
      // One orchestrated moment: the whole mark resolves, then the lens settles into place.
      var full = size * 0.85;
      lens.x = size * 0.5; lens.y = size * 0.5;
      if (t < 0) lens.r = 0;
      else if (t < 1.1) lens.r = full * easeOutCubic(t / 1.1);
      else if (t < 1.4) lens.r = full;
      else if (t < 2.4) lens.r = full + (baseRadius() - full) * easeInOut((t - 1.4) / 1.0);
      else { lens.r = baseRadius(); intro = false; target.x = lens.x; target.y = lens.y; }
    } else {
      var idle = !pointerActive || (now - lastPointer > 2500);
      if (idle) {
        var k = (now - t0) / 1000;
        target.x = size * (0.5 + 0.26 * Math.sin(k * 0.7));
        target.y = size * (0.5 + 0.24 * Math.sin(k * 0.53 + 1.2));
      }
      lens.x += (target.x - lens.x) * 0.14;
      lens.y += (target.y - lens.y) * 0.14;
      lens.r += (baseRadius() * (pointerActive && !idle ? 1.1 : 1) - lens.r) * 0.12;
    }
    render();
    rafId = requestAnimationFrame(tick);
  }

  function start() { if (!rafId && !reduce) rafId = requestAnimationFrame(tick); }

  function setPointer(e) {
    if (intro) return;
    var rect = canvas.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    pointerActive = true;
    lastPointer = performance.now();
  }
  frame.addEventListener("pointermove", setPointer);
  frame.addEventListener("pointerdown", setPointer);
  frame.addEventListener("pointerleave", function () { lastPointer = 0; });

  function init() {
    resize();
    if (reduce) {
      intro = false;
      lens.x = lens.y = size * 0.5; lens.r = size;   // static, fully resolved mark
      render();
      return;
    }
    start();
  }

  function loadPhoto() {
    return new Promise(function (resolve) {
      var list = candidates(imageSrc);
      if (!list.length) { report("mark"); resolve(); return; }
      var i = 0;
      (function next() {
        if (i >= list.length) { report("image-failed", list); resolve(); return; }
        var url = list[i++];
        var img = new Image();
        img.onload = function () { if (img.naturalWidth) { photo = img; report("image", url); resolve(); } else next(); };
        img.onerror = next;
        img.src = url;
      })();
    });
  }

  var fontReady = (document.fonts && document.fonts.load)
    ? document.fonts.load('800 64px Bricolage', "A").catch(function () {})
    : Promise.resolve();
  Promise.all([fontReady, loadPhoto()]).then(init);

  if ("ResizeObserver" in window) {
    var lastW = 0;
    new ResizeObserver(function () {
      var w = frame.getBoundingClientRect().width;
      if (Math.abs(w - lastW) < 1) return;
      lastW = w;
      resize();
      if (reduce) { lens.r = size; lens.x = lens.y = size / 2; render(); }
    }).observe(frame);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(frame);
  }
})();
