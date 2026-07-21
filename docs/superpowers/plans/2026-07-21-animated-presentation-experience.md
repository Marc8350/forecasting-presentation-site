# Animated Presentation Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the forecasting case-study website into a vertically navigated, full-screen presentation with layered reveals, richer BASF Agricultural Solutions context, agricultural photography, interactive explanations, and a click-through demo gallery.

**Architecture:** Add a small presentation state machine and React context that coordinate slide/reveal state without taking ownership of existing business-demo state. Reorganize story content into focused interactive slide components driven by structured data, then apply native CSS scroll snapping and motion rather than adding an animation dependency.

**Tech Stack:** React 19, TypeScript, Next.js 16 through Vinext, Vitest, Testing Library, CSS scroll snap/transitions, Cloudflare Workers, built-in image generation.

## Global Constraints

- Preserve the existing deterministic seven-stage `ForecastShowcase` and its tests.
- Use the approved vertical full-page presentation model with layered reveals.
- Support Arrow Down, Arrow Right, Space, Page Down, Arrow Up, Arrow Left, Page Up, Home, End, swipe, wheel, and visible previous/next controls.
- Never intercept navigation keys when focus is in an interactive control or the forecasting showcase.
- Respect `prefers-reduced-motion` without removing reveal order.
- Keep all user-facing copy in English.
- Include this exact statement: “In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.”
- Use an official BASF logo asset only; never generate, redraw, recolor, distort, or animate the BASF mark.
- Place the BASF mark on a uniform monochrome backing plate with at least one-sixth-logo-width clear space, following the official BASF brand guidance.
- Generate project-local agricultural photography without logos, watermarks, readable text, sci-fi interfaces, or identifiable private property.
- Keep the public Cloudflare URL unauthenticated and deploy the final build to `basf-forecasting-showcase.marc-forecasting.workers.dev`.

## File Structure

**Create**

- `app/presentation/types.ts` — presentation slide/state/action contracts.
- `app/presentation/reducer.ts` — pure next/previous/go-to state transitions.
- `app/components/presentation/PresentationDeck.tsx` — client context, keyboard, wheel, swipe, hash synchronization.
- `app/components/presentation/PresentationSlide.tsx` — slide registration and reveal state binding.
- `app/components/presentation/Reveal.tsx` — layered reveal wrapper.
- `app/components/presentation/PresentationControls.tsx` — fixed progress and previous/next controls.
- `app/components/story/ChallengeExplorer.tsx` — selectable business challenges.
- `app/components/story/OpportunityExplorer.tsx` — selectable AI use cases.
- `app/components/story/BasfScope.tsx` — five sales-forecast product groups.
- `app/components/story/PlatformBlocks.tsx` — three-block platform explanation.
- `app/__tests__/presentation-reducer.test.ts` — pure reducer coverage.
- `app/__tests__/presentation-controller.test.tsx` — keyboard/hash/focus/swipe coverage.
- `app/__tests__/story-interactions.test.tsx` — challenge, opportunity, platform, and scope behavior.
- `public/assets/basf-logo.svg` or `public/assets/basf-logo.png` — authorized official BASF asset.
- `public/assets/fields/hero-field-v2.png`
- `public/assets/fields/challenge-silos-v2.png`
- `public/assets/fields/challenge-history-v2.png`
- `public/assets/fields/challenge-domain-v2.png`
- `public/assets/fields/challenge-research-v2.png`
- `public/assets/fields/opportunity-field-v2.png`
- `public/assets/fields/scope-field-v2.png`

**Modify**

- `app/content/site-content.ts` — structured story content and asset paths.
- `app/page.tsx` — deck composition and slide definitions.
- `app/components/Hero.tsx` — BASF branding, field image, layered reveal markup.
- `app/components/SiteNav.tsx` — presentation-aware chapter navigation.
- `app/components/StorySections.tsx` — replace monolithic sections with focused slide components or reduce to a composition wrapper.
- `app/components/VideoGallery.tsx` — convert three static cards to one carousel.
- `app/components/EvidenceGallery.tsx` — add explicit previous/next gallery navigation while preserving dialog behavior.
- `app/components/Closing.tsx` — closing slide reveal markup and BASF identity.
- `app/globals.css` — scroll snapping, slide layout, field-image treatments, reveal animations, interactive components, responsive and reduced-motion rules.
- `app/__tests__/content.test.ts` — required BASF language and complete structured content.
- `app/__tests__/shell.test.tsx` — presentation shell, controls, logos, and slide regions.
- `app/__tests__/media.test.tsx` — video carousel and evidence navigation.
- `.gitignore` — ignore `.superpowers/` visual-companion scratch files.

---

### Task 1: Add structured presentation content and project-local brand imagery

**Files:**
- Modify: `app/content/site-content.ts`
- Modify: `app/__tests__/content.test.ts`
- Modify: `app/__tests__/media.test.tsx`
- Create: `public/assets/basf-logo.svg` or `public/assets/basf-logo.png`
- Create: `public/assets/fields/*.png`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `CONTENT.challenges`, `CONTENT.opportunityUseCases`, `CONTENT.targets`, `CONTENT.platformBlocks`, `CONTENT.videos`, and `CONTENT.images` as readonly arrays/objects consumed by Tasks 4–7.
- Produces: official logo path `/assets/basf-logo.svg` or `/assets/basf-logo.png` and seven field image paths.

- [ ] **Step 1: Extend the content test so the approved language and data shapes fail first**

```ts
it("describes the BASF sales-forecast setting and every interactive story", () => {
  expect(CONTENT.scopeStatement).toBe(
    "In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.",
  );
  expect(CONTENT.challenges).toHaveLength(4);
  expect(CONTENT.challenges.every((item) => item.explanation.length > 40)).toBe(true);
  expect(CONTENT.opportunityUseCases.map((item) => item.id)).toEqual([
    "understand",
    "research",
    "forecast",
    "explain",
  ]);
  expect(CONTENT.platformBlocks).toHaveLength(3);
  expect(CONTENT.videos).toHaveLength(3);
});
```

- [ ] **Step 2: Run the focused content test and verify it fails**

Run: `npm test -- app/__tests__/content.test.ts`

Expected: FAIL because `scopeStatement`, `opportunityUseCases`, `platformBlocks`, and object-shaped challenges do not exist.

- [ ] **Step 3: Replace the flat challenge/target content with complete typed data**

Implement the following exact object keys in `CONTENT`:

```ts
scopeStatement:
  "In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.",
challenges: [
  {
    id: "silos",
    title: "Siloed data infrastructure",
    explanation: "Important sales and market signals are distributed across systems, owners, and formats.",
    image: "/assets/fields/challenge-silos-v2.png",
  },
  {
    id: "history",
    title: "Limited historical data availability",
    explanation: "Short or incomplete histories make robust validation and seasonality detection harder.",
    image: "/assets/fields/challenge-history-v2.png",
  },
  {
    id: "domain",
    title: "Missing domain knowledge",
    explanation: "Product, crop, weather, and market context are necessary to interpret forecast drivers correctly.",
    image: "/assets/fields/challenge-domain-v2.png",
  },
  {
    id: "research",
    title: "Time-intensive model research",
    explanation: "Repeatedly comparing new forecasting methods consumes expert time and slows business decisions.",
    image: "/assets/fields/challenge-research-v2.png",
  },
],
opportunityUseCases: [
  { id: "understand", title: "Understand", explanation: "AI profiles unfamiliar datasets, flags quality issues, and summarizes the available forecasting context." },
  { id: "research", title: "Research", explanation: "AI helps discover relevant signals, methods, and evidence for a specific product group." },
  { id: "forecast", title: "Forecast", explanation: "Foundation and conventional models can be configured, compared, and combined within one workflow." },
  { id: "explain", title: "Explain", explanation: "AI translates model behavior and forecast drivers for technical and business stakeholders." },
],
platformBlocks: [
  {
    id: "features",
    title: "Discover and build features",
    steps: [
      "Explore useful internal and external data sources.",
      "Ingest them safely through predefined data contracts.",
      "Combine signals and domain knowledge into candidate features.",
      "Rank features with statistical and machine-learning measures.",
    ],
  },
  {
    id: "models",
    title: "Model and evaluate",
    steps: [
      "Configure statistical, machine-learning, and foundation models with a few clicks.",
      "Train consistently across product groups.",
      "Backtest, compare, rank, and select candidate forecasts.",
    ],
  },
  {
    id: "operations",
    title: "Explain and operationalize",
    steps: [
      "Explain data quality, feature relevance, forecast behavior, and model choice.",
      "Adapt explanations for stakeholders with different technical backgrounds.",
      "Export results and register the champion model for operational use.",
    ],
  },
],
images: {
  hero: "/assets/fields/hero-field-v2.png",
  opportunity: "/assets/fields/opportunity-field-v2.png",
  scope: "/assets/fields/scope-field-v2.png",
},
```

Keep the current team, videos, evidence, and the five target names.

- [ ] **Step 4: Obtain and validate the official BASF asset**

Use the official BASF Brand Portal logo download or the public header asset from the official BASF Agricultural Solutions site. Save the unmodified black or white combined mark locally. Do not use image generation for the logo. If the official download requires BASF credentials and no public header asset is downloadable, pause only this asset step and ask Marc for the authorized file rather than recreating it.

Verify:

```bash
file public/assets/basf-logo.*
```

Expected: a valid SVG or raster image with non-zero dimensions.

- [ ] **Step 5: Generate the seven field images using the built-in image generator**

Issue one built-in generation call per final asset. Use these final prompts, changing only the specified subject line:

```text
Use case: photorealistic-natural
Asset type: full-screen presentation website background
Primary request: Create an editorial agricultural photograph for a forecasting and data-science case study.
Subject: <SUBJECT FROM LIST BELOW>
Style/medium: premium naturalistic agricultural photography, realistic European farming context
Composition/framing: 16:9 landscape, strong depth, generous negative space for interface copy, useful wide crop
Lighting/mood: natural golden-hour or soft overcast light, confident and contemporary
Color palette: deep agricultural greens, soil neutrals, restrained golden highlights
Constraints: no logos, no readable text, no watermark, no futuristic holograms, no identifiable private property
```

Subjects and target filenames:

1. Broad healthy crop rows at golden hour, negative space on the left → `hero-field-v2.png`.
2. Patchwork fields divided into separate parcels, suggesting fragmented sources → `challenge-silos-v2.png`.
3. Young crop rows with an incomplete season and changing weather, suggesting limited history → `challenge-history-v2.png`.
4. Detailed mixed crops, soil, and weather conditions, suggesting agronomic context → `challenge-domain-v2.png`.
5. Field research plots with unobtrusive sampling equipment, suggesting repeated model research → `challenge-research-v2.png`.
6. Modern field with a weather station and distant drone, realistic rather than sci-fi → `opportunity-field-v2.png`.
7. Wide mosaic of several crop types representing a multi-product sales setting → `scope-field-v2.png`.

Copy each selected output from the built-in generated-images location into `public/assets/fields/` and visually inspect it before use.

- [ ] **Step 6: Add an asset existence assertion**

Add to `content.test.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";

for (const relativePath of [
  "public/assets/fields/hero-field-v2.png",
  "public/assets/fields/challenge-silos-v2.png",
  "public/assets/fields/challenge-history-v2.png",
  "public/assets/fields/challenge-domain-v2.png",
  "public/assets/fields/challenge-research-v2.png",
  "public/assets/fields/opportunity-field-v2.png",
  "public/assets/fields/scope-field-v2.png",
]) {
  expect(existsSync(join(process.cwd(), relativePath))).toBe(true);
}
```

- [ ] **Step 7: Ignore visual-companion scratch state and run the content tests**

Add `.superpowers/` to `.gitignore`.

Run: `npm test -- app/__tests__/content.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add .gitignore app/content/site-content.ts app/__tests__/content.test.ts public/assets/basf-logo.* public/assets/fields
git commit -m "feat: add BASF story content and agricultural imagery"
```

---

### Task 2: Build the pure presentation state machine

**Files:**
- Create: `app/presentation/types.ts`
- Create: `app/presentation/reducer.ts`
- Create: `app/__tests__/presentation-reducer.test.ts`

**Interfaces:**
- Produces: `SlideDefinition`, `PresentationState`, `PresentationAction`, `createPresentationState(slides, hash?)`, and `presentationReducer(state, action)`.
- Consumes: a readonly `SlideDefinition[]` where every item has `{ id: string; revealCount: number }`.

- [ ] **Step 1: Write failing reducer tests for reveal-first navigation**

```ts
import { createPresentationState, presentationReducer } from "../presentation/reducer";

const slides = [
  { id: "opening", revealCount: 2 },
  { id: "challenge", revealCount: 3 },
] as const;

it("advances reveals before changing slides", () => {
  let state = createPresentationState(slides);
  state = presentationReducer(state, { type: "NEXT" });
  expect(state).toMatchObject({ slideIndex: 0, revealStep: 1 });
  state = presentationReducer(state, { type: "NEXT" });
  expect(state).toMatchObject({ slideIndex: 0, revealStep: 2 });
  state = presentationReducer(state, { type: "NEXT" });
  expect(state).toMatchObject({ slideIndex: 1, revealStep: 0 });
});

it("reverses into the previous slide's final reveal", () => {
  const state = presentationReducer(
    { slides, slideIndex: 1, revealStep: 0 },
    { type: "PREVIOUS" },
  );
  expect(state).toMatchObject({ slideIndex: 0, revealStep: 2 });
});

it("supports hash, home, end, and bounded navigation", () => {
  expect(createPresentationState(slides, "#challenge")).toMatchObject({ slideIndex: 1, revealStep: 0 });
  expect(presentationReducer(createPresentationState(slides), { type: "END" })).toMatchObject({ slideIndex: 1, revealStep: 3 });
  expect(presentationReducer(createPresentationState(slides), { type: "PREVIOUS" })).toMatchObject({ slideIndex: 0, revealStep: 0 });
});
```

- [ ] **Step 2: Run the reducer tests and verify they fail**

Run: `npm test -- app/__tests__/presentation-reducer.test.ts`

Expected: FAIL because the presentation modules do not exist.

- [ ] **Step 3: Define the state contracts**

```ts
export type SlideDefinition = { id: string; revealCount: number };

export type PresentationState = {
  slides: readonly SlideDefinition[];
  slideIndex: number;
  revealStep: number;
};

export type PresentationAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "HOME" }
  | { type: "END" }
  | { type: "GO_TO"; slideIndex: number; revealStep?: number };
```

- [ ] **Step 4: Implement minimal bounded reducer logic**

```ts
import type { PresentationAction, PresentationState, SlideDefinition } from "./types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function createPresentationState(
  slides: readonly SlideDefinition[],
  hash = "",
): PresentationState {
  const requested = slides.findIndex((slide) => `#${slide.id}` === hash);
  return { slides, slideIndex: requested >= 0 ? requested : 0, revealStep: 0 };
}

export function presentationReducer(
  state: PresentationState,
  action: PresentationAction,
): PresentationState {
  const current = state.slides[state.slideIndex];
  if (!current) return state;

  if (action.type === "NEXT") {
    if (state.revealStep < current.revealCount) {
      return { ...state, revealStep: state.revealStep + 1 };
    }
    const slideIndex = clamp(state.slideIndex + 1, 0, state.slides.length - 1);
    return slideIndex === state.slideIndex ? state : { ...state, slideIndex, revealStep: 0 };
  }

  if (action.type === "PREVIOUS") {
    if (state.revealStep > 0) return { ...state, revealStep: state.revealStep - 1 };
    const slideIndex = clamp(state.slideIndex - 1, 0, state.slides.length - 1);
    return slideIndex === state.slideIndex
      ? state
      : { ...state, slideIndex, revealStep: state.slides[slideIndex].revealCount };
  }

  if (action.type === "HOME") return { ...state, slideIndex: 0, revealStep: 0 };
  if (action.type === "END") {
    const slideIndex = state.slides.length - 1;
    return { ...state, slideIndex, revealStep: state.slides[slideIndex].revealCount };
  }

  const slideIndex = clamp(action.slideIndex, 0, state.slides.length - 1);
  return {
    ...state,
    slideIndex,
    revealStep: clamp(action.revealStep ?? 0, 0, state.slides[slideIndex].revealCount),
  };
}
```

- [ ] **Step 5: Run the reducer tests**

Run: `npm test -- app/__tests__/presentation-reducer.test.ts`

Expected: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/presentation app/__tests__/presentation-reducer.test.ts
git commit -m "feat: add presentation navigation state machine"
```

---

### Task 3: Add the presentation deck, slides, reveals, and controls

**Files:**
- Create: `app/components/presentation/PresentationDeck.tsx`
- Create: `app/components/presentation/PresentationSlide.tsx`
- Create: `app/components/presentation/Reveal.tsx`
- Create: `app/components/presentation/PresentationControls.tsx`
- Create: `app/__tests__/presentation-controller.test.tsx`

**Interfaces:**
- `PresentationDeck({ slides, children })` provides `{ state, next, previous, goTo }` context.
- `PresentationSlide({ id, children, className? })` renders a slide section and reads active/reveal state by ID.
- `Reveal({ at, children, className? })` emits `data-visible="true|false"`.
- `PresentationControls()` renders accessible previous/next buttons and `current / total` status.

- [ ] **Step 1: Write failing controller tests**

Test a two-slide deck. Assert that Right Arrow changes reveal state before the active slide, Left Arrow reverses, Home/End work, and `window.location.hash` follows the active slide. Add a button inside a slide, focus it, fire Right Arrow, and assert the deck state does not change.

Use these exact queries:

```ts
expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "false");
fireEvent.keyDown(window, { key: "ArrowRight" });
expect(screen.getByTestId("opening-reveal-1")).toHaveAttribute("data-visible", "true");
screen.getByRole("button", { name: "Interactive test control" }).focus();
fireEvent.keyDown(window, { key: "ArrowRight" });
expect(screen.getByTestId("slide-opening")).toHaveAttribute("data-active", "true");
```

- [ ] **Step 2: Run the controller test and verify failure**

Run: `npm test -- app/__tests__/presentation-controller.test.tsx`

Expected: FAIL because the presentation components do not exist.

- [ ] **Step 3: Implement context and keyboard handling**

Implement `isInteractiveTarget` using:

```ts
const interactiveSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role='tab']",
  "[role='dialog']",
  "[contenteditable='true']",
  "[data-presentation-interactive='true']",
].join(",");

export function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(interactiveSelector));
}
```

Define and export the presentation context contract in `PresentationDeck.tsx`:

```tsx
type PresentationContextValue = {
  state: PresentationState;
  next: () => void;
  previous: () => void;
  goTo: (slideIndex: number, revealStep?: number) => void;
  reducedMotion: boolean;
};

const PresentationContext = createContext<PresentationContextValue | null>(null);
export const PresentationSlideContext = createContext({ revealStep: 0 });

export function usePresentation() {
  const value = useContext(PresentationContext);
  if (!value) throw new Error("usePresentation must be used within PresentationDeck");
  return value;
}

export function useCurrentPresentationSlide() {
  return useContext(PresentationSlideContext);
}
```

`PresentationDeck` initializes `useReducer(presentationReducer, createPresentationState(slides, window.location.hash))`, provides the functions above, and attaches the global listeners in effects with matching cleanup functions.

Map forward keys `ArrowDown`, `ArrowRight`, `PageDown`, and Space to `NEXT`; reverse keys `ArrowUp`, `ArrowLeft`, and `PageUp` to `PREVIOUS`; map `Home` and `End` directly. Ignore modified key events and interactive targets.

- [ ] **Step 4: Add wheel, swipe, and hash behavior**

- Apply a 600 ms wheel lock after a threshold of 45 pixels so a trackpad gesture advances once.
- Record touch start Y and advance only when the end delta exceeds 55 pixels.
- Use `history.replaceState(null, "", `#${activeId}`)` after active-slide changes.
- On `hashchange`, dispatch `GO_TO` for a known slide ID.
- Scroll the active slide with `element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })`.

Use these handler shapes inside `PresentationDeck`:

```ts
const wheelLocked = useRef(false);
const touchStartY = useRef<number | null>(null);

const onWheel = (event: WheelEvent) => {
  if (isInteractiveTarget(event.target) || wheelLocked.current || Math.abs(event.deltaY) < 45) return;
  wheelLocked.current = true;
  dispatch({ type: event.deltaY > 0 ? "NEXT" : "PREVIOUS" });
  window.setTimeout(() => { wheelLocked.current = false; }, 600);
};

const onTouchStart = (event: TouchEvent) => {
  touchStartY.current = event.touches[0]?.clientY ?? null;
};

const onTouchEnd = (event: TouchEvent) => {
  if (touchStartY.current === null || isInteractiveTarget(event.target)) return;
  const delta = touchStartY.current - (event.changedTouches[0]?.clientY ?? touchStartY.current);
  if (Math.abs(delta) >= 55) dispatch({ type: delta > 0 ? "NEXT" : "PREVIOUS" });
  touchStartY.current = null;
};
```

- [ ] **Step 5: Implement slide, reveal, and controls components**

Controls must use:

```tsx
<button type="button" aria-label="Previous presentation step" onClick={previous} disabled={atStart}>←</button>
<output aria-live="polite">{slideIndex + 1} / {slides.length}</output>
<button type="button" aria-label="Next presentation step" onClick={next} disabled={atEnd}>→</button>
```

`Reveal` must keep content in document order and set `visibility: hidden` through CSS while unrevealed so hidden buttons cannot receive focus.

```tsx
export function Reveal({ at, children, className }: { at: number; children: ReactNode; className?: string }) {
  const { revealStep } = useCurrentPresentationSlide();
  const visible = revealStep >= at;
  return (
    <div className={className} data-reveal data-visible={String(visible)} aria-hidden={!visible}>
      {children}
    </div>
  );
}

export function PresentationSlide({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  const { state } = usePresentation();
  const slideIndex = state.slides.findIndex((slide) => slide.id === id);
  const active = state.slideIndex === slideIndex;
  return (
    <PresentationSlideContext.Provider value={{ revealStep: active ? state.revealStep : 0 }}>
      <section id={id} className={className} data-testid={`slide-${id}`} data-presentation-slide data-active={String(active)}>
        {children}
      </section>
    </PresentationSlideContext.Provider>
  );
}
```

- [ ] **Step 6: Run presentation tests**

Run: `npm test -- app/__tests__/presentation-reducer.test.ts app/__tests__/presentation-controller.test.tsx`

Expected: all presentation tests PASS.

- [ ] **Step 7: Commit**

```bash
git add app/components/presentation app/__tests__/presentation-controller.test.tsx
git commit -m "feat: add animated presentation controller"
```

---

### Task 4: Build the selectable challenge and AI opportunity slides

**Files:**
- Create: `app/components/story/ChallengeExplorer.tsx`
- Create: `app/components/story/OpportunityExplorer.tsx`
- Create: `app/__tests__/story-interactions.test.tsx`

**Interfaces:**
- `ChallengeExplorer()` consumes `CONTENT.challenges` and defaults to the first item.
- `OpportunityExplorer()` consumes `CONTENT.opportunityUseCases` and defaults to `understand`.
- Both expose the selected explanation in a polite live region and use `aria-pressed` on real buttons.

- [ ] **Step 1: Write failing interaction tests**

```ts
it("explains a selected forecasting challenge", async () => {
  const user = userEvent.setup();
  render(<ChallengeExplorer />);
  expect(screen.getByText(/distributed across systems, owners, and formats/i)).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Limited historical data availability" }));
  expect(screen.getByText(/short or incomplete histories/i)).toBeInTheDocument();
});

it("explains a selected holistic AI use case", async () => {
  const user = userEvent.setup();
  render(<OpportunityExplorer />);
  await user.click(screen.getByRole("button", { name: "Explain" }));
  expect(screen.getByText(/technical and business stakeholders/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the story test and verify failure**

Run: `npm test -- app/__tests__/story-interactions.test.tsx`

Expected: FAIL because both explorer components are missing.

- [ ] **Step 3: Implement `ChallengeExplorer`**

```tsx
"use client";

import { useState } from "react";
import { CONTENT } from "../../content/site-content";

export function ChallengeExplorer() {
  const [selectedId, setSelectedId] = useState(CONTENT.challenges[0].id);
  const selected = CONTENT.challenges.find((item) => item.id === selectedId) ?? CONTENT.challenges[0];

  return (
    <div className="challenge-explorer" data-presentation-interactive="true">
      <div className="challenge-options">
        {CONTENT.challenges.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
            aria-pressed={item.id === selectedId}
            className="challenge-option"
            style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(4,31,27,.86)), url(${item.image})` }}
            onClick={() => setSelectedId(item.id)}
          >
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <div className="challenge-explanation" aria-live="polite">
        <strong>{selected.title}</strong>
        <p>{selected.explanation}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `OpportunityExplorer`**

```tsx
"use client";

import { useState } from "react";
import { CONTENT } from "../../content/site-content";

export function OpportunityExplorer() {
  const [selectedId, setSelectedId] = useState("understand");
  const selected = CONTENT.opportunityUseCases.find((item) => item.id === selectedId)!;
  return (
    <div className="opportunity-explorer" data-presentation-interactive="true">
      <div className="opportunity-lifecycle" aria-label="AI-assisted forecasting lifecycle">
        <div className="opportunity-center">AI-assisted forecasting</div>
        {CONTENT.opportunityUseCases.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selectedId}
            data-selected={item.id === selectedId}
            className={`opportunity-node opportunity-${item.id}`}
            onClick={() => setSelectedId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="opportunity-explanation" aria-live="polite">{selected.explanation}</p>
    </div>
  );
}
```

- [ ] **Step 5: Run the story interaction tests**

Run: `npm test -- app/__tests__/story-interactions.test.tsx`

Expected: 2 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/components/story/ChallengeExplorer.tsx app/components/story/OpportunityExplorer.tsx app/__tests__/story-interactions.test.tsx
git commit -m "feat: add interactive challenge and AI stories"
```

---

### Task 5: Build the BASF scope and three-block platform slides

**Files:**
- Create: `app/components/story/BasfScope.tsx`
- Create: `app/components/story/PlatformBlocks.tsx`
- Modify: `app/__tests__/story-interactions.test.tsx`

**Interfaces:**
- `BasfScope()` consumes `CONTENT.scopeStatement`, `CONTENT.targets`, and `CONTENT.images.scope`.
- `PlatformBlocks()` consumes `CONTENT.platformBlocks`, defaults to `features`, and displays the active block's ordered steps.

- [ ] **Step 1: Add failing scope and platform tests**

```ts
it("states the BASF sales forecasting setting", () => {
  render(<BasfScope />);
  expect(screen.getByText(CONTENT.scopeStatement)).toBeInTheDocument();
  for (const target of CONTENT.targets) expect(screen.getByText(target)).toBeInTheDocument();
});

it("reveals the selected platform block", async () => {
  const user = userEvent.setup();
  render(<PlatformBlocks />);
  await user.click(screen.getByRole("button", { name: "Model and evaluate" }));
  expect(screen.getByText(/foundation models with a few clicks/i)).toBeInTheDocument();
  expect(screen.getByText(/backtest, compare, rank/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- app/__tests__/story-interactions.test.tsx`

Expected: FAIL because `BasfScope` and `PlatformBlocks` are missing.

- [ ] **Step 3: Implement `BasfScope`**

```tsx
import { CONTENT } from "../../content/site-content";

export function BasfScope() {
  return (
    <div className="basf-scope" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,39,34,.94), rgba(5,39,34,.28)), url(${CONTENT.images.scope})` }}>
      <p className="eyebrow light">The BASF forecasting setting</p>
      <h2>{CONTENT.scopeStatement}</h2>
      <p>Different product groups bring different demand patterns and drivers; the workflow stays consistent.</p>
      <ul>{CONTENT.targets.map((target) => <li key={target}>{target}</li>)}</ul>
    </div>
  );
}
```

- [ ] **Step 4: Implement `PlatformBlocks`**

```tsx
"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";

export function PlatformBlocks() {
  const [selectedId, setSelectedId] = useState(CONTENT.platformBlocks[0].id);
  const selected = CONTENT.platformBlocks.find((item) => item.id === selectedId) ?? CONTENT.platformBlocks[0];
  return (
    <div className="platform-blocks" data-presentation-interactive="true">
      <div className="platform-block-rail">
        {CONTENT.platformBlocks.map((block, index) => (
          <button key={block.id} type="button" aria-pressed={block.id === selectedId} onClick={() => setSelectedId(block.id)}>
            <span>0{index + 1}</span>{block.title}
          </button>
        ))}
      </div>
      <ol aria-live="polite">
        {selected.steps.map((step, index) => (
          <li key={step} style={{ "--step-index": index } as CSSProperties}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 5: Run all story tests**

Run: `npm test -- app/__tests__/story-interactions.test.tsx`

Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/components/story/BasfScope.tsx app/components/story/PlatformBlocks.tsx app/__tests__/story-interactions.test.tsx
git commit -m "feat: clarify BASF scope and platform workflow"
```

---

### Task 6: Compose the full presentation deck and branding shell

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/components/Hero.tsx`
- Modify: `app/components/SiteNav.tsx`
- Modify: `app/components/StorySections.tsx`
- Modify: `app/components/Closing.tsx`
- Modify: `app/__tests__/shell.test.tsx`

**Interfaces:**
- Consumes: `PresentationDeck`, `PresentationSlide`, `Reveal`, `PresentationControls`, four story components, `ForecastShowcase`, `VideoGallery`, `EvidenceGallery`, and `Closing`.
- Produces: a nine-slide document with IDs `opening`, `challenge`, `opportunity`, `scope`, `platform-overview`, `platform`, `videos`, `evidence`, and `closing`.

- [ ] **Step 1: Replace shell expectations with presentation-specific failing assertions**

Assert:

```ts
expect(screen.getByRole("navigation", { name: "Presentation chapters" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Previous presentation step" })).toBeDisabled();
expect(screen.getByRole("button", { name: "Next presentation step" })).toBeEnabled();
expect(screen.getByAltText("BASF")).toBeInTheDocument();
expect(screen.getByText(CONTENT.scopeStatement)).toBeInTheDocument();
expect(screen.getAllByTestId(/slide-/)).toHaveLength(9);
```

- [ ] **Step 2: Run the shell test and verify failure**

Run: `npm test -- app/__tests__/shell.test.tsx`

Expected: FAIL because the page is not yet composed as a deck.

- [ ] **Step 3: Recompose `Page` with exact slide definitions**

```ts
const SLIDES = [
  { id: "opening", revealCount: 3 },
  { id: "challenge", revealCount: 2 },
  { id: "opportunity", revealCount: 2 },
  { id: "scope", revealCount: 2 },
  { id: "platform-overview", revealCount: 2 },
  { id: "platform", revealCount: 1 },
  { id: "videos", revealCount: 2 },
  { id: "evidence", revealCount: 1 },
  { id: "closing", revealCount: 2 },
] as const;
```

Wrap every chapter in `PresentationSlide`, use `Reveal` for the declared steps, and render `PresentationControls` once inside `PresentationDeck`.

- [ ] **Step 4: Update the hero branding**

Replace the KIT building image with `CONTENT.images.hero`. Place KIT and BASF marks in separate uniform backing plates with descriptive alt text. Add adjacent plain text `Agricultural Solutions` without modifying the BASF logo file. Keep `KIT × BASF Data Science Challenge` as explanatory page copy, not part of either logo.

- [ ] **Step 5: Update nav and closing**

Change chapter links to call `goTo` through presentation context while preserving valid `href` hashes. The closing becomes the `closing` slide and repeats both institutional identities with the broader forecasting takeaway.

- [ ] **Step 6: Run shell and existing showcase tests**

Run: `npm test -- app/__tests__/shell.test.tsx app/__tests__/showcase.test.tsx`

Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/components/Hero.tsx app/components/SiteNav.tsx app/components/StorySections.tsx app/components/Closing.tsx app/__tests__/shell.test.tsx
git commit -m "feat: compose the animated presentation deck"
```

---

### Task 7: Convert videos and evidence to click-through presentation media

**Files:**
- Modify: `app/components/VideoGallery.tsx`
- Modify: `app/components/EvidenceGallery.tsx`
- Modify: `app/__tests__/media.test.tsx`

**Interfaces:**
- `VideoGallery()` owns a bounded active index from zero to `CONTENT.videos.length - 1`.
- `EvidenceGallery()` preserves its selected-dialog contract and adds bounded previous/next actions within the dialog.

- [ ] **Step 1: Write failing video-carousel and evidence-navigation tests**

```ts
it("clicks through three honest video placeholders", async () => {
  const user = userEvent.setup();
  const { container } = render(<VideoGallery />);
  expect(screen.getByText("From data to a forecast-ready foundation")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Next demonstration" }));
  expect(screen.getByText("Selecting and training the right model portfolio")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Next demonstration" }));
  expect(screen.getByText("Explaining, exporting, and operationalizing results")).toBeInTheDocument();
  expect(container.querySelector("video")).toBeNull();
});
```

Extend the evidence test to open Seeds, click `Next evidence item`, assert Herbicides, click `Previous evidence item`, and assert Seeds again.

- [ ] **Step 2: Run media tests and verify failure**

Run: `npm test -- app/__tests__/media.test.tsx`

Expected: FAIL because carousel controls do not exist.

- [ ] **Step 3: Implement bounded video navigation**

```tsx
"use client";

import { useState } from "react";
import { CONTENT } from "../content/site-content";

export function VideoGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = CONTENT.videos[activeIndex];
  const move = (delta: number) => setActiveIndex((index) => Math.min(CONTENT.videos.length - 1, Math.max(0, index + delta)));

  return (
    <div className="video-carousel" data-presentation-interactive="true">
      <div className={`video-poster poster-${activeIndex + 1}`} aria-hidden="true">
        <span>Video coming soon</span>
      </div>
      <div className="video-carousel-copy" aria-live="polite">
        <span>0{activeIndex + 1} / 0{CONTENT.videos.length}</span>
        <h3>{active.title}</h3>
        <p>{active.description}</p>
        <small>{active.duration}</small>
      </div>
      <div className="video-carousel-controls">
        <button type="button" aria-label="Previous demonstration" disabled={activeIndex === 0} onClick={() => move(-1)}>←</button>
        {CONTENT.videos.map((video, index) => (
          <button key={video.id} type="button" aria-label={`Show demonstration ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} />
        ))}
        <button type="button" aria-label="Next demonstration" disabled={activeIndex === CONTENT.videos.length - 1} onClick={() => move(1)}>→</button>
      </div>
    </div>
  );
}
```

Keep the three replacement-ready states and do not add a `<video>` element until a real source exists.

- [ ] **Step 4: Add previous/next evidence navigation**

Use the current selected index and these bounded wrapping helpers:

```ts
const selectedIndex = CONTENT.evidence.findIndex((item) => item.src === selected?.src);
const showEvidence = (index: number) => {
  const count = CONTENT.evidence.length;
  setSelected(CONTENT.evidence[(index + count) % count]);
};
```

Render `Previous evidence item` and `Next evidence item` buttons in the dialog. Keep the existing Escape listener, close button, and launch-button focus restoration.

- [ ] **Step 5: Run media tests**

Run: `npm test -- app/__tests__/media.test.tsx`

Expected: all media tests PASS.

- [ ] **Step 6: Commit**

```bash
git add app/components/VideoGallery.tsx app/components/EvidenceGallery.tsx app/__tests__/media.test.tsx
git commit -m "feat: add click-through presentation media"
```

---

### Task 8: Add slide layout, layered motion, field backgrounds, and responsive behavior

**Files:**
- Modify: `app/globals.css`
- Modify: `app/__tests__/presentation-controller.test.tsx`

**Interfaces:**
- Consumes: `data-presentation-deck`, `data-presentation-slide`, `data-active`, `data-visible`, `data-selected`, and `--step-index` attributes from Tasks 3–7.
- Produces: full-screen desktop slides, controlled long-form interactive slide behavior, mobile fallback, and reduced-motion styling.

- [ ] **Step 1: Add a failing reduced-motion contract test**

Mock `window.matchMedia` with `matches: true`, render the deck, advance a step, and assert the active deck root has `data-reduced-motion="true"`.

- [ ] **Step 2: Run the focused controller test and verify failure**

Run: `npm test -- app/__tests__/presentation-controller.test.tsx`

Expected: FAIL because the reduced-motion data attribute is missing.

- [ ] **Step 3: Expose reduced motion on the deck root**

Read `(prefers-reduced-motion: reduce)` once on mount, subscribe to `change`, and set `data-reduced-motion` on the root.

- [ ] **Step 4: Implement presentation CSS**

Add these base contracts and extend them with the existing visual tokens:

```css
html { scroll-snap-type: y mandatory; }

[data-presentation-slide] {
  min-height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: clip;
}

[data-reveal] {
  opacity: 0;
  visibility: hidden;
  transform: translateY(24px);
  transition: opacity 420ms ease, transform 520ms cubic-bezier(.2,.8,.2,1), visibility 0s linear 520ms;
}

[data-reveal][data-visible="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: calc(var(--reveal-delay, 0) * 90ms);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { transform: none; transition-duration: 0.01ms; }
}
```

Add field-image overlays, BASF/KIT logo plates, explorer selection animation, AI lifecycle paths, platform block rail, video carousel, fixed controls, and active-slide counter. Preserve the existing product showcase CSS classes.

- [ ] **Step 5: Add responsive exceptions**

- At widths below 760 px, reduce slide padding, stack split layouts, keep 44 px minimum controls, and allow the platform showcase slide to use natural height.
- For the showcase and evidence chapters, set `overflow: visible` and prevent forced snapping from trapping long content.
- Hide keyboard-only hints on touch-sized layouts but keep controls.
- Ensure no selector sets a fixed pixel height on the interactive showcase.

- [ ] **Step 6: Run all automated tests**

Run: `npm test`

Expected: all test files PASS with zero failures.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/__tests__/presentation-controller.test.tsx
git commit -m "feat: style the responsive animated slide experience"
```

---

### Task 9: Verify, package, and redeploy the public presentation

**Files:**
- Modify only if verification reveals a scoped defect.
- Update: `/Users/marc/Documents/Codex/2026-07-21/hi-please-translate-everything-to-english/outputs/forecasting-presentation-site.zip`

**Interfaces:**
- Consumes: the complete committed source and `dist/server/wrangler.json`.
- Produces: verified public URL `https://basf-forecasting-showcase.marc-forecasting.workers.dev/`.

- [ ] **Step 1: Run fresh automated verification**

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected: tests report zero failures, lint reports zero errors, build completes, diff check is empty, and only intentional files are present.

- [ ] **Step 2: Run desktop browser walkthrough at 1440 × 900**

Verify:

- Right/Down reveals content, then changes slide.
- Left/Up reverses.
- Home/End work.
- Hash and counter follow the active slide.
- Challenge, AI opportunity, platform blocks, and video carousel are selectable.
- Forecast showcase completes from sample ingestion to export without global-navigation interference.
- No horizontal overflow and no application console errors.

- [ ] **Step 3: Run tablet and mobile walkthroughs**

At 1024 × 768 and 390 × 844 verify touch-sized controls, vertical snap behavior, natural scrolling in the interactive showcase, field-image crop quality, and no horizontal overflow. Enable reduced motion and confirm reveal order remains understandable without travel animation.

- [ ] **Step 4: Commit any verified scoped fixes, then rerun Step 1**

Use a focused commit message describing only the verified defect. Do not combine unrelated cleanup.

- [ ] **Step 5: Rebuild and deploy the existing Cloudflare Worker**

```bash
npm run build
npx wrangler deploy --config dist/server/wrangler.json --name basf-forecasting-showcase
```

Expected: Wrangler reports the public URL and a new version ID.

- [ ] **Step 6: Verify the production response and content**

```bash
curl -fsSL -o /private/tmp/forecasting-live-v2.html -w "HTTP %{http_code}\nTYPE %{content_type}\n" https://basf-forecasting-showcase.marc-forecasting.workers.dev/
rg -o "<title>[^<]+</title>|In the BASF Agricultural Solutions setting|Interactive forecasting platform" /private/tmp/forecasting-live-v2.html
```

Expected: HTTP 200, HTML content type, the forecasting title, the BASF scope sentence, and the interactive platform label.

- [ ] **Step 7: Refresh the source archive**

```bash
git archive --format=zip --output=/Users/marc/Documents/Codex/2026-07-21/hi-please-translate-everything-to-english/outputs/forecasting-presentation-site.zip HEAD
unzip -t /Users/marc/Documents/Codex/2026-07-21/hi-please-translate-everything-to-english/outputs/forecasting-presentation-site.zip
```

Expected: `No errors detected in compressed data`.

---

## Completion checklist

- All nine presentation slides are keyboard-, pointer-, and touch-navigable.
- Every approved layered reveal is present and reversible.
- Official KIT and BASF identities render correctly without altering the BASF mark.
- All seven generated field images are local and visually inspected.
- The challenge, opportunity, platform, video, evidence, and forecasting-product interactions work independently.
- Automated tests, lint, production build, desktop/mobile browser QA, archive validation, and public HTTPS checks pass.
