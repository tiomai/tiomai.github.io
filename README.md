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
