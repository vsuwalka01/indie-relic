# Indie Relic - E-Commerce Store Project

**Project**: Indian heritage/craft marketplace — "Indian Traditions, Reimagined for Everyday Living"
**Stack**: Next.js 14 (App Router) + Tailwind CSS + Framer Motion
**Status**: Design-matched build complete, running locally
**Created**: 2026-09-16
**Design source**: `C:\Users\doctor\Desktop\indie\` (Figma/Illustrator exports of the full site design)

## Design System (extracted from source files)

- **Colors**: Cream `#F4F1DC` (bg), Navy `#2F4D77` (primary), Navy-dark `#172B53` (ink/logo), Gold `#DAAC54` (accent), Maroon `#9E2027` (nav/links)
- **Fonts**: Display = Fraunces (substitute for paid TAN Nimbus), Body = Inter (substitute for Calibri/Acumin)
- **Logo assets**: `public/logo-header.png` (wordmark), `public/logo-mark.png` (hummingbird icon), both extracted from source PDFs with transparency
- **Map asset**: `public/india-map.png` — real India silhouette (from djaiss/mapsicon), recolored to brand navy
- **Signature motifs**: checkered navy block decorations (header corner, legal page hero, footer), ₹ pricing, "Craft: XXXX" attribution tags, gold diamond+pixel-cross info cards

## Pages Built

- [x] **Home** (`/`) — navy hero card w/ animated hummingbird mark, featured products carousel, craft-story spotlight (Rajasthan card), testimonials
- [x] **All Products** (`/products`) — navy confetti hero banner, sort dropdown, filter drawer (slide-in), 8-product grid
- [x] **Single Product** (`/products/[id]`) — gallery thumbnails, About craft / Idea behind product, sticky add-to-cart bar, 4 accordions, size-in-space section, reviews w/ rating breakdown, more products
- [x] **Craft Map** (`/craft-map`) — real India map image, 6 clickable region pins (Rajasthan/Bihar/Karnataka/Odisha/Chhattisgarh/Punjab), gold info card
- [x] **Search** (`/search`) — minimal full-width overlay, live product filtering
- [x] **Account** (`/account`) — phone number entry (+91) → OTP verification (4-digit, countdown) → success, split-panel layout
- [x] **About** (`/about`) — real extracted brand story copy (artisan immersion, mission)
- [x] **Privacy Policy** (`/privacy`) — real extracted copy, checkered-block legal hero
- [x] **Terms of Service** (`/terms`) — real extracted copy
- [x] **Return Policy** (`/returns`) — real extracted copy (no returns, exchange-only policy)

## Data

- `src/lib/products.ts` — single source of truth for all 8 products (Chittor Fort Kavad, Madhubani Wall Panel, Bidriware Vase, Channapatna Toy Set, Pattachitra Scroll, Dhokra Figurine, Blue Pottery Bowl, Phulkari Runner), each with real craft-heritage copy and verified Unsplash images
- Product images verified working (many Unsplash IDs in the initial pass were 404 — replaced with checked-working alternatives)

## Known Simplification / Follow-ups

- Fonts are close substitutes (Fraunces/Inter), not the exact paid TAN Nimbus/Acumin — swap in `tailwind.config.js` fontFamily + `globals.css` import if the real font files are licensed later
- Product photography is stock (Unsplash) standing in for real product shots — swap `src/lib/products.ts` image URLs when real photography is available
- No backend/cart persistence yet — "Add to Cart" is UI-only (see EXTENSION_GUIDE.md for Zustand cart wiring)
- WhatsApp/email placeholders in footer (`support@indierelic.com` etc.) are inferred — update with real contact details

## Quick Commands

```bash
cd indie-store
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (do NOT run while npm run dev is active — corrupts .next cache)
```

## Notes

- Original design files: `C:\Users\doctor\Desktop\indie\*.pdf` / `*.ai` (10 files, 31 pages total)
- Do not run `npm run build` and `npm run dev` concurrently — it corrupts the `.next` cache and causes 500s. Stop dev server first if you need a production build check.
