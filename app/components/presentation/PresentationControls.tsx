"use client";

import { usePresentation } from "./PresentationDeck";

export function PresentationControls() {
  const { state, next, previous } = usePresentation();
  const currentSlide = state.slides[state.slideIndex];
  const atStart = state.slideIndex === 0;
  const atEnd =
    state.slideIndex === state.slides.length - 1 &&
    state.revealStep === currentSlide?.revealCount;

  return (
    <div data-presentation-controls>
      <button
        type="button"
        aria-label="Previous presentation step"
        onClick={previous}
        disabled={atStart}
      >
        ←
      </button>
      <output aria-live="polite">
        {state.slideIndex + 1} / {state.slides.length}
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
