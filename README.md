# Migrant Helpdesk

Next.js (App Router) helpdesk for migrant workers in Taiwan: emergency hotlines, anonymous chat, health navigation, workplace safety, self-check, community, and home-country guides. Staff use `/admin` (ADMIN role only).

Stack: **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma** (PostgreSQL), **Zod**, **React Hook Form**, **lucide-react**.

## Environment variables

Copy `.env.example` to `.env` (never commit secrets):

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | For persist | Postgres connection string (local or Supabase) |
| `ADMIN_DEMO_PASSWORD` | No (default `helpdesk-admin`) | Password for `admin@example.com` staff login |

Without a reachable Postgres, APIs still run using the in-repo catalog / memory fallback so the UI can be previewed.

## Local setup

```bash
npm install
cp .env.example .env
# set DATABASE_URL
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Staff: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — `admin@example.com` / `helpdesk-admin`.

If Postgres is down:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
npx prisma generate
npm run dev
```

Apply SQL later with `npx prisma migrate deploy` then `npm run db:seed`.

```bash
npm run typecheck
```

## Deploy: Vercel + Supabase

1. Create a **Supabase** project → **Project Settings → Database**. Copy the URI (use the pooled connection on port `6543` with `?pgbouncer=true` for serverless, or the direct URI for migrations).
2. From your machine (direct URI): `npx prisma migrate deploy` and `npm run db:seed`.
3. On **Vercel**: import the GitHub repo, set **Root Directory** to the app root, add env vars:
   - `DATABASE_URL` = Supabase URI
   - `ADMIN_DEMO_PASSWORD` = a strong password
4. Deploy. `postinstall` runs `prisma generate`; `npm run build` generates the client then builds Next.js.
5. Open `/admin/login` on the production domain.

Anonymous `vercel deploy --temporary` previews work without login but expire (~60 minutes) and use catalog fallback unless `DATABASE_URL` is set.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Production server |
| `npm run db:seed` | Sample clinics, guides, users |
| `npm run typecheck` | `tsc --noEmit` |

## Layout

- `app/` pages and `app/api/` routes (Zod-validated)
- `app/admin/` RBAC back-office (`middleware.ts` requires `mh_role=ADMIN`)
- `components/` UI, i18n provider, admin CRUD
- `dictionaries/` en, zh-TW, id, vi, tl, th
- `lib/` Prisma, catalogs, admin/support data
- `prisma/` schema, migrations, seed
