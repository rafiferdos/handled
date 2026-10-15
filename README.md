# Handled

Evidence-first, human-controlled AI support operations. This repository contains the shared frontend foundation and the preserved NestJS API in one pnpm workspace.

## Run locally

Use Node 22 (`>=22.13 <23`) and pnpm 11.25.0, matching the existing API runtime.

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. The frontend preview requires no secrets or environment variables. Inter, Outfit and Geist Mono are self-hosted with their OFL licenses, so builds do not fetch Google Fonts.

```bash
pnpm dev:api          # Separate process; configure apps/api/.env first
pnpm lint            # Both applications
pnpm typecheck       # Both applications; generates Prisma client, no DB changes
pnpm test            # API unit tests + frontend transport/isolation tests
pnpm build           # Both production builds
pnpm check           # lint, typecheck, unit tests, production builds
pnpm --filter @handled/web exec playwright install chromium
pnpm test:e2e        # Desktop + mobile frontend smoke tests
pnpm --filter handled-api test:e2e  # Preserved API HTTP/contract suite
```

The backend environment template is [apps/api/.env.example](apps/api/.env.example). Copy it to `apps/api/.env` and configure it locally when running the API. Never commit real environment files. The frontend does not connect to a database directly.

## Structure

```text
apps/
  web/                  Next.js App Router, React, Tailwind 4, shadcn Base UI
    app/(marketing)/    Public home, product and how-it-works
    app/(auth)/         Login, signup and password-recovery form foundations
    app/(dashboard)/    Public sample workspace, inbox, cases, knowledge, activity, settings
    components/ui/      Installed shadcn preset and generated compatible primitives
    features/           Domain UI extension points
    lib/api/            Runtime-validated REST transport and explicit sample adapter
  api/                  Existing NestJS/Prisma source, preserved without rewriting
```

There is one workspace lockfile. No Turborepo, Nx, WebGL or extra UI framework is required. The existing `base-rhea` / Mist shadcn preset (`b313IfCERG` supplied by the user) and original color tokens remain in [apps/web/components.json](apps/web/components.json) and [globals.css](apps/web/app/globals.css). Add compatible UI components from the app directory:

```bash
pnpm --filter @handled/web exec shadcn add <component>
```

## What is connected

The public product pages, navigation, theme preference, sample search/filtering, workspace switching, source dialogs and local review rehearsals work. Dashboard counts derive from the sample records and are explicitly labelled.

The preview uses the canonical `TKT-1001` duplicate-charge, `TKT-1002` period-end cancellation and `TKT-1003` access-mismatch cases. `PixelDesk` is empty so workspace separation can be exercised. The third fixture deliberately requires manual review because its exact product mapping is unverified.

**Authentication, account creation, recovery emails, live business data, provider connectors, customer reply sending, real approvals and durable audit are not integrated.** The preview creates no fake authenticated session, makes no payment/account changes and never silently replaces failed live requests with sample data. A local rehearsal is not evidence of a backend workflow.

The typed transport implements the existing `/api/v1` envelope and error conventions. Domain view models are labelled preview-only until the corresponding API owners freeze their DTOs. Live data must remain behind verified sessions and workspace permissions; this public sample layout must not be reused as an authorization guard.

## Team delivery

Work targets `development` through `feat/frontend-foundation` and a linked PR. Never push directly to `main`, force-push shared branches or mark a domain ticket Done from a sample UI. Merge requires passing checks and the approved peer-review gate.

Primary foundation issues: [SCRUM-87](https://team-singularity.atlassian.net/browse/SCRUM-87) and [SCRUM-86](https://team-singularity.atlassian.net/browse/SCRUM-86). See [frontend handoff](docs/frontend-foundation.md), [backend provenance](docs/backend-provenance.md) and the [implementation plan](docs/superpowers/plans/2026-10-15-frontend-foundation.md). The original Next.js starter's components and assets were relocated into `apps/web`; its sample page is retained as `starter-reference.tsx` for provenance.

Source decisions: [Canonical Master Plan](https://app.notion.com/p/3f94ab5df14481ca9e8cf25219e10442), [Technology Standards](https://app.notion.com/p/3f94ab5df14481309665c49786c67db8), [Architecture](https://app.notion.com/p/3f94ab5df144812c9efdde1a3ffd96f0), and [Release Gates](https://app.notion.com/p/3f94ab5df1448151bbb0e7814fddfb38).
