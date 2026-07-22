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
