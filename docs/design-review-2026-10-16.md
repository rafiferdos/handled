# Handled visual design review — 16 October 2026

Baseline snapshot before the approved refinement pass. The recommendations below are implemented in the [UI refinement release](ui-refinement-2026-10-16.md); retain these scores and screenshots as the before-state record.

**Overall judgment: approximately 8.0/10. Homepage: 8.2/10.** The identity is coherent and distinctive. The largest remaining gains are readable small text, more purposeful mobile density and greater variation between chapters. Extra animation is a lower priority than these improvements.

Scores are subjective editorial judgments, not instrument measurements, user-study findings or integration-readiness scores. A difference of 0.2 should be read as a small preference, not scientific precision. Working authentication, account connections and durable activity are assessed separately from visual quality.

## Scope and evidence

Reviewed the current production build through fresh desktop/mobile screenshots, current TSX/CSS, existing browser interactions and 36 route/width layout checks: 12 routes at 390, 900 and 1440px. Ticket detail also has a 1200px screenshot. Screenshots mostly use reduced motion for stable comparison; the workflow at 0.8 progress uses normal motion. The mobile navigation panel also uses the preceding verified navbar capture because its geometry did not change.

There was no horizontal overflow in these 36 layout checks and no captured page errors. Default rendered states contained no visible “sample” wording. These observations do not establish every possible viewport, interaction or assistive-technology combination. [Raw layout observations](evidence/design-audit-layout.json).

Isolated section screenshots hide fixed/sticky header and skip-link overlays during capture; normal viewport screenshots preserve the real interface. Capture artifacts are excluded from scores.

## Copy changes applied

Repeated labels such as “SAMPLE WORKFLOW,” “Sample proposal,” “Choose a sample case,” repeated KPI markers and per-feature Sample badges now use normal product language. Main action labels identify their actual destination: Open ticket inbox, Review proposal, Browse knowledge and View activity.

One short status remains in the interactive showcase: **“Example data. No account changes.”** The workspace shares a single persistent notice: **“Example data. Accounts are not connected and actions stay local.”** Auth still reports that it creates no session/account/email. Reply editing and decision rehearsal still explain that they do not send messages or change accounts. Removing those facts would make the interface harder to understand. Internal fixture identifiers and isolation logic remain unchanged.

## Homepage section ratings

| Section | Desktop | Mobile | What works | What would improve it |
| --- | ---: | ---: | --- | --- |
| Navigation | 8.5 | 8.4 | Balanced floating shell, centered destinations, clear mint action, labeled mobile menu. | Desktop destination/login text is 11px; consider 12px. Simplify the nested center capsule slightly to reduce framing. Keep 44px targets. |
| Hero | 8.7 | 8.0 | Distinctive aperture, strong two-line headline, controlled light and a clear human-decision message. | Mobile section is about 1051px tall. Recover 40–70px through vertical spacing and illustration placement. Meaningful diagram labels fall to 5–8px; simplify them or use 10–11px rather than making the whole illustration smaller. |
| Product showcase | 8.3 | 7.8 | The light application surface gives concrete product evidence and welcome contrast. Case selection has a clear relationship to its content. | In the desktop section capture, heading ends around y312 and the product frame starts around y570. Compress the pedestal/control sequence by 40–60px. Mobile is long; reduce ornamental space before reducing readable content. |
| Approach / trust | 8.6 | 7.9 | Strong source-to-decision illustrations, asymmetric 7:5 columns, 24px gap and 56px stagger. Light theme is especially clear. | At mobile width this becomes several similar tall panels. Simplify one diagram and shorten its footprint. Raise meaningful 8–9px source metadata toward 11–12px. |
| Workflow | 8.3 animated; 7.8 static | 7.8 | Clearly separated phases, visible progress and a contained decision scene. | Static cards repeat large numbers and green framing already used elsewhere. Normalize title wrapping and shorten the mobile reading stack. Keep the existing motion boundaries; add no scroll trapping. |
| FAQ | 8.0 | 8.0 | Calm structure, 18px corners, 12px gaps, comfortable 24px vertical trigger padding. | Mobile question text is 13px; try 14–15px. Simplify the assurance card into an inline note to vary the surface rhythm. |
| Closing action | 8.6 | 7.8 | Effective visual bookend, clear action, restrained echo of the hero aperture. | Mobile 440px minimum panel height and space-between leave roughly 175px between the heading and action. Test 360–380px, or give that space a more deliberate visual purpose. |
| Footer row | 8.0 | 7.8 | Restrained, aligned and easy to scan on desktop. | Increase copyright 10→11px. Mobile account link wraps onto a lonely second line; use an intentional two-column link arrangement. |

The mobile workflow rating covers the static fallback. The animated desktop decision card at progress 0.8 was visible with opacity about 0.746 and bounds y227–487 in a 700px viewport; the scene was not empty at that measured point.

[Desktop overview](screenshots/audit-home-desktop.png) · [Full homepage](screenshots/audit-home-full.png) · [Mobile](screenshots/audit-home-mobile.png) · [Mobile hero](screenshots/audit-hero-mobile.png) · [Showcase](screenshots/audit-showcase.png) · [Trust](screenshots/audit-trust.png) · [Light trust](screenshots/audit-trust-light.png) · [Workflow at 0.8](screenshots/audit-workflow-080.png) · [Mobile workflow](screenshots/audit-workflow-mobile.png) · [FAQ](screenshots/audit-faq.png) · [Mobile footer](screenshots/audit-footer-mobile.png).

## Secondary marketing sections

| Surface | Score | Assessment and concrete refinement |
| --- | ---: | --- |
| Product hero | 8.7 | Strong 102.4px desktop heading and useful negative space. At mobile, test top padding 80→56px and selected 28–40px gaps→20–28px so product evidence appears earlier. |
| Product workspace showcase | 8.6 | Strong visual proof with a light surface. Apply the same spacing/readability refinement as the home showcase. |
| Feature 01 — inbox | 8.2 | Clear three-case representation. Raise miniature 11px row content to 12px where feasible and meaningful 8px labels toward 10px. |
| Feature 02 — recommendation | 8.0 | Clear title and action; three-row miniature resembles the inbox too closely. A reply excerpt with source chips would explain this capability better. |
| Feature 03 — knowledge | 8.2 | Versioned source references are useful. Give source/version hierarchy more distinction instead of relying on the same row motif. |
| Feature 04 — outcome | 8.0 | Good semantic sequence. A small connected event relationship would explain the result better than another three-row list. |
| Product overall | 8.4 | Preserve the asymmetric grid; differentiate its artifacts. |
| Process introduction | 8.5 | Memorable headline and clear four-stage framing. Reduce mobile top spacing before changing the headline scale. |
| Intake chapter | 8.0 | Clear entry point. Replace the reinforcing sentence box with a compact ticket example if it adds information. |
| Investigation chapter | 8.0 | Readable explanation; a records-to-policy example could establish the relationship more concretely. |
| Human-review chapter | 8.1 | Most important decision point. A short source/reply comparison would make the checkpoint more visible. |
| Outcome chapter | 7.7 | The relationship is mostly described in prose. A concise decision/result relationship would add evidence. |
| Process overall | 8.1 | Current 0.75:1.25 columns give the number lane 37.5% before the gap. Test a roughly 28% left track; body copy can move from 14px toward 16px. Preserve the editorial reading order. |

[Product hero](screenshots/audit-product-hero.png) · [Feature grid](screenshots/audit-product-features.png) · [Mobile product](screenshots/audit-product-mobile.png) · [Process](screenshots/audit-process-full.png) · [Mobile process](screenshots/audit-process-mobile.png).

## Authentication and workspace ratings

| Surface | Score | Assessment and concrete refinement |
| --- | ---: | --- |
| Login | 8.5 | Balanced desktop composition and composed mobile form. Keep the 44px inputs. A mode-neutral account-access notice would work more consistently across all auth forms. |
| Signup | 8.3 | Clear field sequence and action; the longer card requires more scrolling. Keep the introduction compact and avoid additional panels above the form. |
| Password recovery | 8.2 | Clear single-field flow. A quieter composition and shorter supporting illustration would better match the small task. |
| Workspace shell | 8.0 | Clear 256px rail, 72px header and 44px navigation targets. Remove the external-link-style arrow on the internal Ticket inbox destination. Keep the single status strip compact. |
| Overview, desktop | 8.1 | Clear queue and next-review action. KPI cards are about 192px high for little content; test roughly 160px by reducing card gap 20→12px, header bottom padding 16→8px and value size 48→44px. |
| Overview, mobile | 7.1 | At 390×844, the first viewport shows only the first two large KPI cards; the queue is below the third. Three compact approximately 96px rows, or a carefully fitted summary grid, could recover 280–400px. |
| Ticket inbox | 8.1 | Good alignment and restrained statuses. Subject 12→14px and metadata 11→12px would improve scanning. Align the filter controls with search height. |
| Ticket detail, 1440px | 8.3 | Conversation and recommendation have a useful side-by-side relationship. Proposal reading text can move from 12px toward 13–14px. |
| Ticket detail, 1200px | 7.4 | The split begins at 1280px, putting the recommendation below the full conversation/context stack at 1200px. Test a 1200px split around 486px conversation + 350px recommendation + 28px gap. Use sticky positioning only when the panel fits. |
| Knowledge | 8.2 | Balanced cards and useful source/version references. A visible “Read policy” label would improve discovery over an arrow alone. |
| Activity | 7.6 | Coherent sequence and honest empty state. Remaining architecture terms belong in documentation; explain the user-visible event and next step more directly. |
| Settings | 7.9 | Clear organization. The theme Select is about 32px tall beside 44px workspace fields; align their actual rendered sizes. |

An actual control sizing inconsistency is source- and screenshot-supported: the shared Select uses `data-[size=default]:h-8`, which can override ordinary caller `h-10`/`h-11`. Caller overrides with matching size selectors should restore 40–44px controls. The workspace picker already uses this pattern. This is separate from the subjective style recommendations.

Operational headings are 42.4px on desktop. Consider 34–36px, heading bottom spacing 36→28px and main top padding 44→32px to put work earlier. These are proposed values for a follow-up, not implemented changes.

[Login](screenshots/audit-login.png) · [Mobile login](screenshots/audit-login-mobile.png) · [Signup](screenshots/audit-signup.png) · [Recovery](screenshots/audit-forgot-password.png) · [Overview](screenshots/audit-dashboard.png) · [Mobile overview](screenshots/audit-dashboard-mobile.png) · [Inbox](screenshots/audit-tickets.png) · [Detail 1440](screenshots/audit-ticket-detail.png) · [Detail 1200](screenshots/audit-ticket-detail-1200.png) · [Knowledge](screenshots/audit-knowledge.png) · [Activity](screenshots/audit-activity.png) · [Settings](screenshots/audit-settings.png).

## Recommended order

1. **Readable, consistent controls:** fix actual Select heights and raise essential operational text. Small text currently limits comfort more than the illustration style does.
2. **Useful mobile density:** compact dashboard metrics, shorten hero/closing spacing and bring the queue/evidence earlier.
3. **Laptop review layout:** preserve the conversation/recommendation relationship around 1200px.
4. **Section variation:** distinguish feature artifacts and reduce repeated large numbers, paired headings and mint glass panels.
5. **Small finishing details:** footer wrapping, title wrapping, source-label hierarchy and visible read actions.

The copy cleanup is implemented. The geometry, type-scale and illustration refinements above are recommendations for the next design pass. No new animation library, backend integration or action behavior was introduced by this review.

## Verification for the copy release

Frontend lint, explicit typecheck, 14 transport/isolation tests and production build passed. Final production desktop/mobile browser suite: **47 passed, seven intentional device-specific skips**. Existing text selectors were updated to match the cleaner labels; behavior and sample-data isolation remain covered. The 36 layout observations found zero horizontal overflow, zero page errors and zero visible “sample” mentions in captured default states. Publication and CI status are reported separately after the live release check.
