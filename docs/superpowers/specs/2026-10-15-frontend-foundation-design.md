# Handled frontend foundation

Implement the user's approved frontend brief using the [Canonical Master Plan](https://app.notion.com/p/3f94ab5df14481ca9e8cf25219e10442), [Technology Standards](https://app.notion.com/p/3f94ab5df14481309665c49786c67db8), [Architecture](https://app.notion.com/p/3f94ab5df144812c9efdde1a3ffd96f0), and [Release Gates](https://app.notion.com/p/3f94ab5df1448151bbb0e7814fddfb38). Primary Jira scope: SCRUM-87 and SCRUM-86. This is shared foundation work, not a reassignment of domain features.

## Architecture and preservation

One pnpm workspace and lockfile; Next.js App Router in `apps/web`, existing NestJS source in `apps/api` only if a verified local source can be preserved without rewriting it. Current checkout began at `a29d35d` on local `master`, with no remote and no API code. Create `development` from that existing default, then `feat/frontend-foundation`. Leave default branch unchanged. Retain installed shadcn `base-rhea` style, Mist colors, Base UI primitives, original button, font families and theme provider. User identifies the preset as `b313IfCERG`; do not reinitialize it.

## UI and routes

One root provider layout, separate `(marketing)`, `(auth)`, `(dashboard)` groups. Marketing `/` uses an editorial charcoal/ivory palette from Mist, large Outfit headings, Inter body, metallic liquid sculpture, restrained glass folds, a concrete ticket-to-evidence-to-human-decision story, honest sample previews, FAQ and product CTA. No pricing, fake customer logos, fabricated metrics or functioning-provider claims.

Auth `/login`, `/signup`, `/forgot-password` use reusable shadcn fields, validation, clear integration status and a separate preview link. They never create a fake authenticated session. Dashboard `/dashboard`, `/tickets`, `/tickets/[ticketId]`, `/knowledge`, `/activity`, `/settings` provide responsive reusable shells and sample states. Sample actions stay local and explicitly say no real action occurred. Real writes and authentication remain unavailable until owner-reviewed endpoints exist.

## Boundaries and performance

Typed, runtime-validated REST transport: `/api/v1`, `{data,requestId}`, paginated meta and typed errors. No unvalidated generic casts, credentials in logs, automatic write retries or silent fallback to mock data after live errors. Explicit sample adapter; workspace IDs included in query keys and data filters. Source contracts must win over obsolete spec examples, and proposed DTOs are labeled until reviewed.

Motion uses `LazyMotion` with async DOM features, transform/opacity only, one-time viewport reveals, and short entry transitions. Hero effects are isolated and lazy-loaded. Small screens, reduced-motion and offscreen conditions use static decorative fallbacks. No WebGL, canvas render loop or heavy animation package. Semantic landmarks, keyboard access, focus visibility, labelled forms, proper dialogs and responsive navigation are required.

## Acceptance

Meaningful small commits; lint, typecheck, behavior tests, mobile/desktop browser checks and production build pass. Record existing baseline failures separately. Jira reports actual implementation, branch, validation and blockers; no domain issue marked Done from mock-only work. Push and open PR to `development` once a remote and working credentials are available. Merge requires checks and the approved peer review gate; never force-push or push directly to main.
