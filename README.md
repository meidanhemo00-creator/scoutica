# Scoutica landing page

Static site: `index.html`, `styles.css`, `main.js`, `assets/`. No build step, no dependencies.

## Run locally

```bash
cd scoutica-site
python3 -m http.server 8642
```

Open http://127.0.0.1:8642. Any static host works (Netlify, Vercel, Cloudflare Pages, S3).

## Contact form

Enquiries are posted to [FormSubmit](https://formsubmit.co), which emails them to **stav@scoutica.io**
(set in `data-endpoint` on the form in `index.html`). Success is only shown when FormSubmit confirms
it accepted the message; otherwise the visitor sees an error and keeps what they typed.

**One-time activation:** the first real submission makes FormSubmit send a confirmation email to
stav@scoutica.io. Click the link in it once; after that every enquiry arrives in that inbox. Until it is
clicked, submissions will show the error message. Send one test enquiry from the live site right after launch.

The endpoint address is visible in the page source (that is how static-site forms work). FormSubmit
offers a random-token alias after activation if you would rather not show the address.

Still needed before launch: verified social links for the footer, an approved founder portrait if wanted,
a privacy policy, and Stav's paragraph on the technology units (placeholder copy is in the first row of
"Access is the starting point").

## Brand decisions

**Logo.** `assets/logo-*.svg` and `assets/symbol-*.svg` are exact outlines of the supplied
artwork in `scoutica (1).pdf` (the S glyph plus "coutica" in Host Grotesk), converted from
the PDF text to paths. They are not redrawn.

**Palette.** The materials use two blue treatments:
- Brand board (`scoutica.pdf`): ultramarine `#0F1D98`, navy `#0A125D`, charcoal `#282828`, warm white `#FCF9F4`
- Logo and deck files (`scoutica (1).pdf`): brighter azure `#005DDC` / `#0065F0`, plus a blue-to-black gradient

This site uses the **brand board palette** only, because it is the documented four-color system.
The logo is rendered in ultramarine, charcoal, or warm white. Derived tints (all mixed from
those four) are listed at the top of `styles.css`.

**Type.** Satoshi (Indian Type Foundry, free for commercial use under the Fontshare license, loaded from
fontshare.com) and JetBrains Mono (SIL OFL, used for labels as on the brand board). The wordmark and the S
symbol are outlined artwork and do not depend on any font.

## Photography

Three images (the two hero frames and the wide band, Tel Aviv at night by Pierre Lemon, unsplash.com/photos/hdMH3QtnLv8) are free to use commercially under the [Unsplash License](https://unsplash.com/license) (checked: neither is an Unsplash+ image). No attribution is required, but credit is given here and in an HTML comment above the hero:

- Tel Aviv: "Tel Aviv Sunset" by Joseph Barrientos, https://unsplash.com/photos/-HNvo9UG8ig
- Miami: skyline by Michael Worden, https://unsplash.com/photos/TomHMvzU4jQ

They are served from Unsplash's image CDN (`images.unsplash.com`), with responsive `srcset`,
automatic WebP/AVIF, and a portrait crop for phones. To self-host instead, download them
at 1440/1920/2560 widths and swap the URLs in `index.html`.

The colour treatment is pure CSS: a greyscale photo multiplied over an ultramarine gradient,
so every frame stays in the brand hue. Hero text measures at least 9:1 contrast against the
brightest pixel behind it, in both crossfade states, on desktop and mobile.

## Surfaces and the S

- Dark surfaces use `#1D1D20` (deepened brand charcoal). `#282828` stays as text on warm white.
- Every S on the page (logo files, hero signature, defense-sector pattern, approach pathway) keeps
  the supplied orientation: top bar to the right, notch on the left, bottom bar to the left.
  S figures are only translated or uniformly scaled, never mirrored or rotated.

## Illustrations

All illustrations are built from the real S symbol on a deep blue field: three value tiles, four stage tiles
(a different crop of the S for each stage), the S that fills quarter by quarter beside the approach, and the
expert review animation. No thin diagram lines or icon libraries.

## Motion

- Expert review: experts around a central S light up one by one, each sends an initial read to the centre,
  and the cycle ends with a check. Static (all lit, with the check) under reduced motion.
- Hero: images fade in once decoded; a 26s crossfade (Tel Aviv, then Miami) with the route
  labels in sync; slow drift and a moving blue light on a 52s cycle; the signature S gathers
  from its grid cells once on load.
- Scroll: subtle depth on the hero media (CSS scroll-driven animation, Chromium only, others
  stay static), the thread drawing down into the next section, quiet reveals.
- `prefers-reduced-motion`: one static image, no drift, light, crossfade or scroll depth.

## Content sources

All founder information comes from the business plan (section 6.1.1). Intentionally omitted:
unit names, project values, ownership, visa details, financial projections, pricing and package
tiers (the package descriptions and financial tables in the plan don't match), the anchor client
("ready to sign"), and partner or employer logos.
