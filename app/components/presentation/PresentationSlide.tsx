import type { ReactNode } from "react";
import {
  PresentationSlideContext,
  usePresentation,
} from "./PresentationDeck";

type PresentationSlideProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function PresentationSlide({ id, children, className }: PresentationSlideProps) {
  const { state } = usePresentation();
  const slideIndex = state.slides.findIndex((slide) => slide.id === id);
  const active = state.slideIndex === slideIndex;

  return (
    <PresentationSlideContext.Provider value={{ revealStep: active ? state.revealStep : 0 }}>
      <section
        id={id}
        className={className}
        data-testid={`slide-${id}`}
        data-presentation-slide
        data-active={String(active)}
      >
        {children}
      </section>
    </PresentationSlideContext.Provider>
  );
}
