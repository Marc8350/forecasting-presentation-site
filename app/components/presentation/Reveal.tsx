import type { ReactNode } from "react";
import { useCurrentPresentationSlide } from "./PresentationDeck";

type RevealProps = {
  at: number;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function Reveal({ at, children, className, "data-testid": testId }: RevealProps) {
  const { revealStep } = useCurrentPresentationSlide();
  const visible = revealStep >= at;

  return (
    <div
      className={className}
      data-testid={testId}
      data-reveal
      data-visible={String(visible)}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
