"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { createPresentationState, presentationReducer } from "../../presentation/reducer";
import type { PresentationState, SlideDefinition } from "../../presentation/types";

type PresentationContextValue = {
  state: PresentationState;
  next: () => void;
  previous: () => void;
  goTo: (slideIndex: number, revealStep?: number) => void;
  reducedMotion: boolean;
};

const PresentationContext = createContext<PresentationContextValue | null>(null);
export const PresentationSlideContext = createContext({ revealStep: 0 });

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

export function useCurrentPresentationSlide() {
  return useContext(PresentationSlideContext);
}

type PresentationDeckProps = {
  slides: readonly SlideDefinition[];
  children: ReactNode;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function PresentationDeck({ slides, children }: PresentationDeckProps) {
  const [state, dispatch] = useReducer(
    presentationReducer,
    createPresentationState(
      slides,
      typeof window === "undefined" ? "" : window.location.hash,
    ),
  );
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const wheelLocked = useRef(false);
  const wheelLockTimeout = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const previous = useCallback(() => dispatch({ type: "PREVIOUS" }), []);
  const goTo = useCallback(
    (slideIndex: number, revealStep?: number) => {
      dispatch({ type: "GO_TO", slideIndex, revealStep });
    },
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

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
        dispatch({ type: "NEXT" });
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        dispatch({ type: "PREVIOUS" });
      } else if (event.key === "Home") {
        event.preventDefault();
        dispatch({ type: "HOME" });
      } else if (event.key === "End") {
        event.preventDefault();
        dispatch({ type: "END" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (
        isInteractiveTarget(event.target) ||
        isInteractiveTarget(document.activeElement) ||
        wheelLocked.current ||
        Math.abs(event.deltaY) < 45
      ) {
        return;
      }
      wheelLocked.current = true;
      dispatch({ type: event.deltaY > 0 ? "NEXT" : "PREVIOUS" });
      wheelLockTimeout.current = window.setTimeout(() => {
        wheelLocked.current = false;
        wheelLockTimeout.current = null;
      }, 600);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY.current === null) {
        return;
      }
      if (
        isInteractiveTarget(event.target) ||
        isInteractiveTarget(document.activeElement)
      ) {
        touchStartY.current = null;
        return;
      }
      const delta =
        touchStartY.current -
        (event.changedTouches[0]?.clientY ?? touchStartY.current);
      if (Math.abs(delta) >= 55) {
        dispatch({ type: delta > 0 ? "NEXT" : "PREVIOUS" });
      }
      touchStartY.current = null;
    };

    window.addEventListener("wheel", onWheel);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (wheelLockTimeout.current !== null) {
        window.clearTimeout(wheelLockTimeout.current);
        wheelLockTimeout.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const slideIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
      if (slideIndex >= 0) dispatch({ type: "GO_TO", slideIndex });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [slides]);

  useEffect(() => {
    const activeId = state.slides[state.slideIndex]?.id;
    if (!activeId) return;

    window.history.replaceState(null, "", `#${activeId}`);
    document.getElementById(activeId)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reducedMotion, state.slideIndex, state.slides]);

  const contextValue = useMemo(
    () => ({ state, next, previous, goTo, reducedMotion }),
    [goTo, next, previous, reducedMotion, state],
  );

  return (
    <PresentationContext.Provider value={contextValue}>
      <div
        data-presentation-deck
        data-reduced-motion={String(reducedMotion)}
      >
        {children}
      </div>
    </PresentationContext.Provider>
  );
}
