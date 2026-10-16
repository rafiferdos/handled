# Company workspace refinement — 16 October 2026

A company should recognize its workspace while its support team works. The dashboard now includes an active company identity and a dedicated Company profile destination. This is frontend preparation for the eventual authenticated workspace API; no business API or billing integration is added.

## Behavior

- Active company name is visible in the 72px header on mobile and desktop. The sidebar selector shows the company logo or initials and its saved name. Stable workspace IDs/slugs still control record isolation.
- Company profile includes name, local logo, website, support contact, industry and IANA time zone. Saving updates the current preview across internal navigation; reload resets the profiles. Each company's saved preferences and unsaved drafts remain separate.
- Logo input accepts decoded PNG/JPEG/WebP up to 512 KiB and 4096px per dimension. SVG, corrupt and oversized inputs are rejected without replacing the saved logo. Async reads are invalidated on cancellation, replacement and unmount. No upload or server write is performed.
- Validation explains invalid names, HTTPS URLs, email addresses and time zones, and focuses the first invalid field. Cancel restores saved values. Profile comparison does not serialize logo data on each keystroke.
- Setup status explicitly shows account/team, subscription and support channels as not connected. A support contact address does not connect a mailbox. No paid plan, seat count, live API key or customer form URL is fabricated.
- Overview exposes a useful company card and actual scoped policy count. Inbox and knowledge descriptions follow the active workspace; ticket dates use the record timestamp and selected company time zone.
- Settings links to the company profile. Mobile navigation dismisses on route selection, history navigation and desktop resize. Dialog/sheet close targets are 44px and reserve title clearance. Long identity text is contained at 320px.

## Verification

The first new company destination regression failed against the previous production build before implementation. Final production Chromium desktop/mobile suite: 75 passed, seven intentional device-specific skips. New tests cover profile editing, reload reset, no server writes, company/record/logo isolation, validation/cancel, invalid images, 80-character unbroken names, 44px controls and mobile navigation transitions. Existing approval, cache isolation, auth honesty and motion checks remain green.

Independent source review identified an empty-state long-name overflow, fixed with neutral workspace wording. Dark/light desktop, mobile, long-name and all dashboard route/width checks are recorded in the linked evidence. Production build and frontend checks pass; hosted release verification is recorded after publication.

[Desktop company profile](screenshots/company-desktop.png) · [Mobile company profile](screenshots/company-mobile.png) · [Light company profile](screenshots/company-light.png) · [Overview](screenshots/company-overview.png) · [Mobile overview](screenshots/company-overview-mobile.png) · [Long company name](screenshots/company-long-name-mobile.png) · [Layout observations](evidence/company-workspace-layout.json) · [Performance observations](evidence/company-workspace-performance.json).

## Integration boundary

Company preferences are browser-memory preview state. The API, authentication, durable company profiles, billing, member permissions and incoming support channels remain unconnected. Production account identity and profile editing permissions must come from the authenticated tenant-scoped backend when that separate integration is implemented. This release does not claim those services are complete.

## Measured performance

Three local production runs per version under 4× CPU show loaded dashboard scripts 393,595→390,219 bytes (including automatic prefetch), median LCP 68→68ms and long-task excess 34→33ms. All runs observed CLS 0, zero scroll-frame gaps above 34ms and no external resource requests. No dependency is added. These short local measurements bound this change; they do not predict real-user network/device performance.

Workspace `pnpm check` passed: frontend lint/types, 16 frontend unit tests, 111 preserved API unit tests and both production builds. The 49 dashboard route/width observations (seven routes, 320–1440px) show no horizontal overflow or page errors. Settled dark/light screenshots were inspected; a transient capture made before theme inheritance settled was replaced after verifying a fresh light-theme load.
