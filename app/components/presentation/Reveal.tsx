"use client";

import { useState, type ReactNode } from "react";
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
  // Once revealed, content stays visible — scrolling back never hides it.
  const [seen, setSeen] = useState(visible);
  if (visible && !seen) setSeen(true);

  const shown = visible || seen;

  return (
    <div
      className={className}
      data-testid={testId}
      data-reveal
      data-visible={String(shown)}
      aria-hidden={!shown}
    >
      {children}
    </div>
  );
}
