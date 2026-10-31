/* form.js: the contact form sends by email (opens the visitor's email app with the message ready),
   keeps a backup copy via Netlify Forms, and can send the same details on WhatsApp. */
(function () {
  "use strict";
  var form = document.getElementById("projectForm");
  var note = document.getElementById("formNote");
  var waBtn = document.getElementById("sendWa");
  if (!form || !note) return;

  if (waBtn && AP.hasWhatsApp) waBtn.hidden = false;

  function values() {
    var d = new FormData(form);
    return {
      name: String(d.get("name") || "").trim(),
      contact: String(d.get("contact") || "").trim(),
      service: String(d.get("service") || "").trim(),
      message: String(d.get("message") || "").trim().slice(0, 1500)
    };
  }

  function messageText(v) {
    return "Hi Amyn,\n\n" +
      "My name is " + v.name + " and I am interested in: " + v.service + ".\n\n" +
      "About my project:\n" + v.message + "\n\n" +
      "You can reach me on: " + v.contact;
  }

  function setNote(cls, text) { note.className = "form-note " + cls; note.textContent = text; }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var v = values();
    var text = messageText(v);
    var subject = "New " + v.service.toLowerCase() + " enquiry from " + v.name;

    // Best-effort backup copy through Netlify Forms (ignored if it fails or isn't on Netlify)
    try {
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(), keepalive: true }).catch(function () {});
    } catch (err) { /* no-op */ }

    AP.openMail("mailto:" + AP.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text));

    note.className = "form-note ok";
    note.textContent = "Your email app should open with the message ready. Just press send. Nothing opened? ";
    var copy = document.createElement("button");
    copy.type = "button"; copy.className = "linkish"; copy.textContent = "Copy the message";
    copy.addEventListener("click", function () {
      copyText(text).then(function () { copy.textContent = "Copied. Now email " + AP.email; },
                          function () { copy.textContent = "Couldn't copy. Please email " + AP.email; });
    });
    note.appendChild(copy);
    note.appendChild(document.createTextNode(" and send it to " + AP.email + "."));
  });

  if (waBtn) {
    waBtn.addEventListener("click", function () {
      if (!form.reportValidity()) return;
      AP.openWa(AP.waUrl(messageText(values())));
      setNote("ok", "WhatsApp is opening with your message ready to send.");
    });
  }
})();
