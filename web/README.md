# PiècesExpress Moto — web

Responsive Next.js site (phone first, desktop layout from 768 px) built from the Design canvas:
light theme, one deep-orange accent, one colour + silhouette per motorcycle type, and filters by
**type → brand → model → engine size**.

## Run

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

With `ERP_ORG_ID` empty (the default), the site runs on the demo catalogue in
`src/lib/data/mock-data.ts`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Accueil: promo slider, "Trouver par moto" finder, categories, flash sales, parts for my bike, shop by type / brand |
| `/garage` | Choisir ma moto: type → brand → model → year, saved in the browser |
| `/catalogue` | Catalogue with filters in the URL (`type`, `brand`, `model`, `cc`, `cat`, `pos`, `maker`, `cond`, `sort`, `q`). Sidebar on desktop, bottom sheet on phones |
| `/pieces/[id]` | Part page with compatibility check against the saved bike |
| `/reservation/[id]` | Reservation form (server action) |
| `/commandes` | My orders |
| `/magasin` | Shop-owner space (demo data) |

## Connecting SupplyChain Pro ERP

1. Copy `.env.example` to `.env.local` and set:
   ```
   ERP_API_URL=http://localhost:4000
   ERP_ORG_ID=<organisation uuid>
   ```
   These stay on the server; they are never sent to the browser.
2. Restart `npm run dev`.

The site then uses `src/lib/data/erp.ts`, which calls the same storefront API as the Expo app:
`GET /storefront/:orgId/shop`, `GET …/products`, `GET …/products/:id`, `POST …/reservations`.

The storefront API has no fields yet for bike compatibility, condition or position, so they are read
from **product tags**:

| Tag | Meaning |
| --- | --- |
| `moto:z1000` | fits this model (ids in `src/lib/moto.ts`), one tag per model |
| `marque:vespa` | fits every model of this brand |
| `type:scooter`, `type:50` | fits every bike of this motorcycle type |
| `universel` | fits every bike (helmets, gloves, locks…) |

A part can carry any mix of these, so one part can be linked to several brands and types
(e.g. `moto:z1000 moto:mt07 marque:ktm`).
| `etat:original` / `oem` / `aftermarket` / `used` | condition |
| `position:avant` / `position:arriere` | front / rear |
| `oem:43082-0122` | OEM equivalent reference |

Still to add on the ERP side: an endpoint listing a customer's reservations (the `/commandes` page is
empty in ERP mode until then), and shop-owner data for `/magasin`.

## Code map

- `src/lib/moto.ts` — motorcycle types, brands, models, silhouettes (reference data)
- `src/lib/filters.ts` — URL ↔ filters, matching logic shared by both data sources
- `src/lib/data/` — `index.ts` (what pages call, cached with `'use cache'`), `mock.ts`, `erp.ts`
- `src/components/` — UI; `catalogue/filters.tsx` holds the sidebar, phone sheet and filter chips
- `src/app/globals.css` — design tokens (colours, fonts) from the canvas
