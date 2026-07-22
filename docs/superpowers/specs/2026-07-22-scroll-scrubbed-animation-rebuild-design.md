# Scroll-Scrubbed Animation Rebuild Design

## Goal

Replace the presentation deck's discrete, wheel-jacked reveal system with a continuous, scroll-scrubbed animation model in the style of translate-wf.com: sections pin in place while the user scrolls, and animation progress (fades, translation, scale, and which item in a card/node/block set is active) is driven directly and proportionally by scroll position. Overall page flow remains strictly top to bottom and the existing slide order and copy are unchanged. This is an animation-mechanism rebuild, not a content or copy change.

## Current state (being replaced)

- `PresentationDeck` intercepts wheel and touch events, accumulates delta past a threshold, and dispatches discrete `NEXT`/`PREVIOUS` actions through `presentationReducer`, with a cooldown lock (`wheelStepCooldownMs`) to stop trackpad momentum from over-triggering.
- Slides use CSS `scroll-snap-type: y proximity` and `scroll-snap-align: start` to snap to full-viewport boundaries.
- `Reveal` shows/hides content based on an integer `revealStep` from reducer state; once revealed it stays revealed (`seen` state) even if `revealStep` later decreases.
- Interactive display components (`ChallengeExplorer`, `OpportunityExplorer`, `PlatformBlocks`, `VideoGallery`, `EvidenceGallery`) each own local `useState` for which item is active, changed only by clicking.
- No animation library is installed; all transitions are CSS opacity/transform with fixed durations and staggered `transition-delay`.

## New mechanism

### Scroll position as single source of truth

Each slide is a tall wrapper element sized to its number of stops (see below), containing an inner surface pinned with `position: sticky; top: 0; height: 100vh`. `motion/react`'s `useScroll({ target: wrapperRef, offset: ["start start", "end end"] })` produces a `scrollYProgress` motion value (0 → 1) spanning that slide's pin range. All animation for that slide — opacity, vertical offset, scale, and active-item selection — is derived from this one value via `useTransform`. There is no reducer, no `revealStep`, no wheel/touch gesture interception, and no `scroll-snap`.

`app/presentation/reducer.ts` and `app/presentation/types.ts` are deleted. `PresentationDeck`/`PresentationSlide` are rewritten around this model (kept as the same file names/components since they remain the deck-level and per-slide wrapper respectively, but their internals change completely).

### Stops unify scroll, click, and keyboard

Each slide declares an ordered list of **stops** — discrete named positions along its pin range. For example the "challenge" slide has 6 stops: intro → card 1 → card 2 → card 3 → card 4 → takeaway. A stop is a fraction of the slide's progress range (`stopIndex / (stopCount - 1)`).

All three input methods resolve to the same underlying thing:

- **Free scroll** moves continuously through the stops' progress bands; content crossfades/translates smoothly as the user passes through each band.
- **Click** on an interactive item (a challenge card, opportunity node, platform block, video state, evidence thumbnail) computes that stop's absolute target scroll position from live DOM geometry and calls `window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" })`. There is no separate "selected" piece of state to desync from scroll position — clicking simply moves the scroll position, and the derived active index follows.
- **Keyboard (arrow/Page keys) and the visible Next/Previous buttons** advance exactly one stop at a time. This is resolved by reading live geometry (`getBoundingClientRect`) at the moment of the keypress/click, not a precomputed table, so it stays correct after window resize and after reduced-motion collapses a slide's height. Only once the current slide's stops are exhausted does Next/Previous cross into the adjacent slide.

This design was chosen specifically to keep the presenter-with-a-clicker use case intact: a presenter driving with arrow keys steps through each of the four challenge cards individually, rather than jumping straight past all of them to the next slide.

Home moves to the first stop of the first slide. End moves to the last stop of the last slide.

### `Reveal` keeps its existing call-site API

`<Reveal at={n}>` usages in `StorySections.tsx` and `page.tsx` are unchanged at the call site. Internally, `at` now means "stop index" rather than "reducer revealStep": the component reads the ambient slide's `scrollYProgress` (via context, replacing today's `PresentationSlideContext`) and uses `useTransform` to fade/translate in as progress crosses that stop's band, and stays visible afterward (no reverse-hide when scrolling back up, preserving today's "already seen stays visible" behavior, now as a natural consequence of monotonically-increasing highest-progress-seen tracked per slide).

### Interactive display components

`ChallengeExplorer`, `OpportunityExplorer`, `PlatformBlocks`, and `VideoGallery` stop owning `useState` for their active index. Instead they receive their active index from a small shared hook (e.g. `useBandIndex(progress, itemCount, [start, end])`) fed by the parent slide's progress. Clicking an item still visually feels like a selection, but is implemented as scrolling to that item's stop (per above).

`EvidenceGallery` is the one exception: with 16 backup images (versus 2-4 items in the other cycling components), scroll-driving its main image selection would mean pinning the evidence slide for roughly sixteen viewport-heights just for backup technical material. Its main stage selection, thumbnail rail, zoom modal, and the modal's internal prev/next arrows all remain exactly as they are today — pure click/keyboard-driven, retaining local `useState`. Only the evidence slide's entrance (heading and gallery container) gets a scroll-scrubbed fade-in, the same treatment as the "platform" slide.

### `ForecastShowcase` slide ("platform")

Unchanged in behavior: a self-contained, click-driven interactive product demo with its own internal stage state (ingestion → training → results → export), which is a real workflow tool rather than a display carousel. Only its intro heading/copy gets a single scroll-scrubbed fade-in entrance; the slide is not stretched into a multi-stop pin and is not scroll-driven internally.

### Slide height and pinning

Slides with stops beyond a bare entrance are sized taller than one viewport (roughly `stopCount * 60–90vh`, tuned per slide in the browser) so there is room to scrub through each stop's band before the pin releases. The opening and closing slides, and "platform" (ForecastShowcase), stay close to a single viewport since they don't need multi-item scrubbing room.

### Controls redesign

The fixed `PresentationControls` bar is restyled to match the continuous feel: a thin overall progress line driven by a page-level `useScroll()` (whole-document `scrollYProgress`), plus a current-slide-index / total-slides label, and Next/Previous buttons that operate on the stop model described above.

### Reduced motion and no-JS default

Server-rendered markup is fully visible content in normal document flow — there is no `opacity: 0` base state — avoiding the flash-of-hidden-content / hydration-mismatch risk the current CSS carries. `useReducedMotion` (from `motion/react`) gates pinning as a client-side enhancement: when true, slides render at normal `height: auto` (no oversized wrapper, no `position: sticky`), all reveal content is immediately visible, and click-to-select still works by directly setting the active index (no scroll animation needed since there's nothing to scrub). Because the keyboard-stop geometry is read live from the DOM rather than precomputed, this degrades correctly without special-casing the geometry logic.

## Component/file changes summary

- **Deleted:** `app/presentation/reducer.ts`, `app/presentation/types.ts`.
- **Rewritten:** `app/components/presentation/PresentationDeck.tsx`, `PresentationSlide.tsx`, `Reveal.tsx`, `PresentationControls.tsx`.
- **New:** a small shared hooks module (e.g. `app/presentation/scroll.ts`) exporting `useBandIndex`, a stop-geometry helper for keyboard/click navigation, and the slide-progress context.
- **Modified (internals only, not call sites):** `ChallengeExplorer.tsx`, `OpportunityExplorer.tsx`, `PlatformBlocks.tsx`, `VideoGallery.tsx`, `EvidenceGallery.tsx` — drop local `useState` for active index in favor of the shared hook; click handlers scroll instead of setting state directly.
- **Unchanged in behavior:** `ForecastShowcase.tsx` and its tests; `Hero.tsx`/`Closing.tsx` content (only wrapped by the new `Reveal`/pin mechanism); all copy and content arrays in `site-content.ts`.
- **New dependency:** `motion` (Framer Motion) added to `package.json`.
- **CSS (`app/globals.css`):** remove `scroll-snap-*` rules and the wheel/touch-era `[data-reveal]` opacity rules; add sticky/pin layout rules and progress-driven base styles. Reduced-motion CSS block is simplified since JS now skips pinning entirely rather than overriding transforms via CSS.

## Testing strategy

- The existing `app/__tests__/presentation-controller.test.tsx`, which asserts reducer-based reveal sequencing, is replaced rather than ported — scroll-scrubbed animation itself is not meaningfully testable in jsdom (no real layout/scroll).
- New automated coverage:
  - Click-to-select behavior on each interactive display component (asserts the correct item becomes active / correct scroll target is requested, with `scrollTo` mocked).
  - Keyboard/button stop-advancement: pressing Next/Previous the expected number of times moves through a slide's stops before crossing to the next slide (with DOM geometry and `scrollTo` mocked).
  - Reduced-motion branch: slides render with all content visible and without pinned/oversized layout when `prefers-reduced-motion: reduce` is set.
  - `ForecastShowcase`'s existing deterministic-workflow tests are left untouched.
- Manual verification (per the original presentation spec, still applicable): desktop keyboard presentation at 1440×900, tablet at 1024×768, mobile at 390×844 including a real device check for iOS Safari URL-bar collapse affecting pin geometry, no horizontal overflow, no console errors, successful production build and Cloudflare deployment.

## Out of scope

- Any change to slide content, copy, order, or the BASF/forecasting narrative.
- Any change to `ForecastShowcase`'s internal deterministic simulation logic.
- Recording or editing real demo videos.
- Horizontal scroll or non-top-to-bottom navigation of any kind.
- Exact per-slide progress-band percentages are not fixed numbers in this doc — they are tuned empirically in the browser during implementation, starting with the opening slide as the first built/tuned example before the pattern is applied to the rest.
