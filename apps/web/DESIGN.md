# Handled design system

Approved direction: **graphite + luminous mint**, expressive editorial composition, evidence before action, and people in control. Refine the existing product; preserve its shadcn Base UI / Mist foundation and honest sample boundaries.

## Visual language

- Graphite is the stage, silver is the material, mint is the signal. Use the additive `signal`, `signal-foreground` and `signal-surface` tokens. Light mode uses a darker green for readable text; dark mode uses luminous mint. Success and warning remain separate semantic states.
- Use Outfit for expressive headings, Inter for reading and controls, Geist Mono for short references. Do not introduce more fonts or remote font requests.
- Marketing uses generous negative space, oversized balanced headlines, asymmetric panels, outlined chapter numbers, and one clear action per composition. Alternate light reading surfaces with bounded graphite product scenes.
- Operational screens are calm: solid reading surfaces, visible labels, aligned controls, clear states. Essential metadata is at least 11px; decorative diagram microcopy may be smaller. Body copy is normally 14–16px. Keep primary actions and inputs comfortably usable on touch screens.
- Use mint on selected navigation, clear actions, source connections, and small emphasis. Avoid tinting every surface. Avoid fake customers, invented metrics, fabricated provider activity or claims that planned features work.

## Layout and surfaces

Keep the 76rem page container. Use a 24px mobile gutter and scale desktop gutters from the existing system. Give cards consistent internal spacing and enough room for actual headings. Use three optical tiers throughout the site: frosted chrome for navigation and floating hero cards; translucent, filter-free sheets for broad product/workspace/auth panels; clear high-fill insets for nested content. Dense reading areas retain stable contrast. Mint/silver ambient lighting makes material depth visible. Keep blur static, limited to small chrome areas (14–16px desktop, 8px mobile); never stack blurred content panels.

Hero artwork and annotations must fit from 320px through tablet and desktop widths. Test 768, 900, 1024 and 1200px explicitly, not only the extremes. At narrow widths, stack content in reading order and keep the main action visible without elaborate motion.

## Motion language

Motion expresses the support story: question → context → human decision → traceable outcome.

- **Hero:** an open luminous aperture with a substantial beveled glass rim, smoked inner lens and Handled mark. Two unboxed source stations feed the lens; one compact frosted strip grounds the human decision. No enclosing board or large dossier. Directional light, thin orbits and short converging beams provide the visual hierarchy. Entrance is sequenced once per viewport entry; the outer rim and inner lens separate on native scroll timelines. Fine-pointer tilt remains within 3 degrees. Pause decoration offscreen/in hidden tabs and retain a composed static scene for coarse pointers, reduced motion and no JavaScript. Keep scene DOM stable across preference changes. Masked words rise into the existing two-line headline; full text is server-visible with one accessible heading name.
- **Showcase:** a 16-degree perspective unfold with a 72px rise and 0.92-to-1 scale, short evidence-card sequencing and an outcome reveal when the user selects a case. Case selection remains keyboard controlled; scrolling never changes data or decisions.
- **Trust:** complementary decorative context-card movement; every source label remains readable at rest. Keep the human checkpoint visually distinct.
- **Workflow:** four real reading chapters beside a native sticky decorative scene. Ticket, records/policy, human review and outcome layers unfold with continuous MotionValues. Load the scene near the viewport; the loading and no-JavaScript artwork use an intentional static composition. Sticky motion requires a fine pointer, at least 1024px width and 700px height. Mobile, short windows and reduced motion use normal four-step cards. No scroll trapping.
- **Product/process:** selected headings use masked word rise/rotation and scroll-linked word lighting. Desktop word entrances last 850ms with a bounded stagger; mobile entrances are 600ms and shorter. General `Reveal` presets remain 550–650ms; operational navigation stays quick.
- **Workspace:** short heading arrival, modest hover/focus feedback. Rows and critical action controls stay steady.

Only animate transforms and opacity for new decorative effects. Use native CSS scroll timelines as progressive enhancement with a fully composed static fallback. Reuse Motion's existing lazy feature bundle; do not add another animation or splitting library, WebGL, perpetual marquee, or React state updates on every scroll frame. Do not animate backdrop blur, large shadows or layout dimensions.

## Accessibility and performance contract

Server-rendered content is visible by default, with or without JavaScript. Animation must never be required to reveal a heading or use a control. Respect reduced-motion preferences, including changes while the page is open. Reduced transparency produces solid chrome/panels, and forced colors uses system colors. Coarse-pointer devices use static hero artwork; the optional interactive sculpture stops offscreen and in hidden tabs.

Preserve semantic landmarks, keyboard tabs/accordions, focus indicators, explicit form labels, and existing sample isolation. Do not create a fake authenticated session or connect the live API as part of a visual change.

Measure production builds before and after under the same conditions. Compare loaded script bytes, LCP, CLS and controlled scrolling; a single fast local result is not field performance. Target zero dependencies and no material JavaScript growth (ideally under 5 KiB gzip). Investigate layout shifts or repeatable timing regressions before publishing.

## Verification

Run frontend lint, typecheck, transport/isolation tests, the production build and existing desktop/mobile browser tests. Include coarse-pointer and live reduced-motion preference checks. Inspect dark/light desktop, mobile and intermediate widths visually. Verify the public deployment after release; local checks do not prove a deployed release.


## Material and motion research — 16 October 2026

This project uses a hybrid glass system rather than applying refraction to every content surface. This is a project-specific design decision, not a universal SaaS rule. [Apple materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials) emphasizes hierarchy, legibility and selective functional glass. [Microsoft acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) warns about broad/nested acrylic and GPU cost. Those principles support small frosted chrome plus filter-free readable sheets here.

[React Bits Glass Surface](https://reactbits.dev/components/glass-surface), [Scroll Reveal](https://reactbits.dev/text-animations/scroll-reveal) and [Scroll Float](https://reactbits.dev/text-animations/scroll-float) were evaluated as visual references. The [official ScrollReveal source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx) uses GSAP/ScrollTrigger; this project already uses Motion. The implementation is original and reuses the installed Motion bundle, with no React Bits/GSAP dependency or copied component. [Motion scroll values](https://motion.dev/docs/react-use-scroll) provide continuous transforms without per-frame React renders. The effects follow [web.dev animation guidance](https://web.dev/articles/animations-guide): animate transform/opacity, keep blur static, and measure the production result.


## Hero reference study — 16 October 2026

The earlier card-board silhouette was replaced with an original light-and-aperture composition. [React Bits Light Rays](https://reactbits.dev/backgrounds/light-rays) informed the directional illumination; its [source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/LightRays/LightRays.tsx) uses a WebGL shader and an animation loop. [Aceternity Lamp](https://ui.aceternity.com/components/lamp-effect) informed light as a focal device. [Aceternity Hero With Hub](https://ui.aceternity.com/blocks/hero-sections/hero-section-with-hub) and [Magic UI Animated Beam](https://magicui.design/docs/components/animated-beam) informed the source → context relationship. These are design references, not copied blocks or a claim that a library's exact effect is installed.

The implementation is original SVG/CSS plus the existing Motion wrapper. Gradients create the bevel, internal reflection and static atmospheric light; no WebGL context, bitmap, filter blur, external request or dependency is introduced by the artwork. Only the small review strip uses backdrop blur. Desktop motion animates transforms/opacity and short SVG dash progress; mobile uses the finished static drawing. Text annotations stay upright and within the scene at 320–1440px.
