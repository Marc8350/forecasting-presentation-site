"use client";

import type { ReactNode } from "react";
import { useRevealed } from "../../presentation/scroll";

type RevealProps = {
  at: number;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

export function Reveal({ at, children, className, "data-testid": testId }: RevealProps) {
  const revealed = useRevealed(at);

  return (
    <div
      className={className}
      data-testid={testId}
      data-reveal
      data-visible={String(revealed)}
    >
      {children}
    </div>
  );
}
