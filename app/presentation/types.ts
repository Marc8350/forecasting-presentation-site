export type SlideDefinition = { id: string; revealCount: number };

export type PresentationState = {
  slides: readonly SlideDefinition[];
  slideIndex: number;
  revealStep: number;
};

export type PresentationAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "HOME" }
  | { type: "END" }
  | { type: "GO_TO"; slideIndex: number; revealStep?: number };
