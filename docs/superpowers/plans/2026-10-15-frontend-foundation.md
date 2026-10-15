# Frontend Foundation Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user explicitly requested immediate implementation and frequent meaningful commits.

**Goal:** Establish the approved Handled frontend with reusable shells, an expressive landing page and honest integration boundaries.

**Architecture:** Preserve the existing starter in `apps/web` in a pnpm workspace. Preserve verified NestJS source in `apps/api` without changing its behavior. Separate public marketing, auth and sample dashboard routes.

**Tech Stack:** Existing Next 16.4 / React 19.3 / Tailwind 4 / shadcn Base UI Mist preset; compatible security patch, Motion, Sonner, TanStack Query, React Hook Form and Zod.

**Spec:** `docs/superpowers/specs/2026-10-15-frontend-foundation-design.md`

## Global Constraints

- Preserve preset, backend, domain ownership, secrets and branch history.
- Explicit preview mode; never fabricate a session, payment effect or provider integration.
- All applicable controls come from shadcn; accessibility and reduced motion are required.
- Follow installed Next docs, including async params and the current error-boundary `retry` API.

## Review Focus

- Workspace switches must never show another workspace's cached tickets.
- Auth form success must not imply a real login or email.
- Malformed, HTML, expired-session and timeout responses must fail safely.
- Mobile navigation and overlays must retain keyboard access and readable layouts.
- Reduced motion must keep content visible and stop decorative animation.

### Task 1: Preserve applications in the workspace

Files: root package/workspace/config, `apps/web/*`, verified `apps/api/*`, provenance notes.

- [x] Move starter without resetting components or tokens; preserve backend source if verified.
- [x] Patch Next to the official compatible security release, pin runtime/package manager and add only used dependencies.
- [x] Verify workspace scripts and typechecking; commit architecture separately.

### Task 2: Build design primitives and animation foundation

Files: `apps/web/components/ui/*`, providers, branding, theme control, Motion wrappers, global CSS.

- [x] Add official preset-compatible shadcn components without overwriting the installed button.
- [x] Preserve Mist values, add semantic spacing/status tokens, local font assets and accessible theme control.
- [x] Add lazy Motion features and reduced-motion-safe wrappers; verify types; commit.

### Task 3: Deliver cinematic public product page

Files: marketing route group, marketing components and code-native decorative SVG.

- [x] Write browser acceptance cases for CTA navigation, FAQ keyboard operation and mobile navigation; observe missing behavior.
- [x] Build Liquid Sculpture and Glass Fold with mobile/reduced-motion fallbacks and truthful sample product narrative.
- [x] Verify desktop/mobile rendering and interactions; commit landing sections in coherent slices.

### Task 4: Add typed boundaries and sample dashboard

Files: `apps/web/lib/api/*`, `features/*`, dashboard routes, auth routes.

- [x] Write failing transport and tenant-isolation tests using Node's built-in test runner.
- [x] Implement runtime schemas, timeout/error handling and explicit read-only mock adapter; run tests to green.
- [x] Add shadcn auth forms with honest unavailable state, dashboard navigation, ticket filters/detail, knowledge/activity/settings sample pages and loading/error/empty states.
- [x] Verify invalid forms, empty search, workspace switching and sample decision feedback; commit each meaningful unit.

### Task 5: Verify and hand off

Files: smoke tests, README, frontend handoff/proof, PR description.

- [x] Run lint, typecheck, unit tests, production build and browser smoke checks.
- [x] Fresh-context whole-branch review; fix significant findings and rerun affected checks.
- [ ] Record exact proofs and integration blockers; update Jira with real commits and status.
- [ ] Push feature branch and create PR to development if remote/credentials permit; merge only after checks and required peer review.
