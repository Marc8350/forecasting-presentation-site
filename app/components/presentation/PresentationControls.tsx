"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { usePresentation } from "./PresentationDeck";

export function PresentationControls() {
  const { currentSlideIndex, totalSlides, atStart, atEnd, next, previous } = usePresentation();
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, (value) =>
    Math.min(1, Math.max(0, value))
  );
  const ring = useMotionTemplate`conic-gradient(var(--mint) calc(${progress} * 1turn), rgb(255 255 255 / 14%) 0)`;

  return (
    <div data-presentation-controls>
      <motion.span
        className="presentation-progress-ring"
        style={{ background: ring }}
        aria-hidden="true"
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
