# Frontend foundation handoff

Primary issues: [SCRUM-87](https://team-singularity.atlassian.net/browse/SCRUM-87), [SCRUM-86](https://team-singularity.atlassian.net/browse/SCRUM-86). Shared foundation; original domain owners remain responsible for their integrated workflows.

## Source and implementation boundary

All current pages in the Handled Notion hub and its Git collaboration reference were read on 15 October 2026, including the Canonical Master Plan, Ownership/Data Contracts/Security Architecture, Commercial Roadmap, Release Gates, Technology Standards, Backend Blueprint, ERD, AI Instructions and Project Pulse. Canonical approved decisions govern scope. Older specs and Pulse counts are not completion evidence.

The current frontend implements reusable UI and explicit sample workflows. It does not satisfy G1 authentication, G2 golden-flow integration or G3 release gates. No domain Jira task should be closed merely because a matching sample screen exists.

## What owners can reuse

- `components/ui`: official shadcn Base UI primitives generated with the original `base-rhea`/Mist configuration. Do not reinitialize the preset.
- `components/shared`: brand, button-styled native links, theme control and section headings.
- `components/motion`: async `LazyMotion` DOM features, visible-by-default reveals and short route entry transitions. The external-store media query prevents reduced-motion hydration differences.
- `components/marketing`: static SVG sculpture plus desktop-only lazy interaction, static mobile/reduced-motion fallback, scroll fold with a content-preserving loading fallback. No WebGL or frame-based render loop.
- `components/dashboard`: responsive shell, workspace picker, headings and loading/error/empty states.
- `features/auth`: React Hook Form/Zod and shadcn Field examples. Valid submissions explicitly report that no session/account/email was created. Password input is cleared; no credentials are logged, sent or persisted.
- `features/tickets`: scoped reads, filters, sample detail/evidence and decision rehearsal. Approval is unavailable for the low-confidence case; the local rehearsal is never a durable audit.
- `lib/api/client.ts`: read-only transport with runtime success/list/error validation, safe messages, bearer callback, correlation, HTTPS origin enforcement, redirect rejection and an end-to-end timeout (including stalled token/body adapters). No automatic retries of business writes.
- `lib/api/sample-adapter.ts`: explicit fixture adapter. Query keys include source mode, workspace and filters. Switching workspaces cancels/removes sample cache and resets local drafts/filters. This provider is a public sample boundary, not a production auth guard.

## Route ownership and integration

| Surface | Routes | Owner / remaining integration |
| --- | --- | --- |
| Public product | `/`, `/product`, `/how-it-works` | Shared; review public copy against actual release status |
| Identity | `/login`, `/signup`, `/forgot-password` | Person A; Supabase session/JWKS/bootstrap, verification, recovery and protected live layouts |
| Workspace | `/settings`, workspace picker | Person A; verified membership, invitations, RBAC and auth-aware cache lifecycle |
| Tickets/customers | `/tickets`, `/tickets/[ticketId]` | Person B; freeze real DTOs, connect workspace-scoped ticket/customer endpoints, writes and pagination |
| Knowledge | `/knowledge` | Person C; scoped published documents, drafts/publish/archive/index state and version provenance |
| Investigation/proposal | Sample ticket evidence/decision panel | Team Lead; real tool/status/source/proposal/version and decision contracts |
| Action/audit/realtime | `/activity` | Person D; durable action/audit endpoints and authorized thin Socket events with REST recovery |

The API snapshot is preserved at `e56351516d80d10df8eba8327b27b5ffc474dbf2`; see [provenance](backend-provenance.md). Its lead contracts remain G0 proposals; production business routes and auth are unfinished. No backend source was rewritten for this foundation.

The REST envelope matches current source: `/api/v1`, `{data,requestId}`, list `meta:{page,limit,total,hasNext}`, errors `{error:{code,message,details},requestId,timestamp}`. Sample ticket fields are labelled preview view models, not frozen API DTOs. Category taxonomy is intentionally a string. Current lead source uses empty investigation/retry bodies, workspace-level investigation lists, immutable proposal versions and idempotency on lead POSTs; older examples must not override these silently.

## Validation and release status

Use `pnpm check`, `pnpm --filter handled-api test:e2e`, and `pnpm test:e2e`. CI runs the same workspace gate and production browser suite on PRs targeting development/main. No database, migration, live auth or provider credentials are required by these test suites.

Observed baseline: original Next 16.4.0 starter had an unused-font lint warning and failed production build because Google Fonts could not be fetched. The foundation patches Next to 16.4.1 per the [official October advisory](https://nextjs.org/blog/nextjs-security-update-october-14-2026), self-hosts verified variable Latin WOFF2 assets with licenses (about 104 KB total), and removes the unused import.

Current local proof: both applications pass lint and typecheck; 111 preserved API unit tests and 14 frontend transport/isolation tests pass; 37 API HTTP/contract tests pass; both production builds pass; desktop/mobile production browser suite passes 23 checks, with one desktop skip for the mobile-only menu case. Browser cases include public navigation, keyboard FAQ, reduced-motion hydration/visibility, mobile sheets, search/filter/empty/reset, workspace-switch cache isolation, honest auth, source dialogs, local decisions, low-confidence approval blocking, draft editing, theme selection, saved-theme hydration and short-height overlay scrolling.

No production deployment is claimed. No real Supabase session, database-backed golden flow, provider operation or durable audit has been verified by this frontend task. PR checks and the approved teammate review gate must pass before merge; a fresh agent review is useful technical QA but does not replace the required teammate approval.

## Git history

The sandbox began with local `master` at `a29d35d` and no remote. After the user authorized creating `handled`, a private GitHub repository was created with a README-only `main`. `development` was then created from that remote default and merged into the feature branch without rewriting the existing starter or feature history. Implementation goes through `feat/frontend-foundation` → PR → `development`; main receives no direct push.

## Visual evidence

Production screenshots, captured with reduced motion for stable frames: [desktop landing](screenshots/landing-dark.png), [mobile landing](screenshots/landing-mobile.png), [workspace overview](screenshots/workspace-dark.png). Independent review found short-height overlays and persisted-theme hydration issues; both were reproduced before fixes and now pass in the production browser suite.
