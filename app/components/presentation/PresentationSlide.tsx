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
