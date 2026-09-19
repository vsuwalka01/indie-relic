# Indie Relic — Project Reference

**Product:** Indian heritage and craft ecommerce store  
**Tagline:** Indian traditions, reimagined for everyday living  
**Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand, Lenis  
**Production:** https://indie-store-mu.vercel.app  
**Hosting:** Vercel project `indie-store`  
**Status:** Production deployment live; storefront, cart, checkout, customer accounts, CMS, and OTP authentication are operational  
**Last updated:** 2026-09-20

## Product and design

The storefront keeps the original Indie Relic design language: cream, navy, maroon, and gold; editorial serif typography; crop marks; stitched paths; diamonds; flowers; and state-specific craft artwork.

- Cream `#F4F1DC`
- Navy `#2F4D77`
- Navy dark `#172B53`
- Gold `#DAAC54`
- Maroon `#9E2027`
- Display font: Fraunces
- Body font: Inter

Motion includes page transitions, smooth scrolling, scroll progress, reveal effects, parallax scenes, magnetic controls, card tilt, marquees, craft motifs, and cursor-responsive details. The bird mark is static in the main design and does not fly through the page.

## Customer-facing pages

- `/` — homepage, featured products, craft story, testimonials, and state craft links
- `/products` — responsive product catalog, filters, and sorting
- `/products/[id]` — product gallery, story, reviews, related products, and visible add-to-cart controls
- `/cart` — persistent cart, quantities, coupons, address collection, and guest or signed-in checkout
- `/search` — product search
- `/craft-map` — responsive interactive India craft map
- `/craft-map/[state]` — state-themed craft pages with artwork, story, materials, process, and related products
- `/about` — brand story, mission, and craft references
- `/account` — phone authentication, profile, address book, and order history
- `/privacy`, `/terms`, `/returns` — legal and policy pages

## Commerce behavior

- The Zustand cart persists in browser storage under `indie-relic-cart`.
- Products can be added from product cards and detail pages.
- Checkout supports guests and signed-in customers.
- The server recalculates product prices, coupon discounts, and totals from stored data; browser-supplied prices are ignored.
- Orders are persisted and appear in the CMS.
- Signed-in customers can save addresses and view their order history.
- Online payment is not connected yet. The current flow records an order without charging a card or UPI account.

## Customer authentication and OTP

- Customer login uses a six-digit, five-minute OTP.
- OTP hashes, expiry, resend cooldown, hourly limits, and failed-attempt limits are stored server-side.
- Production delivery uses 2Factor with the approved `IndieRelicOTP` template.
- The current free 2Factor trial delivers Indian OTPs through an automated voice call. The account page tells users to answer the call.
- SMS delivery requires an approved Indian DLT principal entity, sender header, and content template. After DLT activation, set `TWO_FACTOR_DELIVERY_MODE=sms` in Vercel.

## CMS

The CMS is available at `/admin/login` and uses signed, HTTP-only admin sessions with role checks.

CMS sections:

- Products
- State craft stories and map links
- Orders, assignment, tracking, status, notes, and timeline
- Coupons and usage limits
- Site settings and homepage copy
- Theme tokens
- CMS users and roles

The environment-configured owner remains available as a recovery account even after additional CMS users are created.

## Data storage

Production uses a private Vercel Blob store. Each collection is saved as a stable JSON object under `cms/`:

- `products`
- `crafts`
- `settings`
- `coupons`
- `orders`
- `users`
- `theme`
- `customers`
- `otps`

Local development uses `data/*.json` when Blob credentials are absent. Code-defined seed data is used until a collection is saved for the first time.

## API routes

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET/PUT/DELETE /api/account`
- `GET/POST/PUT/DELETE /api/account/addresses`
- `GET /api/account/orders`
- `POST /api/coupons/check`
- `POST /api/orders`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET/PUT /api/admin/content/[collection]`
- `GET/PATCH /api/admin/orders`
- `GET/POST/PATCH/DELETE /api/admin/users`

## Environment variables

Never commit real values. Production values are configured in Vercel.

```env
# CMS owner and sessions
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
CUSTOMER_SESSION_SECRET=

# Production persistence
BLOB_STORE_ID=
# BLOB_READ_WRITE_TOKEN=   # supported for older/manual Blob setups

# Current OTP provider
TWO_FACTOR_API_KEY=
TWO_FACTOR_TEMPLATE_NAME=IndieRelicOTP
TWO_FACTOR_DELIVERY_MODE=voice

# Other supported SMS providers
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_FROM=
# MSG91_AUTH_KEY=
# MSG91_SENDER_ID=
# TEXTBELT_API_KEY=
```

## Local development

```bash
cd C:\Users\doctor\Desktop\indie-store
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` for the production validation build and `npm start` to serve that build locally.

Do not run `npm run dev` and `npm run build` against the same `.next` directory at the same time.

## Deployment

```bash
npx vercel --prod --yes
```

The production alias is `https://indie-store-mu.vercel.app`. A deployment is complete only after Vercel reports `Ready` and the alias responds with HTTP 200.

## Current limitations

- SMS OTP remains on voice delivery until DLT registration is completed.
- No Razorpay, Stripe, UPI, or other payment capture is implemented.
- Seed product photography should be replaced with final brand photography when available.
- Operational contact details and final legal copy should be reviewed before a commercial launch.

## Important source files

- `src/lib/products.ts` — seed product catalog
- `src/lib/stateCrafts.ts` — state craft content
- `src/lib/cartStore.ts` — persistent cart
- `src/lib/cms/store.ts` — local JSON and Vercel Blob persistence
- `src/lib/cms/sms.ts` — OTP provider adapters
- `src/lib/cms/otp.ts` — OTP lifecycle and limits
- `src/app/account/AccountClient.tsx` — customer authentication UI
- `src/components/CheckoutPanel.tsx` — checkout and address flow
- `src/components/IndiaMap.tsx` — interactive craft map
- `src/app/admin/(protected)` — CMS screens
