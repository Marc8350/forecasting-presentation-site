"use client";

import type { MouseEvent } from "react";
import { usePresentation } from "./presentation/PresentationDeck";

const chapters = [
  { label: "Story", href: "#challenge" },
  { label: "Platform", href: "#platform" },
  { label: "Videos", href: "#videos" },
  { label: "Evidence", href: "#evidence" },
] as const;

export function SiteNav() {
  const { goTo } = usePresentation();

  const navigate = (event: MouseEvent<HTMLAnchorElement>, slideId: string) => {
    event.preventDefault();
    goTo(slideId);
  };

  return (
    <nav className="site-nav" aria-label="Presentation chapters">
      <a
        className="nav-brand"
        href="#opening"
        aria-label="KIT and BASF forecasting showcase home"
        onClick={(event) => navigate(event, "opening")}
      >
        <img src="/assets/kit-logo.png" alt="KIT" />
        <span className="nav-divider" aria-hidden="true" />
        <span>Forecasting showcase</span>
      </a>
      <div className="nav-links">
        {chapters.map(({ label, href }) => (
          <a key={href} href={href} onClick={(event) => navigate(event, href.slice(1))}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
