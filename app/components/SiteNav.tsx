"use client";

import type { MouseEvent } from "react";
import { usePresentation } from "./presentation/PresentationDeck";

const chapters = [
  { label: "Story", href: "#challenge", slideIndex: 1 },
  { label: "Platform", href: "#platform", slideIndex: 5 },
  { label: "Videos", href: "#videos", slideIndex: 6 },
  { label: "Evidence", href: "#evidence", slideIndex: 7 },
] as const;

export function SiteNav() {
  const { goTo } = usePresentation();

  const navigate = (event: MouseEvent<HTMLAnchorElement>, slideIndex: number) => {
    event.preventDefault();
    goTo(slideIndex);
  };

  return (
    <nav className="site-nav" aria-label="Presentation chapters">
      <a
        className="nav-brand"
        href="#opening"
        aria-label="KIT and BASF forecasting showcase home"
        onClick={(event) => navigate(event, 0)}
      >
        <img src="/assets/kit-logo.png" alt="KIT" />
        <span className="nav-divider" aria-hidden="true" />
        <span>Forecasting showcase</span>
      </a>
      <div className="nav-links">
        {chapters.map(({ label, href, slideIndex }) => (
          <a
            key={href}
            href={href}
            onClick={(event) => navigate(event, slideIndex)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
