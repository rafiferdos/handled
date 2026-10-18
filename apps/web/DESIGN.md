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
- **Showcase:** a native 24-degree perspective unfold, 110px rise and 0.9-to-1 scale. The surface settles before reading/interaction. Keep the wrapper and content mounted through pointer/motion changes so keyboard focus survives. CSS view timelines require clipping ancestors to use `overflow: clip`, not a non-scrolling `overflow: hidden` scrollport. Unsupported browsers use a flat static preview. Case selection remains keyboard controlled; scrolling never changes data or decisions.
- **Trust:** unequal editorial glass chapters, a source constellation, distinct ink human-decision panel and a horizontal provenance ribbon. Native scroll progress assembles sources by 32–48px and draws one short connection trace. Use intrinsic rows, upright content and reliable final contrast. Keep clipping panels from accidentally capturing the document timeline.
- **Workflow:** four oversized editorial reading chapters, a vertical progress rail and a native sticky decorative scene. Damped MotionValues sequence clearly separated question/context/decision/outcome stages and changing phase captions. Ticket, records/policy, human review and outcome layers unfold with continuous MotionValues. Load the scene near the viewport; the loading and no-JavaScript artwork use an intentional static composition. Sticky motion requires a fine pointer, at least 1024px width and 700px height. Mobile, short windows and reduced motion use normal four-step cards. No scroll trapping.
- **Product/process:** selected headings use masked word rise/rotation and scroll-linked word lighting. Desktop word entrances last 850ms with a bounded stagger; mobile entrances are 600ms and shorter. General `Reveal` presets remain 550–650ms; operational navigation stays quick.
- **FAQ/closing:** upright rounded question sheets, a desktop sticky introduction and short native card arrivals. The closing panel uses a static directional lightscape with scroll-linked elliptical rim depth. Keep mobile as normal reading flow.
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


## Remaining home sections — 16 October 2026

[Aceternity Container Scroll](https://ui.aceternity.com/components/container-scroll-animation) informed the product reveal; [Sticky Scroll Reveal](https://ui.aceternity.com/components/sticky-scroll-reveal) informed chapter pacing. [React Bits Scroll Reveal](https://reactbits.dev/text-animations/scroll-reveal) informed the readable heading rhythm. This is original composition built on installed Motion and native CSS, without copying a block or adding GSAP. [Motion scroll guidance](https://motion.dev/docs/react-scroll-animations) supports the existing value-driven story; [web.dev animation guidance](https://web.dev/articles/animations-guide) guides transform/opacity effects and bounded measurement. The one small source trace animates dash offset; blur, shadows and dimensions stay static for decorative motion.

Measure actual displacement, not only CSS presence: an inherited hidden-overflow scrollport initially froze the native preview/source timelines. Scoped clip overflow fixes their attachment to document scrolling. Regression checks observe the preview rise and source settlement and also verify keyboard focus survives a live reduced-motion change.


## Marketing navigation — 16 October 2026

Use a floating frosted shell with a clear brand, visible direct destinations and one luminous mint action. The desktop destinations are centered with equal outer grid tracks; current product/process pages receive a pill and `aria-current="page"`. Home anchors do not claim a page selection. Keep the bar stable while scrolling: no shrinking hit targets, hiding navigation or continuously running scroll handler.

[Aceternity Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar) informed the floating silhouette. [Linear](https://linear.app/) provides a current SaaS example of direct destinations with separate account actions. [NN/g menu guidance](https://www.nngroup.com/articles/menu-design/) supports clear labels, discoverability and predictable interactions. This is a project-specific synthesis, not a claim that one navbar is universally best or that a reference component was installed.

Show desktop navigation from 1024px. Smaller widths use a visible **Menu** label and a spacious sheet with icon/description rows, login and the same **Explore Handled** action. All navigation targets are at least 44px high. Keep the close control visible in short windows, restore trigger focus on Escape, close on destination/history changes and close the sheet when resizing to desktop. Clear anchor destinations below the sticky header.

Navigation glass uses a bounded, static 16px frost and high-fill light/dark surfaces. Mobile reading panels use solid contrast. Reduced transparency removes the filter, reduced motion removes transitions, and forced colors use system surfaces. Focus rings and concise accessible names remain explicit. No dependency or scroll-driven React state is introduced.

## Public copy and environment status

Use ordinary product labels for headings, navigation and calls to action. Avoid repeating Sample, Preview or implementation disclaimers on every card. Place one concise environment status around an interactive example and one shared status in the workspace. Keep action-specific facts where they help a person decide: sign-in is unavailable, replies are not sent and local decision rehearsals do not change accounts. Never replace those facts with a success claim. Technical architecture belongs in documentation rather than product reading flows.

## Readable, compact refinement — 16 October 2026

Operational reading uses 13–14px, important metadata 12px, 36px desktop page headings and rendered 44px controls. Enforce actual variant sizing rather than assuming a utility overrides the primitive. Narrow overview metrics use 64px summary rows; desktop metrics remain around 160px. At 1200px, case review keeps a 350px minimum recommendation alongside the conversation and allows normal page scrolling.

Public sections vary their evidence rather than repeating one card motif. Product features have distinct static artifacts; process chapters show a concrete case. Simplify mobile diagrams before shrinking meaningful labels. Keep mobile hero/closing pacing compact, footer destinations intentionally arranged and status copy near relevant interactions. Preserve all reduced-motion, coarse-pointer, keyboard and no-JavaScript behavior.

## Company workspace identity — 16 October 2026

Handled remains the product brand; the active company's name/logo identifies the workspace. Keep that company context visible in the compact mobile/desktop header and selector. Company profile is the home for identity and support details; Settings retains personal appearance preferences. Stable workspace IDs, not editable names, define data scope.

Keep forms on readable solid surfaces with 44px controls. Company identity can use a bounded static mint surface; avoid decorative motion beside editing fields. Contain long company names, file names and industry text at 320px. Display disconnected setup states honestly; entering a website or support contact does not activate a connection or subscription. Preview edits stay local and reset on reload until authenticated backend persistence exists.
