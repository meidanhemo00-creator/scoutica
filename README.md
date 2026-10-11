# Scoutica landing page

Static site: `index.html`, `styles.css`, `main.js`, `assets/`. No build step, no dependencies.

## Run locally

```bash
cd scoutica-site
python3 -m http.server 8642
```

Open http://127.0.0.1:8642. Any static host works (Netlify, Vercel, Cloudflare Pages, S3).

## Contact form: configuration required

The form validates input but **does not send anything until an endpoint is configured**.
With no endpoint, a valid submission shows: "Online enquiries are not connected yet, so this
message has not been sent." The success message only appears after the endpoint returns a 2xx response.

To enable sending, set `data-endpoint` on the form in `index.html`:

```html
<form class="form" data-form data-endpoint="https://formspree.io/f/XXXXXXX" ...>
```

The form POSTs `multipart/form-data` with fields `name`, `email`, `organization`, `message`
and a honeypot `_gotcha`, using `Accept: application/json`. This works as-is with Formspree,
Basin, Getform, or your own endpoint. Netlify Forms needs `data-netlify="true"` and `name`
attributes instead.

Still needed from Scoutica before launch:
- The inbox or form service that should receive enquiries
- Verified contact email and social profiles, if they should appear in the footer
  (the business plan's Instagram handle is incomplete, so no social links are published)
- An approved founder portrait, if one should be used (the section is designed to work without one)
- Privacy policy, if the form will collect data in production

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

**Type.** Host Grotesk (the face used in the wordmark and tagline) and JetBrains Mono (used for
labels on the brand board), both open source (SIL OFL), loaded from Google Fonts. To self-host,
download the woff2 files and replace the `<link>` in `index.html` with `@font-face` rules.
The S symbol is drawn in Reisinger Amir. That font is not used for text, only through the outlined logo.

## Hero photography

Both images are free to use commercially under the [Unsplash License](https://unsplash.com/license) (checked: neither is an Unsplash+ image). No attribution is required, but credit is given here and in an HTML comment above the hero:

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

## Motion

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
