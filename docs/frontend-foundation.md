# Frontend foundation handoff

Primary issues: [SCRUM-87](https://team-singularity.atlassian.net/browse/SCRUM-87), [SCRUM-86](https://team-singularity.atlassian.net/browse/SCRUM-86). Shared foundation; original domain owners remain responsible for their integrated workflows.

## Source and implementation boundary

All current pages in the Handled Notion hub and its Git collaboration reference were read on 15 October 2026, including the Canonical Master Plan, Ownership/Data Contracts/Security Architecture, Commercial Roadmap, Release Gates, Technology Standards, Backend Blueprint, ERD, AI Instructions and Project Pulse. Canonical approved decisions govern scope. Older specs and Pulse counts are not completion evidence.

The current frontend implements reusable UI and explicit sample workflows. It does not satisfy G1 authentication, G2 golden-flow integration or G3 release gates. No domain Jira task should be closed merely because a matching sample screen exists.

## What owners can reuse

- `components/ui`: official shadcn Base UI primitives generated with the original `base-rhea`/Mist configuration. Do not reinitialize the preset.
- `components/shared`: brand, button-styled native links, theme control and section headings.
- `components/motion`: async `LazyMotion` DOM features, visible-by-default reveals and short route entry transitions. The external-store media query prevents reduced-motion hydration differences.
- `components/marketing`: original static SVG aperture with optional desktop pointer/depth motion, static mobile/reduced-motion fallback, and a scroll fold with a content-preserving loading fallback. No WebGL or frame-based render loop.
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

Current local proof: both applications pass lint and typecheck; 111 preserved API unit tests and 14 frontend transport/isolation tests pass; 37 API HTTP/contract tests pass; both production builds pass; desktop/mobile production browser suite passes 31 checks, with one desktop skip for the mobile-only menu case. Browser cases include public navigation, keyboard FAQ and showcase cases, reduced-motion hydration/visibility, mobile sheets, search/filter/empty/reset, workspace-switch cache isolation, scoped next-review navigation, honest auth, source dialogs, local decisions, low-confidence approval blocking, draft editing, theme selection, saved-theme hydration, short-height overlay scrolling and 390–1440px artwork containment.

Public sample deployments: [frontend](https://handled-rafiferdos.vercel.app/) and [API readiness](https://handled-api-zv4h.onrender.com/ready). The frontend uses fixtures and is not yet connected to the separately deployed API. No real Supabase session, database-backed golden flow, provider operation or durable audit has been verified by this frontend task. PR checks and the approved teammate review gate must pass before merge; a fresh agent review is useful technical QA but does not replace the required teammate approval.

## Git history

The sandbox began with local `master` at `a29d35d` and no remote. After the user authorized creating `handled`, a private GitHub repository was created with a README-only `main`. `development` was then created from that remote default and merged into the feature branch without rewriting the existing starter or feature history. Implementation goes through `feat/frontend-foundation` → PR → `development`; main receives no direct push.

## Visual evidence

Production screenshots, captured with reduced motion for stable frames: [desktop landing](screenshots/landing-dark.png), [mobile landing](screenshots/landing-mobile.png), [workspace overview](screenshots/workspace-dark.png). Independent review found short-height overlays and persisted-theme hydration issues; both were reproduced before fixes and now pass in the production browser suite.

The design refinement retains those baseline screenshots and adds [refined desktop](screenshots/refined-landing-dark.png), [refined mobile](screenshots/refined-landing-mobile.png), [visual trust panels](screenshots/refined-trust.png) and [interactive case showcase](screenshots/refined-showcase.png). The showcase uses the existing canonical sample records, validates fixtures on the server and serializes only display fields. The weak-evidence case explicitly requires manual review; changing a case never writes data.

Material policy: small frosted overlays and desktop navigation, translucent product framing, solid reading/form/operational surfaces. Mobile keeps opaque overlays; the optional sculpture pauses offscreen and in hidden tabs. No Three.js or other dependency was added. Three cold local production probes observed loaded compressed script bodies increasing from 385.5 to 410.3 KiB (about 6.4%) for the new interactions, no external resources, and no observed layout shifts. These are local lab observations including prefetch, not field performance or conversion claims. Independent review reproduced a 20px tablet overflow before the fix; the final stage bounds and annotation clearance pass seven widths from 390 through 1440px.

## Delivery

[PR #1](https://github.com/rafiferdos/handled/pull/1) targets `development`. SCRUM-86 and SCRUM-87 are In Review with the branch, test, screenshot and integration-blocker evidence. Local validation is complete; live CI results are on the PR. Merge remains pending the approved checks and real-teammate review gate.

## Expressive refinement — 16 October 2026

The approved graphite + luminous mint direction is documented in [DESIGN.md](../apps/web/DESIGN.md). Public sections now use oversized typography, bounded graphite product scenes, asymmetric context panels, outlined workflow chapters and a shared closing composition. Product/process pages, identity forms, workspace navigation, ticket review, knowledge, activity and settings follow the same visual system. Sample records and business behavior remain unchanged.

Section-specific reveals reuse the existing lazy Motion bundle. Native scroll timelines add progressive hero depth, context movement, workflow connection and navigation progress; unsupported browsers retain composed static content. Fine-pointer interaction is optional. Coarse-pointer hero art is static, reduced-motion changes stop decoration at runtime, and server-rendered content remains readable without JavaScript. No dependency or font was added.

Final frontend verification: lint, typecheck, production build and 14 transport/isolation tests pass. Production Chromium desktop/mobile browser suite: **34 passed, two intentional project-specific skips**. Additional visual checks cover no-JavaScript content, light/dark layouts, mobile and intermediate widths. Independent review caught mobile input sizing and coarse-pointer native motion; both are corrected and rechecked.

Three cold production loads on the same machine at 1440×960 with 4× CPU throttling, followed by a controlled 120-frame full-page scroll, observed:

| Observation | Before | After |
| --- | ---: | ---: |
| Loaded encoded script bodies, including prefetch | 420,133 B | 415,910 B |
| Median local LCP | 120 ms | 140 ms |
| Median CLS | 0 | 0 |
| Median long-task time above 50 ms per task | 35 ms | 36 ms |
| Median scroll frame gaps above 34 ms | 0 | 0 |

The small timing differences are local lab observations, not field performance or a claim that every device is faster. [Raw observations and limitations](evidence/expressive-performance.json) preserve all three runs.

Final production screenshots: [landing](screenshots/expressive-landing-dark.png), [mobile](screenshots/expressive-landing-mobile.png), [context and human control](screenshots/expressive-trust.png), [sample showcase](screenshots/expressive-showcase.png), [product](screenshots/expressive-product.png), [process](screenshots/expressive-process.png), [identity](screenshots/expressive-auth.png), [workspace](screenshots/expressive-workspace.png).

Vercel production follows `feat/frontend-foundation` in the existing free project. Publication does not merge the branch or complete the integration gates.


## Glass and continuous scroll correction — 16 October 2026

The follow-up restores the earlier professional glass depth throughout the visual system. Hero annotations are smoked frosted glass over the silver artwork. Navigation/header use small frosted surfaces, broad marketing/workspace/auth panels use filter-free translucent sheets, and nested diagrams use clear high-fill insets. Dense content keeps reliable contrast. Reduced transparency and forced colors have solid fallbacks. Research and component decisions are recorded in [DESIGN.md](../apps/web/DESIGN.md).

Scroll now changes a sustained scene: four semantic workflow chapters accompany a native sticky illustration. A ticket moves back, payment/policy cards unfold, human review comes forward, then a connected outcome appears. Selected headings have masked word entrances and desktop scroll lighting. Showcase perspective/scale is stronger. Mobile uses short text entrances and a normal four-step reading layout; no JavaScript retains headings, cases and all workflow text. There are no new dependencies or per-frame React state updates.

Validation: frontend lint/typecheck/build and 14 transport/isolation tests pass. Production desktop/mobile browser suite: **37 passed, three intentional project-specific skips**. New regression checks failed on the old production build (opaque hero card and absent scroll story), then passed after implementation. Existing reduced-motion checks caught a 450ms inherited word-opacity transition; the zero-duration correction passes runtime preference switching. Independent review verified 320px auth/home containment, 1024×700 sticky geometry, solid reduced-transparency chrome and the composed lazy-loading fallback.

Three cold local production probes with 4× CPU and a 120-frame full-page scroll observed script bodies 415,910→416,723 B (+813B), median local LCP 152→168 ms, CLS 0→0, median scroll gaps above 34 ms 0→0. Median long-task excess increased 30→54 ms under CPU throttling, reflecting added rendering work. These are bounded lab observations, not field performance or a universal no-slowdown claim. [All runs and limitations](evidence/glass-performance.json).

[Continuous scroll video](videos/glass-scroll-story.webm) · [Glass hero](screenshots/glass-landing-dark.png) · [Mobile](screenshots/glass-landing-mobile.png) · [Question](screenshots/glass-story-question.png) · [Context](screenshots/glass-story-context.png) · [Human review](screenshots/glass-story-decision.png) · [Outcome](screenshots/glass-story-outcome.png) · [Workspace](screenshots/glass-workspace.png) · [Auth](screenshots/glass-auth.png).


## Hero decision studio — 16 October 2026

The hero right side now presents a focused support composition: a large frosted recommendation dossier, conversation and published-policy sheets, a human-review chip and a small cropped silver accent. The artwork stays explicitly illustrative and has no action controls. The main headline and navigation remain unchanged.

Intrinsic grid rows replace percentage-based placement for reading cards. An initial overlap between policy and review content was reproduced at 320–1440px, then removed; the production browser regression now checks sheet clearance and stage containment at eight widths. Optional desktop pointer tilt affects the whole studio within 3 degrees; it pauses offscreen/in hidden tabs. Coarse/reduced-motion and no-JavaScript show the complete static composition. The scene stays mounted while pointer capabilities change, avoiding hydration replacement and preserving its reading layout.

Frontend lint/typecheck/build, 14 transport tests and the full production browser suite pass: **37 passed, three intentional device-specific skips**. Independent visual review confirms readable cards and separate review/policy content at 320, 390, 768, 1024 and 1440px. The frost assertion polls the mounted surface; the final motion wrapper retains the scene DOM across hydration and live preference changes.

Three cold production probes with 4× CPU throttling observed 415,312 B of loaded script bodies, CLS 0 and no scroll gaps above 34 ms. Compared with the recorded previous release, script bodies decreased 1,411 B; local median LCP was 168→180 ms and long-task excess 54→86 ms. The richer scene adds rendering work. These separate-session lab observations are not a field-performance claim. [Raw observations and comparison limits](evidence/hero-studio-performance.json).

[Desktop hero](screenshots/hero-studio-desktop.png) · [Right-side detail](screenshots/hero-studio-detail.png) · [Mobile studio](screenshots/hero-studio-mobile.png).


## Open aperture hero — 16 October 2026

The enclosed card board has been replaced by an original sculptural glass aperture. A beveled silver/mint rim, internal reflections and a smoked lens hold the Handled mark. Unboxed conversation and published-knowledge stations feed the center; a compact frosted strip states that the decision stays human. Light/dark palettes keep source labels readable, and the strip uses 84% smoked fill for small-text contrast. This visual remains explicitly a sample workflow.

The design research compared React Bits Light Rays, Aceternity Lamp/Hub heroes and Magic UI Animated Beam. [Reference decisions](../apps/web/DESIGN.md#hero-reference-study--16-october-2026) explain the original SVG/CSS implementation. No component code, paid asset, new library or WebGL shader was copied or installed. Entrance, short converging beams, pointer depth and separate scroll transforms for the outer rim and inner lens reuse existing motion infrastructure. Coarse pointers and reduced motion show the finished static drawing; changing preferences preserves content.

Final lint, explicit typecheck, 14 transport tests and production build pass. The production desktop/mobile suite passes **37 checks with three intentional device-specific skips**. Existing layout checks now verify all three reading annotations stay contained and do not overlap at eight widths from 320 to 1440px. A separate final-build probe confirms no-JavaScript content, actual scroll-transform progression, live reduced-motion shutdown and no page errors. Independent source/screenshot review found no blocker; its light-theme contrast recommendation is included. No Chrome control was used.

Fresh before/after production measurements in the same session observed loaded encoded script bodies 415,312→416,181 B (+869 B), median local LCP 176→172 ms, CLS 0→0, median long-task excess 81→91 ms and median scroll gaps above 34 ms 0→0 under 4× CPU. These are bounded local observations, not a field-performance guarantee. [All runs and limitations](evidence/aperture-performance.json).

[Desktop](screenshots/aperture-hero-desktop.png) · [Aperture detail](screenshots/aperture-hero-detail.png) · [Mobile](screenshots/aperture-hero-mobile.png).
