# Handled design system

Approved direction: **graphite + luminous mint**, expressive editorial composition, evidence before action, and people in control. Refine the existing product; preserve its shadcn Base UI / Mist foundation and honest sample boundaries.

## Visual language

- Graphite is the stage, silver is the material, mint is the signal. Use the additive `signal`, `signal-foreground` and `signal-surface` tokens. Light mode uses a darker green for readable text; dark mode uses luminous mint. Success and warning remain separate semantic states.
- Use Outfit for expressive headings, Inter for reading and controls, Geist Mono for short references. Do not introduce more fonts or remote font requests.
- Marketing uses generous negative space, oversized balanced headlines, asymmetric panels, outlined chapter numbers, and one clear action per composition. Alternate light reading surfaces with bounded graphite product scenes.
- Operational screens are calm: solid reading surfaces, visible labels, aligned controls, clear states. Essential metadata is at least 11px; decorative diagram microcopy may be smaller. Body copy is normally 14–16px. Keep primary actions and inputs comfortably usable on touch screens.
- Use mint on selected navigation, clear actions, source connections, and small emphasis. Avoid tinting every surface. Avoid fake customers, invented metrics, fabricated provider activity or claims that planned features work.

## Layout and surfaces

Keep the 76rem page container. Use a 24px mobile gutter and scale desktop gutters from the existing system. Give cards consistent internal spacing and enough room for actual headings. Reserve translucent materials for small decorative overlays and desktop navigation. Forms, reading surfaces and mobile overlays remain opaque.

Hero artwork and annotations must fit from 390px through tablet and desktop widths. Test 768, 900, 1024 and 1200px explicitly, not only the extremes. At narrow widths, stack content in reading order and keep the main action visible without elaborate motion.

## Motion language

Motion expresses the support story: question → context → human decision → traceable outcome.

- **Hero:** existing static SVG artwork, optional fine-pointer interaction, and small native scroll depth between artwork and evidence annotation. The text stays stable and visible.
- **Showcase:** one existing scroll fold, short evidence-card sequencing and an outcome reveal when the user selects a case. Case selection remains keyboard controlled; scrolling never changes data or decisions.
- **Trust:** complementary decorative context-card movement; every source label remains readable at rest. Keep the human checkpoint visually distinct.
- **Workflow:** native scroll-linked connector progression and large numbered chapters. No scroll trapping or long pinned sequences.
- **Product/process:** distinct `Reveal` presets (`rise`, `panel`, `left`, `right`, `scale`) with no more than 180ms stagger. Entrance duration is 550–650ms; operational navigation remains quick.
- **Workspace:** short heading arrival, modest hover/focus feedback. Rows and critical action controls stay steady.

Only animate transforms and opacity for new decorative effects. Use native CSS scroll timelines as progressive enhancement with a fully composed static fallback. Reuse Motion's existing lazy feature bundle; do not add another animation library, character-splitting system, WebGL, perpetual marquee, or React state updates on every scroll frame. Do not animate backdrop blur, large shadows or layout dimensions.

## Accessibility and performance contract

Server-rendered content is visible by default, with or without JavaScript. Animation must never be required to reveal a heading or use a control. Respect reduced-motion preferences, including changes while the page is open. Coarse-pointer devices use static hero artwork; the optional interactive sculpture stops offscreen and in hidden tabs.

Preserve semantic landmarks, keyboard tabs/accordions, focus indicators, explicit form labels, and existing sample isolation. Do not create a fake authenticated session or connect the live API as part of a visual change.

Measure production builds before and after under the same conditions. Compare loaded script bytes, LCP, CLS and controlled scrolling; a single fast local result is not field performance. Target zero dependencies and no material JavaScript growth (ideally under 5 KiB gzip). Investigate layout shifts or repeatable timing regressions before publishing.

## Verification

Run frontend lint, typecheck, transport/isolation tests, the production build and existing desktop/mobile browser tests. Include coarse-pointer and live reduced-motion preference checks. Inspect dark/light desktop, mobile and intermediate widths visually. Verify the public deployment after release; local checks do not prove a deployed release.
