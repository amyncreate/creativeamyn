# Amyn Pixels portfolio

A fast, static portfolio site. No build step, no CDN, no frameworks. Fonts, icons, images and code are all inside this folder, so it works offline too.

## Go live on Netlify (2 minutes)

1. Go to https://app.netlify.com/drop
2. Drag this whole folder (the one containing `index.html`) onto the page.
3. Rename the site under Site settings, then Change site name (for example `amynpixels`).
4. If your final address is not `amynpixels.netlify.app`, search `index.html`, `robots.txt` and `sitemap.xml` for that address and replace it.

## Before you share the link: 5 things to edit

1. **Your WhatsApp number (most important).** In `index.html`, find `data-whatsapp="234XXXXXXXXXX"` on the `<body>` tag and replace it with your number: country code first, digits only (example: `2348012345678`). Until you do, WhatsApp buttons scroll to the contact form and the "Send on WhatsApp instead" button stays hidden.
2. **Prices and policies.** The Naira prices (Packages) and the FAQ answers (timelines, 50% deposit, revisions, 30 days of fixes) are sample values. Change them in `index.html`.
3. **Work covers.** Images in `assets/work/` are illustrations. Replace each with a real screenshot using the same file name (1600 x 1100 works best).
4. **Concept pieces.** Cards with a "Concept" tag (the four Graphic design pieces and the Wallet app) are self-made examples. When you have real client work, replace the image and text and delete the `<span class="work-badge">Concept</span>` from that card in `index.html`.
5. **Availability line.** The hero says "Booking new projects for November". Update it monthly or delete it.

## How the contact form works

- **Send by email** opens the visitor's email app with a message already written to `ameyn006@gmail.com` (name, contact, service and project details). They press send. If no email app opens, a "Copy the message" link appears.
- A backup copy is also recorded by Netlify Forms. After the first deploy, open Site, then Forms, and turn on email notifications.
- **Send on WhatsApp instead** sends the same details to your WhatsApp (only shown once you set your number).

## Editing the work tabs

The Selected work section has three tabs: Graphic design, Web design and UI/UX design.
- Cards live in `index.html`, inside `#panel-graphic`, `#panel-web` and `#panel-ux`.
- The popup text for each project is in `js/projects.js` (the key matches the card's `data-project`).
- Layout: Graphic and Web panels hold 4 cards, UI/UX holds 3. To add more, copy a card; change a panel's `data-layout` ("a", "b" or "row3") if the grid needs rebalancing.

## Project structure

```
index.html            all page content
css/
  fonts.css           self-hosted fonts
  icons.css           offline Font Awesome subset (generated)
  base.css            colors, type, layout basics
  components.css      buttons, header, tabs, cards, dialog, form, FAQ
  sections.css        each section of the page
  motion.css          animations (switched off for reduced-motion users)
  responsive.css      breakpoints: 1100, 980, 860, 640, 420
js/
  projects.js         text for the project popups
  core.js             WhatsApp links and shared helpers
  nav.js              menu, scroll progress, active link, sticky button
  lens.js             hero pixel-lens effect
  work.js             work tabs and project popup
  form.js             email / WhatsApp form
  motion.js           scroll reveals, process timeline, FAQ animation
assets/               fonts, work covers, favicon, share image
tools/build_icons.py  rebuilds the icon subset
```

## Icons (Font Awesome, offline)

Icons are a small subset of Font Awesome Free 7.3.1 (about 4.6 KB) served from `assets/fonts/`, so they load with no internet or CDN. Use them like `<i class="fa-solid fa-envelope"></i>` or `<i class="fa-brands fa-whatsapp"></i>`.
To add an icon: run `npm install @fortawesome/fontawesome-free` in `tools/`, add the icon name and code to the `SOLID` list in `tools/build_icons.py` (codes are in `node_modules/@fortawesome/fontawesome-free/metadata/icon-families.json`), then run `pip install fonttools brotli` and `python3 build_icons.py`.
Font Awesome Free licence: icons CC BY 4.0, fonts SIL OFL 1.1, code MIT.

## Checked before delivery

Tested in Chromium at 12 widths from 320 to 1920 pixels, on desktop, tablet and phone, with and without a WhatsApp number, and with reduced motion on: no console errors, no failed or external requests, no horizontal scroll, every image, font and icon loads, tabs (click and keyboard), project popup, email and WhatsApp form actions, FAQ, mobile menu, sticky button, scroll animations and tap-target sizes all pass.
