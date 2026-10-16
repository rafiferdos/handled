# Readable, compact UI refinement — 16 October 2026

The approved [design review](design-review-2026-10-16.md) is implemented across the existing public, identity and workspace surfaces. Graphite/mint, the aperture hero, small frosted chrome and the original Base UI/Mist foundation remain the shared language. No dependency, bitmap, external asset, animation loop or API integration was added.

## Priority operational changes

| Area | Before | Implemented result |
| --- | --- | --- |
| Mobile summary | Three roughly 192px metric cards pushed the queue heading below 1112px. | Three 64px rows retain counts, labels and icons; redundant notes are hidden below 640px. At 390×844, the queue heading ends at 667.6px and the first ticket occupies 708.6–829.8px. |
| Desktop summary | Approximately 192px cards and 42.4px headings. | Approximately 160px cards and 36px headings, with tighter content spacing. |
| Reading text | Subjects/replies 12px; important metadata 11px. | Subjects/replies 14px, supporting reading 13–14px and important metadata 12px. Mobile text inputs retain 16px to avoid zoom. |
| Controls | Search 40px; Selects 32px; some actions/tabs smaller. | Search, filters, theme, decision selector, edited actions and ticket tabs provide at least 44px rendered targets. Caller-specific size variants fix the Select cascade without changing primitives. |
| Laptop review | Recommendation followed the full conversation below 1280px. | At 1200px, conversation is about 486px, gap 28px and recommendation 350px. Its position stays static so short windows retain normal scrolling. |
| Knowledge/activity | Icon-only reading action and internal architecture wording. | Visible Read policy action; Activity explains user outcomes and keeps the clear local/example status. |

The new regression file reproduces all six baseline failures before implementation. It checks rendered dimensions, first subject viewport visibility, filtering/dialog behavior, readable text, actual tab/Select sizing and laptop containment. It does not rely on class-name presence alone.

[Mobile overview](screenshots/usability-dashboard-mobile.png) · [Desktop overview](screenshots/usability-dashboard.png) · [Inbox](screenshots/usability-tickets.png) · [1200px review](screenshots/usability-ticket-laptop.png) · [Knowledge](screenshots/usability-knowledge.png) · [Settings](screenshots/usability-settings.png).

## Public and identity polish

- Navigation uses 12px destination/login text and a quieter center frame while preserving 44px targets and the labeled mobile menu.
- Hero annotations use shorter labels and readable 10–11px typography instead of 5–8px labels. Small-scene annotation clearance was adjusted visually. The 390px hero is 979.25px tall, approximately 72px shorter than the baseline; desktop composition remains intact.
- The showcase reduces the heading/pedestal/control sequence by roughly 50px and uses larger 11–12px metadata/reading labels. Existing case selection, native unfold and focus-preserving wrapper remain.
- Trust diagrams use readable source/payment/version labels. Mobile removes decorative connector scaffolding and the duplicate center emblem; the provenance section becomes a quiet top-rule composition.
- Static/mobile workflow becomes compact editorial steps. Desktop phase timing, eligibility and value-driven motion remain. Across 1024×700 and 1440×700 normal-motion scenes, fully visible source cards clear the progress line by at least 31px; decision/receipt layers remain contained.
- FAQ question text grows to 14px on mobile; the assurance becomes a simple inline note. Closing minimum height reduces 440→370px on mobile. Footer links use an intentional two-column mobile arrangement and copyright grows to 11px.
- Product features now have distinct static artifacts: inbox rows, source-backed reply draft, versioned policy sheet and connected case record. Mobile introductions are shorter.
- Process chapters use a 28% number lane, 16px body copy and concrete ticket/source/review/outcome examples.
- Authentication uses a compact mode-neutral account-access note, 44px header targets and a quieter recovery composition. Existing validation and no-session/account/email outcomes remain.

[Desktop home](screenshots/usability-home-desktop.png) · [Mobile hero](screenshots/usability-hero-mobile.png) · [Showcase](screenshots/usability-showcase.png) · [Trust](screenshots/usability-trust.png) · [Mobile trust](screenshots/usability-trust-mobile.png) · [Light trust](screenshots/usability-trust-light.png) · [Mobile workflow](screenshots/usability-workflow-mobile.png) · [FAQ](screenshots/usability-faq.png) · [Mobile footer](screenshots/usability-footer-mobile.png) · [Feature artifacts](screenshots/usability-product-features.png) · [Process](screenshots/usability-process-chapter.png) · [Recovery](screenshots/usability-forgot-password.png).

## Verification

Final frontend lint, explicit typecheck, 14 transport/isolation tests and production build passed. Production Chromium desktop/mobile suite: **59 passed, seven intentional device-specific skips**. This includes six new regressions executed in both projects. Independent source and focused screenshot review found no blocker. The final small-screen hero adjustment also passed the whole browser suite and refreshed layout capture.

The final production layout pass covers **84 route/width combinations**:12 routes at 320, 390, 768, 900, 1024, 1200 and 1440px. No horizontal overflow or page errors were observed. Dark/light, mobile, reduced motion and ten normal-motion workflow stages at 700px height were captured. [Raw layout observations](evidence/ui-refinement-layout.json).

No Chrome control was used. No business operation, account connection, live authentication or durable activity was introduced by these visual changes.

## Bounded performance comparison

Three cold loads per version/route, 4×CPU, cache disabled, no network throttle. Script bytes include automatic prefetch.

| Metric, median | Homepage before → after | Mobile dashboard before → after |
| --- | --- | --- |
| Local LCP |184→176ms|72→76ms|
| CLS |0→0|0→0|
| Encoded loaded scripts |414, 791→414, 469B|388, 475→393, 595B|
| Long-task excess |85→79ms|37→38ms|
| Scroll frame gaps above 34ms |0→0|0→0|

Homepage loaded scripts decreased 322B; dashboard totals increased 5120B and include an additional automatically loaded script. This measurement does not isolate component code from route prefetch. Homepage median CLS remains zero, with one after run observing 0.000017724; dashboard CLS was zero in every run. The timings show no material local regression, while remaining too small and bounded to establish field performance. [Every run and limitations](evidence/ui-refinement-performance.json).
