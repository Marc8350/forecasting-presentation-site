# Scroll-Scrubbed Animation Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the presentation deck's wheel-jacked, discrete-reveal-step scroll system with a continuous scroll-scrubbed pin-and-progress mechanism (translate-wf.com style), while preserving top-to-bottom page flow, all existing copy/content, and the `ForecastShowcase`/`EvidenceGallery` interactive internals.

**Architecture:** Each slide is a tall wrapper with a `position: sticky` inner surface. `motion/react`'s `useScroll` produces a `scrollYProgress` (0→1) motion value per slide, which drives `Reveal` visibility and which-item-is-active for cycling display components (challenge cards, AI use-case nodes, platform blocks, video states) via shared pure-math helpers. Scroll position is the single source of truth: clicking an item scrolls to its computed position; keyboard/button Next/Previous step through every slide's stop positions one at a time (flattened in document order, so a presenter never skips past unrevealed cards). The `reducer.ts`/`types.ts` state machine and all wheel/touch-gesture interception are deleted.

**Tech Stack:** Next.js 16 / React 19, `motion` (Framer Motion) for `useScroll`/`useInView`/`useMotionValueEvent`/`useReducedMotion`, Vitest + Testing Library, Tailwind-adjacent hand-written CSS in `app/globals.css`.

## Global Constraints

- Overall page flow stays strictly top to bottom; no horizontal scroll, no snapping/scroll-jacking, no wheel/touch gesture interception (spec: "Chosen presentation model" / this rebuild's stated goal).
- No slide content, copy, order, or narrative changes — this is an animation-mechanism rebuild only (spec: "Goal").
- `ForecastShowcase` (the "platform" slide) keeps its exact current click-driven internal behavior; only its intro copy gets a scroll-scrubbed fade-in (spec: "`ForecastShowcase` slide").
- `EvidenceGallery`'s main stage selection, thumbnail rail, zoom modal, and modal prev/next stay pure click/keyboard-driven with local `useState`, unchanged — only the evidence slide's entrance is scroll-scrubbed (spec amendment: 16-image exemption).
- `ChallengeExplorer`, `OpportunityExplorer`, `PlatformBlocks`, `VideoGallery` become scroll-driven for their active-item selection, with clicking an item still working as a direct shortcut (spec: "Interactive display components").
- Keyboard/button Next/Previous advance exactly one stop at a time (one card/node/block/video, or one slide-level reveal group) — never skip past unrevealed items to the next slide early (resolves the presenter-with-a-clicker requirement).
- `Reveal`'s call-site API (`<Reveal at={n}>`) and its existing numeric `at` values at every call site are unchanged.
- Reduced motion (`prefers-reduced-motion: reduce`) disables all pinning/stretching: slides render at normal height, all reveal content is immediately visible, and click-to-select still works.
- Server-rendered / no-JS markup must not permanently hide any content — visibility gating via CSS only activates once a client-side "enhanced" flag is set after mount.
- New dependency: `motion` (Framer Motion), imported from `motion/react`.

---

### Task 1: Add the `motion` dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: the `motion` package (imported elsewhere as `motion/react`) available to all later tasks.

- [ ] **Step 1: Install the package**

Run: `npm install motion@^12.42.2`

Expected: `package.json` gains a `"motion": "^12.42.2"` entry under `"dependencies"`, and `package-lock.json` updates.

- [ ] **Step 2: Verify it resolves under the project's React 19 / Vite RSC setup**

Run: `npm run build`

Expected: build completes without dependency-resolution errors (unrelated existing build warnings are fine; a peer-dependency or resolution error on `motion` is not).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add motion for scroll-scrubbed presentation animation"
```

---

### Task 2: Core scroll-progress primitives

**Files:**
- Create: `app/presentation/scroll.ts`
- Test: `app/presentation/__tests__/scroll.test.ts`
- Delete: `app/presentation/reducer.ts`
- Delete: `app/presentation/types.ts`

**Interfaces:**
- Produces (used by every later task): `PIN_VH_PER_STOP`, `revealThreshold(at, revealGroupCount)`, `bandIndex(progress, itemCount, start, end)`, `itemStopFraction(start, end, itemCount, index)`, `computeStopFractions(revealGroupCount, cycles)`, `SlideProgressContextValue` type, `SlideProgressContext`, `useSlideProgressContext()`, `useRevealed(at)`, `useCycleSelection(at, itemCount)`.

- [ ] **Step 1: Write the failing tests for the pure math**

Create `app/presentation/__tests__/scroll.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  bandIndex,
  computeStopFractions,
  itemStopFraction,
  revealThreshold,
} from "../scroll";

describe("revealThreshold", () => {
  it("spaces reveal groups evenly with a trailing settle zone", () => {
    expect(revealThreshold(1, 2)).toBeCloseTo(1 / 3);
    expect(revealThreshold(2, 2)).toBeCloseTo(2 / 3);
  });

  it("handles a single reveal group", () => {
    expect(revealThreshold(1, 1)).toBeCloseTo(0.5);
  });
});

describe("bandIndex", () => {
  it("clamps to the first item before the band starts", () => {
    expect(bandIndex(0.1, 4, 1 / 3, 2 / 3)).toBe(0);
  });

  it("clamps to the last item after the band ends", () => {
    expect(bandIndex(0.9, 4, 1 / 3, 2 / 3)).toBe(3);
  });

  it("picks the matching item within the band", () => {
    const start = 1 / 3;
    const end = 2 / 3;
    expect(bandIndex(start + 0.001, 4, start, end)).toBe(0);
    expect(bandIndex((start + end) / 2, 4, start, end)).toBe(2);
  });

  it("always returns 0 for a single-item band", () => {
    expect(bandIndex(0.5, 1, 0, 1)).toBe(0);
  });
});

describe("itemStopFraction", () => {
  it("lands on each item's midpoint within the band", () => {
    const start = 1 / 3;
    const end = 2 / 3;
    expect(itemStopFraction(start, end, 4, 0)).toBeCloseTo(start + (0.5 / 4) * (end - start));
    expect(itemStopFraction(start, end, 4, 3)).toBeCloseTo(start + (3.5 / 4) * (end - start));
  });

  it("lands on the band midpoint for a single-item band", () => {
    expect(itemStopFraction(0.5, 1, 1, 0)).toBeCloseTo(0.75);
  });
});

describe("computeStopFractions", () => {
  it("emits one midpoint stop per non-cycling reveal group", () => {
    const fractions = computeStopFractions(3, []);
    expect(fractions).toHaveLength(3);
    expect(fractions[0]).toBeLessThan(fractions[1]);
    expect(fractions[1]).toBeLessThan(fractions[2]);
  });

  it("expands a cycling reveal group into one stop per item", () => {
    const fractions = computeStopFractions(2, [{ at: 1, itemCount: 4 }]);
    // 4 stops for the cycling group at position 1, plus 1 for group 2.
    expect(fractions).toHaveLength(5);
    expect(fractions.every((value, index) => index === 0 || value > fractions[index - 1])).toBe(
      true,
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run app/presentation/__tests__/scroll.test.ts`

Expected: FAIL — `../scroll` module does not exist yet.

- [ ] **Step 3: Delete the reducer-era state files**

Run: `git rm app/presentation/reducer.ts app/presentation/types.ts`

- [ ] **Step 4: Write `app/presentation/scroll.ts`**

```ts
"use client";

import { createContext, useContext, useState, type RefObject } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

export const PIN_VH_PER_STOP = 70;

export function revealThreshold(at: number, revealGroupCount: number): number {
  return at / (revealGroupCount + 1);
}

export function bandIndex(
  progress: number,
  itemCount: number,
  start: number,
  end: number,
): number {
  if (itemCount <= 1) return 0;
  const span = end - start;
  if (span <= 0) return 0;
  const fraction = Math.min(1, Math.max(0, (progress - start) / span));
  return Math.min(itemCount - 1, Math.floor(fraction * itemCount));
}

export function itemStopFraction(
  start: number,
  end: number,
  itemCount: number,
  index: number,
): number {
  const span = end - start;
  return start + ((index + 0.5) / itemCount) * span;
}

export type SlideCycle = { at: number; itemCount: number };

export function computeStopFractions(
  revealGroupCount: number,
  cycles: readonly SlideCycle[],
): number[] {
  const cycleMap = new Map(cycles.map((cycle) => [cycle.at, cycle.itemCount]));
  const fractions: number[] = [];

  for (let at = 1; at <= revealGroupCount; at += 1) {
    const start = revealThreshold(at, revealGroupCount);
    const end = at >= revealGroupCount ? 1 : revealThreshold(at + 1, revealGroupCount);
    const itemCount = cycleMap.get(at) ?? 1;
    for (let index = 0; index < itemCount; index += 1) {
      fractions.push(itemStopFraction(start, end, itemCount, index));
    }
  }

  return fractions;
}

export type SlideProgressContextValue = {
  slideRef: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  revealGroupCount: number;
  mode: "pinned" | "flow";
};

export const SlideProgressContext = createContext<SlideProgressContextValue | null>(null);

export function useSlideProgressContext(): SlideProgressContextValue {
  const value = useContext(SlideProgressContext);
  if (!value) {
    throw new Error("This hook must be used within a PresentationSlide");
  }
  return value;
}

export function useRevealed(at: number): boolean {
  const { revealGroupCount, progress } = useSlideProgressContext();
  const threshold = revealThreshold(at, revealGroupCount);
  const [revealed, setRevealed] = useState(() => progress.get() >= threshold);

  useMotionValueEvent(progress, "change", (value) => {
    if (value >= threshold) setRevealed(true);
  });

  return revealed;
}

export function useCycleSelection(at: number, itemCount: number) {
  const { slideRef, progress, revealGroupCount, mode } = useSlideProgressContext();
  const start = revealThreshold(at, revealGroupCount);
  const end = at >= revealGroupCount ? 1 : revealThreshold(at + 1, revealGroupCount);

  const [manualIndex, setManualIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(() =>
    bandIndex(progress.get(), itemCount, start, end),
  );

  useMotionValueEvent(progress, "change", (value) => {
    setScrollIndex(bandIndex(value, itemCount, start, end));
  });

  const selectStop = (index: number) => {
    if (mode === "flow" || !slideRef.current) {
      setManualIndex(index);
      return;
    }
    const el = slideRef.current;
    const rect = el.getBoundingClientRect();
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    const targetFraction = itemStopFraction(start, end, itemCount, index);
    const targetY = window.scrollY + rect.top + targetFraction * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return { activeIndex: mode === "flow" ? manualIndex : scrollIndex, selectStop };
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run app/presentation/__tests__/scroll.test.ts`

Expected: PASS (all `describe` blocks green).

- [ ] **Step 6: Commit**

```bash
git add app/presentation/scroll.ts app/presentation/__tests__/scroll.test.ts
git rm app/presentation/reducer.ts app/presentation/types.ts
git commit -m "feat: add scroll-progress primitives, remove reducer-based presentation state"
```

---

### Task 3: `PresentationSlide` — pinned/flow wrapper

**Files:**
- Modify (full rewrite): `app/components/presentation/PresentationSlide.tsx`

**Interfaces:**
- Consumes: `computeStopFractions`, `PIN_VH_PER_STOP`, `SlideProgressContext`, `SlideProgressContextValue`, `SlideCycle` from `app/presentation/scroll.ts` (Task 2); `usePresentation()` from `app/components/presentation/PresentationDeck.tsx` (Task 5 — see note below).
- Produces: `PresentationSlide({ id, revealGroupCount?, cycles?, mode?, className?, children })`, rendering a `[data-presentation-slide]` element with `data-slide-mode` and `data-stop-fractions` attributes that `PresentationDeck` (Task 5) reads directly from the DOM.

> **Note on task order:** `PresentationSlide` reads `reducedMotion` from `usePresentation()`, and `PresentationDeck` doesn't exist in its new form until Task 5. Implement this task's component now, but its import of `usePresentation` will not compile/render correctly until Task 5 lands. Do not run app-level manual checks between Task 3 and Task 5 — the automated tests in this task avoid the dependency by testing pieces in isolation. Task 5 is a hard prerequisite for the app to run end-to-end.

- [ ] **Step 1: Write `app/components/presentation/PresentationSlide.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useInView, useMotionValue, useScroll } from "motion/react";
import {
  computeStopFractions,
  PIN_VH_PER_STOP,
  SlideProgressContext,
  type SlideCycle,
  type SlideProgressContextValue,
} from "../../presentation/scroll";
import { usePresentation } from "./PresentationDeck";

type PresentationSlideProps = {
  id: string;
  revealGroupCount?: number;
  cycles?: readonly SlideCycle[];
  mode?: "pinned" | "flow";
  className?: string;
  children: ReactNode;
};

export function PresentationSlide({
  id,
  revealGroupCount = 0,
  cycles = [],
  mode = "pinned",
  className,
  children,
}: PresentationSlideProps) {
  const { reducedMotion } = usePresentation();
  const pinned = mode === "pinned" && !reducedMotion;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const stopFractions = useMemo(
    () => computeStopFractions(revealGroupCount, cycles),
    [revealGroupCount, cycles],
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const inView = useInView(wrapperRef, { once: true, amount: 0.35 });
  const flowProgress = useMotionValue(inView ? 1 : 0);

  useEffect(() => {
    if (inView) flowProgress.set(1);
  }, [inView, flowProgress]);

  const contextValue: SlideProgressContextValue = {
    slideRef: wrapperRef,
    progress: pinned ? scrollYProgress : flowProgress,
    revealGroupCount,
    mode: pinned ? "pinned" : "flow",
  };

  return (
    <div
      ref={wrapperRef}
      id={id}
      data-presentation-slide
      data-slide-mode={pinned ? "pinned" : "flow"}
      data-stop-fractions={pinned ? stopFractions.join(",") : ""}
      className={className}
      style={
        pinned
          ? { height: `${(stopFractions.length + 1) * PIN_VH_PER_STOP}vh` }
          : undefined
      }
    >
      <div
        className="presentation-slide-surface"
        style={
          pinned
            ? { position: "sticky", top: 0, height: "100vh", overflow: "hidden" }
            : undefined
        }
      >
        <SlideProgressContext.Provider value={contextValue}>
          {children}
        </SlideProgressContext.Provider>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/presentation/PresentationSlide.tsx
git commit -m "feat: rewrite PresentationSlide as a pinned/flow scroll-progress provider"
```

---

### Task 4: `Reveal` — progress-driven visibility

**Files:**
- Modify (full rewrite): `app/components/presentation/Reveal.tsx`

**Interfaces:**
- Consumes: `useRevealed(at)` from `app/presentation/scroll.ts` (Task 2).
- Produces: `Reveal({ at, children, className?, "data-testid"? })` — same public props as before. Renders `[data-reveal][data-visible="true"|"false"]`.

- [ ] **Step 1: Write `app/components/presentation/Reveal.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { useRevealed } from "../../presentation/scroll";

type RevealProps = {
  at: number;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function Reveal({ at, children, className, "data-testid": testId }: RevealProps) {
  const revealed = useRevealed(at);

  return (
    <div
      className={className}
      data-testid={testId}
      data-reveal
      data-visible={String(revealed)}
      aria-hidden={!revealed}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/presentation/Reveal.tsx
git commit -m "feat: drive Reveal visibility from slide scroll progress"
```

---

### Task 5: `PresentationDeck` — navigation, keyboard, hash sync

**Files:**
- Modify (full rewrite): `app/components/presentation/PresentationDeck.tsx`
- Test: `app/__tests__/presentation-deck.test.tsx`
- Delete: `app/__tests__/presentation-controller.test.tsx`

**Interfaces:**
- Produces: `PresentationDeck({ children })` (no `slides` prop), `usePresentation()` returning `{ reducedMotion, currentSlideIndex, totalSlides, atStart, atEnd, next, previous, goTo }`, `isInteractiveTarget(target)`.
- Consumes at runtime (from Task 3): `[data-presentation-slide]` elements with `data-slide-mode` and `data-stop-fractions` attributes.

- [ ] **Step 1: Delete the old reducer-based test file**

Run: `git rm app/__tests__/presentation-controller.test.tsx`

- [ ] **Step 2: Write `app/components/presentation/PresentationDeck.tsx`**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

type PresentationContextValue = {
  reducedMotion: boolean;
  currentSlideIndex: number;
  totalSlides: number;
  atStart: boolean;
  atEnd: boolean;
  next: () => void;
  previous: () => void;
  goTo: (slideId: string) => void;
};

const PresentationContext = createContext<PresentationContextValue | null>(null);

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

export function usePresentation() {
  const value = useContext(PresentationContext);
  if (!value) throw new Error("usePresentation must be used within PresentationDeck");
  return value;
}

function slideElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-presentation-slide]"));
}

function readStopFractions(el: HTMLElement): number[] {
  const raw = el.dataset.stopFractions;
  if (!raw) return [0.5];
  const parsed = raw
    .split(",")
    .map(Number)
    .filter((value) => !Number.isNaN(value));
  return parsed.length > 0 ? parsed : [0.5];
}

function slideStopTargets(el: HTMLElement): number[] {
  const top = window.scrollY + el.getBoundingClientRect().top;
  if (el.dataset.slideMode !== "pinned") return [top];

  const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
  return readStopFractions(el).map((fraction) => top + fraction * scrollable);
}

function allStopTargets(): number[] {
  return slideElements().flatMap(slideStopTargets);
}

function closestIndex(targets: number[], y: number): number {
  let closest = 0;
  let closestDistance = Infinity;
  targets.forEach((target, index) => {
    const distance = Math.abs(target - y);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = index;
    }
  });
  return closest;
}

function scrollToIndex(targets: number[], index: number, smooth: boolean) {
  if (targets.length === 0) return;
  const clamped = Math.min(targets.length - 1, Math.max(0, index));
  window.scrollTo({ top: targets[clamped], behavior: smooth ? "smooth" : "auto" });
}

function currentSlideIndexFor(elements: HTMLElement[]): number {
  const markerY = window.scrollY + window.innerHeight / 2;
  let index = 0;
  elements.forEach((el, i) => {
    const top = window.scrollY + el.getBoundingClientRect().top;
    if (top <= markerY) index = i;
  });
  return index;
}

type PresentationDeckProps = { children: ReactNode };

export function PresentationDeck({ children }: PresentationDeckProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [jsEnhanced, setJsEnhanced] = useState(false);

  const updateFromScroll = useCallback(() => {
    const elements = slideElements();
    setTotalSlides(elements.length);
    const slideIndex = currentSlideIndexFor(elements);
    setCurrentSlideIndex(slideIndex);

    const targets = allStopTargets();
    const stopIndex = closestIndex(targets, window.scrollY);
    setAtStart(stopIndex <= 0);
    setAtEnd(stopIndex >= targets.length - 1);

    const activeId = elements[slideIndex]?.id;
    if (activeId && window.location.hash !== `#${activeId}`) {
      window.history.replaceState(null, "", `#${activeId}`);
    }
  }, []);

  const goTo = useCallback(
    (slideId: string, behavior?: "smooth" | "auto") => {
      const el = document.getElementById(slideId);
      if (!el) return;
      const targets = slideStopTargets(el);
      window.scrollTo({
        top: targets[0],
        behavior: behavior ?? (reducedMotion ? "auto" : "smooth"),
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    setJsEnhanced(true);

    const initialId = window.location.hash.replace("#", "");
    if (initialId) goTo(initialId, "auto");

    updateFromScroll();

    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateFromScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
    // Intentionally runs once on mount; goTo/updateFromScroll close over
    // reducedMotion via refs-free reads of live DOM/window state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = useCallback(() => {
    const targets = allStopTargets();
    const current = closestIndex(targets, window.scrollY);
    scrollToIndex(targets, current + 1, !reducedMotion);
  }, [reducedMotion]);

  const previous = useCallback(() => {
    const targets = allStopTargets();
    const current = closestIndex(targets, window.scrollY);
    scrollToIndex(targets, current - 1, !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isInteractiveTarget(event.target) ||
        isInteractiveTarget(document.activeElement)
      ) {
        return;
      }

      if (["ArrowDown", "ArrowRight", "PageDown", " ", "Spacebar"].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        previous();
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollToIndex(allStopTargets(), 0, !reducedMotion);
      } else if (event.key === "End") {
        event.preventDefault();
        const targets = allStopTargets();
        scrollToIndex(targets, targets.length - 1, !reducedMotion);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, reducedMotion]);

  useEffect(() => {
    const onHashChange = () => {
      const slideId = window.location.hash.replace("#", "");
      if (slideId) goTo(slideId);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goTo]);

  const contextValue = useMemo(
    () => ({
      reducedMotion,
      currentSlideIndex,
      totalSlides,
      atStart,
      atEnd,
      next,
      previous,
      goTo,
    }),
    [reducedMotion, currentSlideIndex, totalSlides, atStart, atEnd, next, previous, goTo],
  );

  return (
    <PresentationContext.Provider value={contextValue}>
      <div
        data-presentation-deck
        data-js-enhanced={String(jsEnhanced)}
        data-reduced-motion={String(reducedMotion)}
      >
        {children}
      </div>
    </PresentationContext.Provider>
  );
}
```

- [ ] **Step 3: Write `app/__tests__/presentation-deck.test.tsx`**

```tsx
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  PresentationDeck,
  usePresentation,
} from "../components/presentation/PresentationDeck";

function stubSlide(id: string, top: number, height: number, stopFractions?: string) {
  const el = document.getElementById(id) as HTMLDivElement;
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    height,
    x: 0,
    y: top,
    toJSON: () => {},
  });
  Object.defineProperty(el, "offsetHeight", { value: height, configurable: true });
  if (stopFractions !== undefined) el.dataset.stopFractions = stopFractions;
}

function Counter() {
  const { currentSlideIndex, totalSlides, atStart, atEnd } = usePresentation();
  return (
    <output data-testid="counter">
      {currentSlideIndex}/{totalSlides}/{String(atStart)}/{String(atEnd)}
    </output>
  );
}

function TestDeck() {
  return (
    <PresentationDeck>
      <Counter />
      <div id="opening" data-presentation-slide data-slide-mode="pinned" />
      <div id="challenge" data-presentation-slide data-slide-mode="pinned" />
      <button type="button">Interactive control</button>
    </PresentationDeck>
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.stubGlobal(
    "innerHeight",
    Object.getOwnPropertyDescriptor(window, "innerHeight")?.value ?? 800,
  );
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  window.scrollTo = vi.fn((options) => {
    if (typeof options === "object" && options && "top" in options) {
      Object.defineProperty(window, "scrollY", {
        value: options.top,
        configurable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    }
  }) as typeof window.scrollTo;
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PresentationDeck", () => {
  it("renders safely when window is unavailable", () => {
    vi.stubGlobal("window", undefined);
    expect(() => renderToStaticMarkup(<TestDeck />)).not.toThrow();
  });

  it("advances one stop at a time within a slide before crossing to the next", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.25,0.5,0.75,1");
    stubSlide("challenge", 2400, 800, "0.5");

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ top: 2400 * 0.25 }),
    );

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ top: 2400 * 0.5 }),
    );

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    // Now at the last stop of "opening" (fraction 1 => top 2400).
    expect(window.scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 2400 }));

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    // Crosses into "challenge"'s single stop.
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ top: 2400 + 800 * 0.5 }),
    );
  });

  it("ignores navigation keys while an interactive control is focused", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.5");
    stubSlide("challenge", 2400, 800, "0.5");
    const control = screen.getByRole("button", { name: "Interactive control" });
    control.focus();

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("supports Home and End", () => {
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.25,0.75");
    stubSlide("challenge", 2400, 800, "0.5");

    act(() => fireEvent.keyDown(window, { key: "End" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ top: 2400 + 800 * 0.5 }),
    );

    act(() => fireEvent.keyDown(window, { key: "Home" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ top: 2400 * 0.25 }),
    );
  });

  it("exposes reduced-motion state and uses instant scrolling", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    render(<TestDeck />);
    stubSlide("opening", 0, 2400, "0.5");
    stubSlide("challenge", 2400, 800, "0.5");

    expect(document.querySelector("[data-presentation-deck]")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );

    act(() => fireEvent.keyDown(window, { key: "ArrowRight" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ behavior: "auto" }),
    );
  });
});
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run app/__tests__/presentation-deck.test.tsx`

Expected: PASS. (If `getBoundingClientRect`'s mocked return shape errors on missing DOMRect fields, add the missing keys — the object above already includes all standard `DOMRect` fields.)

- [ ] **Step 5: Commit**

```bash
git add app/components/presentation/PresentationDeck.tsx app/__tests__/presentation-deck.test.tsx
git rm app/__tests__/presentation-controller.test.tsx
git commit -m "feat: rewrite PresentationDeck around scroll-position stop navigation"
```

---

### Task 6: `PresentationControls` — slim progress bar + counter

**Files:**
- Modify (full rewrite): `app/components/presentation/PresentationControls.tsx`

**Interfaces:**
- Consumes: `usePresentation()` from Task 5.

- [ ] **Step 1: Write `app/components/presentation/PresentationControls.tsx`**

```tsx
"use client";

import { motion, useScroll } from "motion/react";
import { usePresentation } from "./PresentationDeck";

export function PresentationControls() {
  const { currentSlideIndex, totalSlides, atStart, atEnd, next, previous } = usePresentation();
  const { scrollYProgress } = useScroll();

  return (
    <div data-presentation-controls>
      <motion.div
        className="presentation-progress-line"
        style={{ scaleX: scrollYProgress }}
      />
      <button
        type="button"
        aria-label="Previous presentation step"
        onClick={previous}
        disabled={atStart}
      >
        ←
      </button>
      <output aria-live="polite">
        {totalSlides > 0 ? currentSlideIndex + 1 : 1} / {totalSlides || 1}
      </output>
      <button
        type="button"
        aria-label="Next presentation step"
        onClick={next}
        disabled={atEnd}
      >
        →
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/presentation/PresentationControls.tsx
git commit -m "feat: redesign presentation controls around continuous scroll progress"
```

---

### Task 7: Wire up slides — `page.tsx`, `StorySections.tsx`, `SiteNav.tsx`

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/components/StorySections.tsx`
- Modify: `app/components/SiteNav.tsx`

**Interfaces:**
- Consumes: `PresentationSlide` (Task 3), `usePresentation` (Task 5), `CONTENT` from `app/content/site-content.ts` (unchanged).

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
import { CONTENT } from "./content/site-content";
import { Closing } from "./components/Closing";
import { EvidenceGallery } from "./components/EvidenceGallery";
import { ForecastShowcase } from "./components/ForecastShowcase";
import { Hero } from "./components/Hero";
import { PresentationControls } from "./components/presentation/PresentationControls";
import { PresentationDeck } from "./components/presentation/PresentationDeck";
import { PresentationSlide } from "./components/presentation/PresentationSlide";
import { Reveal } from "./components/presentation/Reveal";
import { SiteNav } from "./components/SiteNav";
import { StorySections } from "./components/StorySections";
import { VideoGallery } from "./components/VideoGallery";

export default function Page() {
  return (
    <main>
      <PresentationDeck>
        <SiteNav />

        <PresentationSlide id="opening" revealGroupCount={3}>
          <Hero />
        </PresentationSlide>

        <StorySections />

        <PresentationSlide
          id="platform"
          className="product-section"
          revealGroupCount={1}
          mode="flow"
        >
          <div className="page-shell">
            <Reveal at={1} className="product-intro">
              <p className="eyebrow light">Interactive forecasting platform</p>
              <h2>Explore the complete forecasting lifecycle.</h2>
              <p>
                Every control below is functional. Walk through a deterministic
                simulation from sample data to an operational champion model.
              </p>
            </Reveal>
            <div
              data-testid="forecasting-showcase-wrapper"
              data-presentation-interactive="true"
            >
              <ForecastShowcase />
            </div>
          </div>
        </PresentationSlide>

        <PresentationSlide
          id="videos"
          className="story-section video-section"
          revealGroupCount={2}
          cycles={[{ at: 2, itemCount: CONTENT.videos.length }]}
        >
          <div className="page-shell">
            <Reveal at={1}>
              <div className="section-kicker">
                <span>04</span>
                <p>Demonstrations</p>
              </div>
              <div className="section-heading split-heading">
                <h2 id="videos-title">Two views into the working system.</h2>
                <p>
                  Watch the platform in action: a data scientist exploring what
                  the system already knows, and a domain expert extending it
                  with a new signal.
                </p>
              </div>
            </Reveal>
            <Reveal at={2}>
              <VideoGallery />
            </Reveal>
          </div>
        </PresentationSlide>

        <PresentationSlide
          id="evidence"
          className="story-section evidence-section"
          revealGroupCount={1}
          mode="flow"
        >
          <div className="page-shell">
            <div className="section-kicker">
              <span>05</span>
              <p>Backup evidence</p>
            </div>
            <div className="section-heading split-heading">
              <h2 id="evidence-title">
                Inspect the drivers behind each forecast.
              </h2>
              <p>
                The backup analysis remains available for technical reviewers
                without interrupting the executive story.
              </p>
            </div>
            <Reveal at={1}>
              <EvidenceGallery />
            </Reveal>
          </div>
        </PresentationSlide>

        <PresentationSlide id="closing" revealGroupCount={3}>
          <Closing />
        </PresentationSlide>

        <PresentationControls />
      </PresentationDeck>
    </main>
  );
}
```

- [ ] **Step 2: Rewrite `app/components/StorySections.tsx`**

```tsx
import { CONTENT } from "../content/site-content";
import { PresentationSlide } from "./presentation/PresentationSlide";
import { Reveal } from "./presentation/Reveal";
import { ChallengeExplorer } from "./story/ChallengeExplorer";
import { OpportunityExplorer } from "./story/OpportunityExplorer";
import { PlatformBlocks } from "./story/PlatformBlocks";

export function StorySections() {
  return (
    <>
      <PresentationSlide
        id="challenge"
        className="story-section challenge-section"
        revealGroupCount={2}
        cycles={[{ at: 1, itemCount: CONTENT.challenges.length }]}
      >
        <div className="page-shell">
          <div className="section-kicker">
            <span>01</span>
            <p>The business challenge</p>
          </div>
          <div className="section-heading split-heading">
            <h2 id="challenge-title">
              Forecasting is more than choosing a model.
            </h2>
            <p>
              The difficult work happens between historical data and a model
              score: finding signals, validating assumptions, and turning
              results into decisions.
            </p>
          </div>
          <Reveal at={1}>
            <ChallengeExplorer />
          </Reveal>
          <Reveal at={2} className="story-takeaway">
            <p>
              A useful platform must reduce all four constraints without hiding
              the evidence behind a recommendation.
            </p>
          </Reveal>
        </div>
      </PresentationSlide>

      <PresentationSlide
        id="opportunity"
        className="story-section opportunity-section"
        revealGroupCount={2}
        cycles={[{ at: 1, itemCount: CONTENT.opportunityUseCases.length }]}
      >
        <div className="page-shell opportunity-grid">
          <div className="opportunity-copy">
            <div className="section-kicker light">
              <span>02</span>
              <p>The opportunity</p>
            </div>
            <h2 id="opportunity-title">{CONTENT.opportunity.title}</h2>
            <p className="large-copy">{CONTENT.opportunity.body}</p>
            <Reveal at={2} className="opportunity-pill-row">
              <span>Transformer forecasting</span>
              <span>Agentic research support</span>
              <span>Explainable decisions</span>
            </Reveal>
          </div>
          <Reveal at={1}>
            <OpportunityExplorer />
          </Reveal>
        </div>
      </PresentationSlide>

      <PresentationSlide
        id="platform-overview"
        className="story-section journey-section"
        revealGroupCount={2}
        cycles={[{ at: 1, itemCount: CONTENT.platformBlocks.length }]}
      >
        <div className="page-shell">
          <div className="section-kicker">
            <span>03</span>
            <p>The platform</p>
          </div>
          <div className="section-heading split-heading">
            <h2 id="journey-title">
              A connected path from raw history to operational forecasts.
            </h2>
            <p>
              Choose a workflow block to inspect how structured state moves from
              feature discovery through operationalization.
            </p>
          </div>
          <Reveal at={1}>
            <PlatformBlocks />
          </Reveal>
          <Reveal at={2} className="story-takeaway">
            <p>
              Our framework provides theoretical grounding as guardrails for the
              agents, and carefully manages context across all stages.
            </p>
          </Reveal>
        </div>
      </PresentationSlide>
    </>
  );
}
```

- [ ] **Step 3: Rewrite `app/components/SiteNav.tsx`**

```tsx
"use client";

import type { MouseEvent } from "react";
import { usePresentation } from "./presentation/PresentationDeck";

const chapters = [
  { label: "Story", href: "#challenge" },
  { label: "Platform", href: "#platform" },
  { label: "Videos", href: "#videos" },
  { label: "Evidence", href: "#evidence" },
] as const;

export function SiteNav() {
  const { goTo } = usePresentation();

  const navigate = (event: MouseEvent<HTMLAnchorElement>, slideId: string) => {
    event.preventDefault();
    goTo(slideId);
  };

  return (
    <nav className="site-nav" aria-label="Presentation chapters">
      <a
        className="nav-brand"
        href="#opening"
        aria-label="KIT and BASF forecasting showcase home"
        onClick={(event) => navigate(event, "opening")}
      >
        <img src="/assets/kit-logo.png" alt="KIT" />
        <span className="nav-divider" aria-hidden="true" />
        <span>Forecasting showcase</span>
      </a>
      <div className="nav-links">
        {chapters.map(({ label, href }) => (
          <a key={href} href={href} onClick={(event) => navigate(event, href.slice(1))}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run the full test suite to check nothing else references the removed `slides` prop or `slideIndex`**

Run: `npx vitest run`

Expected: no failures referencing `SLIDES`, `SlideDefinition`, or `slideIndex` (Tasks 8-12 below still need their own components rewritten — some failures here are expected until those land; re-run this same command again after Task 11).

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/components/StorySections.tsx app/components/SiteNav.tsx
git commit -m "feat: wire slides to scroll-progress props instead of the reducer slide list"
```

---

### Task 8: `ChallengeExplorer` — scroll-driven card selection

**Files:**
- Modify (full rewrite): `app/components/story/ChallengeExplorer.tsx`
- Test: `app/components/story/__tests__/ChallengeExplorer.test.tsx`

**Interfaces:**
- Consumes: `useCycleSelection` from `app/presentation/scroll.ts` (Task 2), `SlideProgressContext` for test setup.

- [ ] **Step 1: Write the failing test**

Create `app/components/story/__tests__/ChallengeExplorer.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef, type RefObject } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { ChallengeExplorer } from "../ChallengeExplorer";

type HarnessStatics = { progress: ReturnType<typeof useMotionValue>; slideRef: RefObject<HTMLDivElement | null> };

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(Harness as unknown as HarnessStatics, { progress, slideRef });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <ChallengeExplorer />
      </SlideProgressContext.Provider>
    </div>
  );
}

describe("ChallengeExplorer", () => {
  it("shows the first challenge's explanation at the start of its band", () => {
    render(<Harness initialProgress={0.35} />);
    expect(
      screen.getByRole("button", { name: "Siloed data infrastructure" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches active challenge as scroll progress advances through the band", () => {
    render(<Harness initialProgress={0.35} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(0.6));

    expect(
      screen.getByRole("button", { name: "Time-intensive model research" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("scrolls to a clicked card's stop instead of only setting local state", () => {
    render(<Harness initialProgress={0.35} />);
    const container = (Harness as unknown as HarnessStatics).slideRef.current!;
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 2000,
      left: 0,
      right: 0,
      width: 0,
      height: 2000,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    Object.defineProperty(container, "offsetHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    window.scrollTo = vi.fn();

    fireEvent.click(
      screen.getByRole("button", { name: "Missing domain knowledge" }),
    );

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/components/story/__tests__/ChallengeExplorer.test.tsx`

Expected: FAIL — `ChallengeExplorer` still uses local `useState`, so `aria-pressed` won't track scroll progress.

- [ ] **Step 3: Rewrite `app/components/story/ChallengeExplorer.tsx`**

```tsx
"use client";

import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";

export function ChallengeExplorer() {
  const { activeIndex, selectStop } = useCycleSelection(1, CONTENT.challenges.length);
  const selected = CONTENT.challenges[activeIndex];

  return (
    <div className="challenge-explorer" data-presentation-interactive="true">
      <div className="challenge-options">
        {CONTENT.challenges.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
            aria-pressed={index === activeIndex}
            className="challenge-option"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent, rgba(4,31,27,.86)), url(${item.image})`,
            }}
            onClick={() => selectStop(index)}
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

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run app/components/story/__tests__/ChallengeExplorer.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/story/ChallengeExplorer.tsx app/components/story/__tests__/ChallengeExplorer.test.tsx
git commit -m "feat: make ChallengeExplorer selection scroll-driven"
```

---

### Task 9: `OpportunityExplorer` — scroll-driven node selection

**Files:**
- Modify (full rewrite): `app/components/story/OpportunityExplorer.tsx`
- Test: `app/components/story/__tests__/OpportunityExplorer.test.tsx`

**Interfaces:**
- Consumes: `useCycleSelection` from Task 2.

- [ ] **Step 1: Write the failing test**

Create `app/components/story/__tests__/OpportunityExplorer.test.tsx`:

```tsx
import { act, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { OpportunityExplorer } from "../OpportunityExplorer";

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  (Harness as unknown as { progress: typeof progress }).progress = progress;
  return (
    <SlideProgressContext.Provider
      value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
    >
      <OpportunityExplorer />
    </SlideProgressContext.Provider>
  );
}

describe("OpportunityExplorer", () => {
  it("marks the content-array's first use case selected at the band start", () => {
    render(<Harness initialProgress={1 / 3} />);
    // Content order is understand, research, forecast, explain — index 0 is "Understand".
    expect(screen.getByRole("button", { name: "Understand" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("advances to later use cases as progress moves through the band", () => {
    render(<Harness initialProgress={1 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(2 / 3 - 0.01));

    expect(screen.getByRole("button", { name: "Explain" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/components/story/__tests__/OpportunityExplorer.test.tsx`

Expected: FAIL — component still defaults to the hardcoded `"research"` id via local state.

- [ ] **Step 3: Rewrite `app/components/story/OpportunityExplorer.tsx`**

```tsx
"use client";

import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";

const CLOCKWISE_IDS = ["research", "understand", "forecast", "explain"] as const;

export function OpportunityExplorer() {
  const { activeIndex, selectStop } = useCycleSelection(
    1,
    CONTENT.opportunityUseCases.length,
  );
  const selected = CONTENT.opportunityUseCases[activeIndex];
  const clockwiseUseCases = CLOCKWISE_IDS.map(
    (id) => CONTENT.opportunityUseCases.find((item) => item.id === id)!,
  );

  return (
    <div className="opportunity-explorer" data-presentation-interactive="true">
      <div
        className="opportunity-lifecycle"
        aria-label="AI-assisted forecasting lifecycle"
      >
        <div className="opportunity-center">AI-assisted forecasting</div>
        {clockwiseUseCases.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selected.id}
            data-selected={item.id === selected.id}
            className={`opportunity-node opportunity-${item.id}`}
            style={{ "--node-index": index } as CSSProperties}
            onClick={() =>
              selectStop(
                CONTENT.opportunityUseCases.findIndex((c) => c.id === item.id),
              )
            }
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="opportunity-explanation" aria-live="polite">
        {selected.explanation}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run app/components/story/__tests__/OpportunityExplorer.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/story/OpportunityExplorer.tsx app/components/story/__tests__/OpportunityExplorer.test.tsx
git commit -m "feat: make OpportunityExplorer selection scroll-driven"
```

---

### Task 10: `PlatformBlocks` — scroll-driven block selection

**Files:**
- Modify (full rewrite): `app/components/story/PlatformBlocks.tsx`
- Test: `app/components/story/__tests__/PlatformBlocks.test.tsx`

**Interfaces:**
- Consumes: `useCycleSelection` from Task 2.

- [ ] **Step 1: Write the failing test**

Create `app/components/story/__tests__/PlatformBlocks.test.tsx`:

```tsx
import { act, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef } from "react";
import { SlideProgressContext } from "../../../presentation/scroll";
import { PlatformBlocks } from "../PlatformBlocks";

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  (Harness as unknown as { progress: typeof progress }).progress = progress;
  return (
    <SlideProgressContext.Provider
      value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
    >
      <PlatformBlocks />
    </SlideProgressContext.Provider>
  );
}

describe("PlatformBlocks", () => {
  it("selects the first block at the band start", () => {
    render(<Harness initialProgress={1 / 3} />);
    expect(
      screen.getByRole("button", { name: "Discover and build features" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("selects the last block near the band end", () => {
    render(<Harness initialProgress={1 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(2 / 3 - 0.01));

    expect(
      screen.getByRole("button", { name: "Explain and operationalize" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/components/story/__tests__/PlatformBlocks.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Rewrite `app/components/story/PlatformBlocks.tsx`**

```tsx
"use client";

import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";

export function PlatformBlocks() {
  const { activeIndex, selectStop } = useCycleSelection(1, CONTENT.platformBlocks.length);
  const selected = CONTENT.platformBlocks[activeIndex];

  return (
    <div className="platform-blocks" data-presentation-interactive="true">
      <div className="platform-block-rail">
        {CONTENT.platformBlocks.map((block, index) => (
          <button
            key={block.id}
            type="button"
            aria-label={block.title}
            aria-pressed={index === activeIndex}
            onClick={() => selectStop(index)}
          >
            <span>0{index + 1}</span>
            {block.title}
          </button>
        ))}
      </div>
      <ol aria-live="polite">
        {selected.steps.map((step, index) => (
          <li key={step} style={{ "--step-index": index } as CSSProperties}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run app/components/story/__tests__/PlatformBlocks.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/story/PlatformBlocks.tsx app/components/story/__tests__/PlatformBlocks.test.tsx
git commit -m "feat: make PlatformBlocks selection scroll-driven"
```

---

### Task 11: `VideoGallery` — scroll-driven demo selection

**Files:**
- Modify (full rewrite): `app/components/VideoGallery.tsx`
- Test: `app/components/__tests__/VideoGallery.test.tsx`

**Interfaces:**
- Consumes: `useCycleSelection` from Task 2.

- [ ] **Step 1: Write the failing test**

Create `app/components/__tests__/VideoGallery.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useMotionValue } from "motion/react";
import { createRef, type RefObject } from "react";
import { SlideProgressContext } from "../../presentation/scroll";
import { VideoGallery } from "../VideoGallery";

type HarnessStatics = { progress: ReturnType<typeof useMotionValue>; slideRef: RefObject<HTMLDivElement | null> };

function Harness({ initialProgress }: { initialProgress: number }) {
  const progress = useMotionValue(initialProgress);
  const slideRef = createRef<HTMLDivElement>();
  Object.assign(Harness as unknown as HarnessStatics, { progress, slideRef });
  return (
    <div ref={slideRef}>
      <SlideProgressContext.Provider
        value={{ slideRef, progress, revealGroupCount: 2, mode: "pinned" }}
      >
        <VideoGallery />
      </SlideProgressContext.Provider>
    </div>
  );
}

describe("VideoGallery", () => {
  it("shows the first demonstration at the band start and disables Previous", () => {
    render(<Harness initialProgress={2 / 3} />);
    expect(screen.getByText("01 / 02")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous demonstration" })).toBeDisabled();
  });

  it("advances to the second demonstration near the end of progress", () => {
    render(<Harness initialProgress={2 / 3} />);
    const progress = (Harness as unknown as { progress: ReturnType<typeof useMotionValue> })
      .progress;

    act(() => progress.set(0.99));

    expect(screen.getByText("02 / 02")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next demonstration" })).toBeDisabled();
  });

  it("clicking Previous requests a scroll rather than only flipping local state", () => {
    render(<Harness initialProgress={0.99} />);
    const container = (Harness as unknown as HarnessStatics).slideRef.current!;
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 900,
      left: 0,
      right: 0,
      width: 0,
      height: 900,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    Object.defineProperty(container, "offsetHeight", { value: 900, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    window.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("button", { name: "Previous demonstration" }));

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/components/__tests__/VideoGallery.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Rewrite `app/components/VideoGallery.tsx`**

```tsx
"use client";

import { CONTENT } from "../content/site-content";
import { useCycleSelection } from "../presentation/scroll";

export function VideoGallery() {
  const { activeIndex, selectStop } = useCycleSelection(2, CONTENT.videos.length);
  const active = CONTENT.videos[activeIndex];
  const move = (delta: number) => {
    selectStop(Math.min(CONTENT.videos.length - 1, Math.max(0, activeIndex + delta)));
  };

  return (
    <div className="video-carousel video-card" data-presentation-interactive="true">
      <div className="video-embed">
        <iframe
          key={active.id}
          src={`https://www.youtube.com/embed/${active.youtubeId}`}
          title={active.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="video-body video-carousel-copy" aria-live="polite">
        <div>
          <span>0{activeIndex + 1} / 0{CONTENT.videos.length}</span>
        </div>
        <h3>{active.title}</h3>
        <p>{active.description}</p>
      </div>
      <div className="video-carousel-controls">
        <button
          type="button"
          aria-label="Previous demonstration"
          disabled={activeIndex === 0}
          onClick={() => move(-1)}
        >
          ←
        </button>
        {CONTENT.videos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            aria-label={`Show demonstration ${index + 1}`}
            aria-pressed={index === activeIndex}
            onClick={() => selectStop(index)}
          />
        ))}
        <button
          type="button"
          aria-label="Next demonstration"
          disabled={activeIndex === CONTENT.videos.length - 1}
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run app/components/__tests__/VideoGallery.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run the whole suite**

Run: `npx vitest run`

Expected: PASS across all test files (Tasks 2, 5, 8, 9, 10, 11's tests, plus pre-existing untouched suites for `ForecastShowcase`/`EvidenceGallery`/demo reducer).

- [ ] **Step 6: Commit**

```bash
git add app/components/VideoGallery.tsx app/components/__tests__/VideoGallery.test.tsx
git commit -m "feat: make VideoGallery selection scroll-driven"
```

---

### Task 12: CSS — remove scroll-snap, add pin layout and progressive-enhancement gating

**Files:**
- Modify: `app/globals.css`

**Interfaces:** none (pure styling; no exported symbols).

- [ ] **Step 1: Remove scroll-snap from the base presentation rules**

Find (around line 249-273):

```css
/* Presentation experience */
html {
  scroll-snap-type: y proximity;
  overscroll-behavior-y: none;
}

body {
  min-width: 20rem;
  overflow-x: clip;
}

[data-presentation-deck] {
  position: relative;
  isolation: isolate;
}

[data-presentation-slide] {
  position: relative;
  min-height: 100dvh;
  overflow-x: clip;
  overflow-y: visible;
  scroll-margin-top: 4.75rem;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

[data-presentation-slide][data-active="true"] {
  z-index: 1;
}
```

Replace with:

```css
/* Presentation experience */
body {
  min-width: 20rem;
  overflow-x: clip;
}

[data-presentation-deck] {
  position: relative;
  isolation: isolate;
}

[data-presentation-slide] {
  position: relative;
  overflow-x: clip;
  scroll-margin-top: 4.75rem;
}

[data-presentation-slide][data-slide-mode="flow"] {
  min-height: 100dvh;
  overflow-y: visible;
}

[data-presentation-slide][data-slide-mode="pinned"] {
  overflow-y: clip;
}

.presentation-slide-surface {
  overflow-x: clip;
}
```

- [ ] **Step 2: Gate `[data-reveal]` hiding behind the post-hydration enhanced flag**

Find (around line 279-294):

```css
[data-reveal] {
  opacity: 0;
  visibility: hidden;
  transform: translateY(24px);
  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(.2, .8, .2, 1),
    visibility 0s linear 520ms;
}

[data-reveal][data-visible="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: calc(var(--reveal-delay, 0) * 90ms);
}
```

Replace with:

```css
[data-reveal] {
  opacity: 1;
  visibility: visible;
  transform: none;
}

[data-presentation-deck][data-js-enhanced="true"] [data-reveal] {
  opacity: 0;
  visibility: hidden;
  transform: translateY(24px);
  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(.2, .8, .2, 1),
    visibility 0s linear 520ms;
}

[data-presentation-deck][data-js-enhanced="true"] [data-reveal][data-visible="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: calc(var(--reveal-delay, 0) * 90ms);
}
```

This means: with no JavaScript at all, every `[data-reveal]` block stays visible in normal document flow (the `[data-js-enhanced="true"]` ancestor selector never matches). Once `PresentationDeck` mounts and flips `data-js-enhanced` to `"true"`, the scroll-driven hide/reveal transition takes over exactly as before.

- [ ] **Step 3: Remove the now-meaningless `#platform` scroll-snap override**

Find (around line 867-873):

```css
/* Long-form product showcase */
#platform {
  overflow-x: clip;
  overflow-y: visible;
  scroll-snap-align: none;
  scroll-snap-stop: normal;
}
```

Replace with:

```css
/* Long-form product showcase */
#platform {
  overflow-x: clip;
  overflow-y: visible;
}
```

- [ ] **Step 4: Remove the remaining `scroll-snap-*` declarations in the responsive blocks**

Find (short-viewport block, around line 1238-1242):

```css
@media (min-width: 47.5rem) and (max-height: 48rem) {
  [data-presentation-slide] {
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }

  .story-section,
```

Replace with:

```css
@media (min-width: 47.5rem) and (max-height: 48rem) {
  .story-section,
```

Find (mobile block, around line 1266-1279):

```css
@media (max-width: 47.5rem) {
  html {
    scroll-snap-type: none;
    scroll-padding-top: 4rem;
  }

  [data-presentation-slide] {
    min-height: auto;
    overflow-x: clip;
    overflow-y: visible;
    scroll-margin-top: 4rem;
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }
```

Replace with:

```css
@media (max-width: 47.5rem) {
  html {
    scroll-padding-top: 4rem;
  }

  [data-presentation-slide] {
    scroll-margin-top: 4rem;
  }

  [data-presentation-slide][data-slide-mode="flow"] {
    min-height: auto;
    overflow-y: visible;
  }
```

- [ ] **Step 5: Add the progress-line style for `PresentationControls`**

Add near the end of the `/* Presentation experience */` section (after the block from Step 2):

```css
.presentation-progress-line {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  transform-origin: 0% 50%;
  background: var(--teal-600, #1f6f5c);
}

[data-presentation-controls] {
  position: relative;
  overflow: hidden;
}
```

If `[data-presentation-controls]` already has layout rules elsewhere in the file (positioning it fixed to the viewport edge per the existing design), do not duplicate those — only add `position: relative; overflow: hidden;` if they are not already present, so the progress line has a positioning context and doesn't visually overflow the bar.

- [ ] **Step 6: Verify no other `scroll-snap` or `data-active` references remain**

Run: `grep -n "scroll-snap\|data-active" app/globals.css`

Expected: no output (all removed).

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "style: replace scroll-snap layout with sticky pin layout and JS-gated reveals"
```

---

### Task 13: End-to-end verification

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full automated test suite**

Run: `npx vitest run`

Expected: all test files pass, including `app/presentation/__tests__/scroll.test.ts`, `app/__tests__/presentation-deck.test.tsx`, the four rewritten component tests, and every pre-existing untouched test (`ForecastShowcase`, `EvidenceGallery` behavior if covered elsewhere, demo reducer, production worker smoke test's build-time assertions).

- [ ] **Step 2: Lint and type-check**

Run: `npm run lint`

Expected: no errors introduced by this rebuild (pre-existing unrelated warnings, if any, are out of scope).

- [ ] **Step 3: Production build**

Run: `npm run build`

Expected: build succeeds with no new errors or warnings traceable to the presentation/scroll rewrite.

- [ ] **Step 4: Manual smoke test in the browser**

Run: `npm run dev`, then open the site.

Check, at each of these viewport sizes (resize the browser or use dev tools device emulation):
- **1440×900:** scroll naturally through every slide top to bottom; each pinned slide's content should fade/translate in and settle as you scroll through it; the challenge/opportunity/platform-block/video cards should change as you scroll through their band, and also respond instantly to a direct click. Press arrow-down repeatedly from the top and confirm it steps through challenge cards one at a time before moving to the opportunity slide.
- **1024×768:** repeat the same check; confirm no layout looks obviously broken.
- **390×844:** confirm natural touch scroll moves through pinned sections smoothly, the fixed controls bar and its progress line render correctly, and there is no horizontal scrollbar/overflow anywhere on the page.

Check across all sizes:
- No browser console errors or warnings.
- `SiteNav`'s chapter links jump to the top of the corresponding slide.
- Reloading the page with `#platform` (or another slide id) in the URL lands at that slide's top on load.
- With OS-level "reduce motion" turned on (macOS: System Settings → Accessibility → Display → Reduce motion; or emulate via Chrome DevTools → Rendering → `prefers-reduced-motion: reduce`), confirm slides no longer stretch/pin, all reveal content is immediately visible, and clicking challenge/opportunity/platform/video items still switches the active one.
- With JavaScript disabled (Chrome DevTools → Cmd+Shift+P → "Disable JavaScript", then hard-reload), confirm all text content is present and readable in the static HTML (no permanently blank/hidden sections).

- [ ] **Step 5: Deploy verification (if deploying)**

If this branch is being deployed to the Cloudflare preview/production URL per the project's existing deploy process, confirm the deployed site loads over HTTPS with a 200 response and the same manual checks above pass on the live URL.

No commit for this task — it is verification only. If any check fails, return to the relevant earlier task, fix, and re-run its tests before re-verifying here.
