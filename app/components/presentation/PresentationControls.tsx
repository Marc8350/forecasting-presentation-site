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
