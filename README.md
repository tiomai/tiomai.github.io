# EXAI Landing Page

Production-refactored static site. No build step or external framework is required.

## Files

- `index.html` — page structure and bilingual EN/繁 copy
- `style.css` — desktop/tablet/mobile layout and animation styling
- `script.js` — interactions, adaptive-assessment demo, School Intelligence and language switching
- `translations.js` — language configuration for future expansion
- `assets/logo_exai.png` — EXAI logo

## Local preview

The site is fully static. For the most reliable desktop/mobile test, serve the folder over HTTP instead of opening `index.html` through a chat sandbox or `file://` URL.

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. For a phone on the same Wi-Fi, use your computer's LAN IP, e.g. `http://192.168.x.x:8080`.

## Hosting

Upload the entire folder unchanged to Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3/static hosting, or your own web server. `index.html` is the entry point.

## Language behavior

- User selection is remembered in `localStorage`.
- If no preference exists, the page checks `navigator.language`.
- Traditional Chinese browsers use 繁; all other browsers fall back to English.
- The `EN | 繁` toggle changes language without reloading the page.

## Contact

Demo enquiries use `exai@tiom.ai`.

## Branding / social assets

- `assets/og-cover.png` — 1200×630 Open Graph image used by the page metadata.
- `assets/social-square.png` — 1200×1200 square social/press asset (not referenced by default in the HTML).
- `assets/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` — browser favicons.
- `assets/apple-touch-icon.png` — 180×180 iOS home-screen icon.
- `assets/android-chrome-192x192.png` and `android-chrome-512x512.png` — PWA/Android icons.
- `site.webmanifest` — web app manifest referenced by `index.html`.


## SEO / social sharing

Production domain: `https://exai.kokomonster.com/`

Included:
- Open Graph and X/Twitter large-image metadata
- Canonical + language alternate tags
- JSON-LD SoftwareApplication schema
- `robots.txt` and `sitemap.xml`
- Web manifest + favicon / Apple / Android icon set
- `assets/og-cover.png` (1200×630) as the canonical social preview
- `assets/social-square.png` (1200×1200) for manual social posting

Language URLs `?lang=en` and `?lang=zh` are supported by the same single-page build; the root URL still follows saved language, browser language, then English fallback.
