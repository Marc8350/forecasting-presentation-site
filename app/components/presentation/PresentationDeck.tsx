"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type PresentationContextValue = {
  reducedMotion: boolean;
  narrowViewport: boolean;
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

function nextStopTarget(targets: number[], y: number): number | null {
  const upcoming = targets.filter((target) => target > y);
  return upcoming.length > 0 ? Math.min(...upcoming) : null;
}

function previousStopTarget(targets: number[], y: number): number | null {
  const passed = targets.filter((target) => target < y);
  return passed.length > 0 ? Math.max(...passed) : null;
}

function scrollToTarget(target: number, smooth: boolean) {
  window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
}

function scrollToIndex(targets: number[], index: number, smooth: boolean) {
  if (targets.length === 0) return;
  const clamped = Math.min(targets.length - 1, Math.max(0, index));
  scrollToTarget(targets[clamped], smooth);
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [narrowViewport, setNarrowViewport] = useState(false);
  const [layoutQueryReady, setLayoutQueryReady] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [jsEnhanced, setJsEnhanced] = useState(false);

  // reducedMotion, narrowViewport, and layoutQueryReady must be set together
  // in this one effect body: the hash-scroll effect below waits for
  // layoutQueryReady before reading slide geometry, and that's only
  // race-free because all three values commit in the same render —
  // splitting them could let layoutQueryReady turn true against a still-stale
  // reducedMotion/narrowViewport (both of which flip PresentationSlide
  // between pinned and flow layout, changing slide heights).
  useIsomorphicLayoutEffect(() => {
    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const viewportQuery = window.matchMedia?.("(max-width: 47.5rem)");

    const updateReducedMotion = () => setReducedMotion(Boolean(motionQuery?.matches));
    const updateNarrowViewport = () => setNarrowViewport(Boolean(viewportQuery?.matches));

    updateReducedMotion();
    updateNarrowViewport();
    setLayoutQueryReady(true);

    motionQuery?.addEventListener("change", updateReducedMotion);
    viewportQuery?.addEventListener("change", updateNarrowViewport);
    return () => {
      motionQuery?.removeEventListener("change", updateReducedMotion);
      viewportQuery?.removeEventListener("change", updateNarrowViewport);
    };
  }, []);

  const updateFromScroll = useCallback(() => {
    const elements = slideElements();
    setTotalSlides(elements.length);
    const slideIndex = currentSlideIndexFor(elements);
    setCurrentSlideIndex(slideIndex);

    const targets = allStopTargets();
    setAtStart(previousStopTarget(targets, window.scrollY) === null);
    setAtEnd(nextStopTarget(targets, window.scrollY) === null);

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

  useIsomorphicLayoutEffect(() => {
    // Progressive-enhancement flag: server/pre-hydration markup must render
    // as if JS is absent, so this can only be known once mounted. Runs as a
    // layout effect (before paint) to avoid a flash of hidden content.
    setJsEnhanced(true);
  }, []);

  useEffect(() => {
    if (!layoutQueryReady) return;

    const initialId = window.location.hash.replace("#", "");
    if (initialId) goTo(initialId, "auto");

    // Derives state from live scroll/DOM geometry that only exists post-mount;
    // there is no non-effect source to synchronize from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // Re-runs once, when layoutQueryReady flips true (after the reduced-motion/
    // narrow-viewport re-render has committed correct pinned/flow layout);
    // goTo/updateFromScroll close over reducedMotion via live DOM/window
    // reads, not stale closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutQueryReady]);

  const next = useCallback(() => {
    const target = nextStopTarget(allStopTargets(), window.scrollY);
    if (target !== null) scrollToTarget(target, !reducedMotion);
  }, [reducedMotion]);

  const previous = useCallback(() => {
    const target = previousStopTarget(allStopTargets(), window.scrollY);
    if (target !== null) scrollToTarget(target, !reducedMotion);
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
      narrowViewport,
      currentSlideIndex,
      totalSlides,
      atStart,
      atEnd,
      next,
      previous,
      goTo,
    }),
    [
      reducedMotion,
      narrowViewport,
      currentSlideIndex,
      totalSlides,
      atStart,
      atEnd,
      next,
      previous,
      goTo,
    ],
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
