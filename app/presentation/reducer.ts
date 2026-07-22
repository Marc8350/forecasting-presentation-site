import type {
  PresentationAction,
  PresentationState,
  SlideDefinition,
} from "./types";

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
    const slideIndex = clamp(
      state.slideIndex + 1,
      0,
      state.slides.length - 1,
    );
    return slideIndex === state.slideIndex
      ? state
      : { ...state, slideIndex, revealStep: 0 };
  }

  if (action.type === "PREVIOUS") {
    // Going back always lands on the previous slide fully revealed so
    // already-seen content is never hidden again.
    const slideIndex = clamp(
      state.slideIndex - 1,
      0,
      state.slides.length - 1,
    );
    return slideIndex === state.slideIndex
      ? state
      : {
          ...state,
          slideIndex,
          revealStep: state.slides[slideIndex].revealCount,
        };
  }

  if (action.type === "HOME") return { ...state, slideIndex: 0, revealStep: 0 };
  if (action.type === "END") {
    const slideIndex = state.slides.length - 1;
    return {
      ...state,
      slideIndex,
      revealStep: state.slides[slideIndex].revealCount,
    };
  }

  const slideIndex = clamp(action.slideIndex, 0, state.slides.length - 1);
  return {
    ...state,
    slideIndex,
    revealStep: clamp(
      action.revealStep ?? 0,
      0,
      state.slides[slideIndex].revealCount,
    ),
  };
}
