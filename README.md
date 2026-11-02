# Migrant Helpdesk

Next.js (App Router) helpdesk for migrant workers in Taiwan: emergency hotlines, anonymous support chat, health navigation, and workplace safety guides.

Stack: **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma** (PostgreSQL), **lucide-react**.

## Local setup

### 1. Install

```bash
npm install
```

`postinstall` runs `prisma generate`.

### 2. Postgres

Create a database, then copy the example env file:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` (do not commit secrets):

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/migrant_helpdesk?schema=public"
```

### 3. Migrate and seed

```bash
npx prisma migrate dev
npm run db:seed
```

The initial migration lives at `prisma/migrations/20261102120000_init/`. If `migrate dev` cannot reach Postgres, you can still apply that SQL later:

```bash
npx prisma migrate deploy
npx prisma generate
npm run db:seed
```

To recreate the SQL from the schema without a live database:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Typecheck

```bash
npm run typecheck
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` then production build |
| `npm start` | Production server |
| `npm run db:seed` | Load sample clinics, guides, and users |
| `npm run typecheck` | `tsc --noEmit` |

## Project layout

- `app/` — App Router pages and `app/api/` routes
- `components/` — Header, bottom nav, dashboard cards, i18n provider
- `dictionaries/` — UI strings (en, zh-TW, id, vi, tl, th)
- `lib/` — Prisma client
- `prisma/` — schema, migrations, seed
- `types/` — shared TypeScript types
