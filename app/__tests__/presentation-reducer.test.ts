import { createPresentationState, presentationReducer } from "../presentation/reducer";

const slides = [
  { id: "opening", revealCount: 2 },
  { id: "challenge", revealCount: 3 },
] as const;

describe("presentation reducer", () => {
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
    expect(createPresentationState(slides, "#challenge")).toMatchObject({
      slideIndex: 1,
      revealStep: 0,
    });
    expect(
      presentationReducer(createPresentationState(slides), { type: "END" }),
    ).toMatchObject({ slideIndex: 1, revealStep: 3 });
    expect(
      presentationReducer(createPresentationState(slides), { type: "PREVIOUS" }),
    ).toMatchObject({ slideIndex: 0, revealStep: 0 });
  });
});
