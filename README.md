# Iyiola The Brand: online shop

A TypeScript (Next.js 14, App Router) shop for fabrics, adire, lace and abayas. Customers browse by category; an admin uploads items and marks them sold out.

Brand name, tagline, phone, email and services live in `src/lib/brand.ts`.

## Run it

```bash
npm install
cp .env.example .env.local     # then set ADMIN_PASSWORD and AUTH_SECRET
npm run dev
```

- Shop: http://localhost:3000
- Admin: http://localhost:3000/admin

## Page sections

Shop by category (grouped by Adire, Lace, Cotton and so on), Abaya festive collections, Sourcing, Styling, Tailoring, How it works, and Contact, with a sticky nav that jumps to each. Service wording, category descriptions and the three steps are in `src/lib/brand.ts`.

## How it works

- **Add a fabric** (admin): name, category, colour, price (per metre, or per piece for abayas), width, description, photo.
- **Mark sold out** (admin): toggle "In stock" on any row. The shop shows a sold-out stamp and disables ordering. Toggle it back when stock returns.
- **Ordering**: "Order on WhatsApp" opens a chat with the brand's WhatsApp number (07080175599, sent as 2347080175599) with the fabric name, colour and price already typed. The customer adds the number of metres and sends.
- **Storage**: `data/materials.json` plus `data/uploads/` (change with `DATA_DIR`). Uploaded images are served through `/api/uploads/<file>`.

## Layout

```
src/lib/        types, validation, file store, admin auth
src/app/api/    materials (list/create), materials/[id] (stock/delete), uploads, auth
src/app/        shop page, admin page
src/components/ MaterialCard, Swatch
```

## Before going live

File storage needs a server with a persistent disk. On serverless hosts (e.g. Vercel) swap `src/lib/store.ts` for a database such as Postgres and image uploads for object storage like S3 or Cloudflare R2. Every other file stays the same, because all data access goes through that one module.
