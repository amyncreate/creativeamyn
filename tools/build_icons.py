"""Builds a tiny offline Font Awesome subset (only the icons the site uses)."""
import os, subprocess
FA = "node_modules/@fortawesome/fontawesome-free"
OUT_FONTS = "../assets/fonts"
SOLID = {
 "bars":"f0c9","xmark":"f00d","envelope":"f0e0","paper-plane":"f1d8","check":"f00c","chevron-down":"f078",
 "arrow-up":"f062","palette":"f53f","code":"f121","pen-ruler":"f5ae","laptop-code":"f5fc",
 "mobile-screen-button":"f3cd","shapes":"f61f","signature":"f5b7","comments":"f086",
 "file-invoice-dollar":"f571","rocket":"f135","location-dot":"f3c5","layer-group":"f5fd","award":"f559",
 "circle-check":"f058","up-right-from-square":"f35d","pen-nib":"f5ad","swatchbook":"f5c3",
 "wand-magic-sparkles":"e2ca","expand":"f065","compass-drafting":"f568","eye":"f06e","bolt":"f0e7","copy":"f0c5",
}
BRANDS = {"whatsapp":"f232"}

def subset(src, dst, codes):
    uni = ",".join("U+" + c.upper() for c in codes)
    subprocess.check_call(["pyftsubset", src, f"--unicodes={uni}", "--flavor=woff2", f"--output-file={dst}",
                           "--layout-features=*", "--no-hinting"])
    print(os.path.basename(dst), os.path.getsize(dst), "bytes")

subset(f"{FA}/webfonts/fa-solid-900.woff2", f"{OUT_FONTS}/fa-solid-subset.woff2", SOLID.values())
subset(f"{FA}/webfonts/fa-brands-400.woff2", f"{OUT_FONTS}/fa-brands-subset.woff2", BRANDS.values())

css = ['''/*!
 * Font Awesome Free 7.3.1 (subset), https://fontawesome.com
 * Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT. Copyright Fonticons, Inc.
 * Only the icons used on this site are included, so everything loads offline and stays tiny.
 * To add an icon: rebuild the subset (see README) or swap in the full Font Awesome Free files.
 */
@font-face { font-family: "Font Awesome 7 Free"; font-style: normal; font-weight: 900; font-display: block;
  src: url("../assets/fonts/fa-solid-subset.woff2") format("woff2"); }
@font-face { font-family: "Font Awesome 7 Brands"; font-style: normal; font-weight: 400; font-display: block;
  src: url("../assets/fonts/fa-brands-subset.woff2") format("woff2"); }
.fa-solid, .fa-brands { display: inline-block; font-style: normal; font-variant: normal; line-height: 1; text-rendering: auto; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.fa-solid { font-family: "Font Awesome 7 Free"; font-weight: 900; }
.fa-brands { font-family: "Font Awesome 7 Brands"; font-weight: 400; }''']
for n,c in SOLID.items(): css.append(f'.fa-{n}::before {{ content: "\\{c}"; }}')
for n,c in BRANDS.items(): css.append(f'.fa-{n}::before {{ content: "\\{c}"; }}')
open("../css/icons.css","w").write("\n".join(css)+"\n")
print("icons.css written")
