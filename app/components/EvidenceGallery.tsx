"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT } from "../content/site-content";

export function EvidenceGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const launchButton = useRef<HTMLButtonElement | null>(null);
  const active = activeIndex === null ? null : CONTENT.evidence[activeIndex];

  const close = () => {
    setActiveIndex(null);
    launchButton.current?.focus();
  };

  const showEvidence = (index: number) => {
    const count = CONTENT.evidence.length;
    setActiveIndex((index + count) % count);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeIndex]);

  return (
    <>
      <div className="evidence-grid" data-presentation-interactive="true">
        {CONTENT.evidence.map((item, index) => (
          <button
            className={index === 0 ? "evidence-card featured" : "evidence-card"}
            type="button"
            key={item.src}
            aria-label={`Open ${item.title}`}
            onClick={(event) => {
              launchButton.current = event.currentTarget;
              setActiveIndex(index);
            }}
          >
            <span className="evidence-image"><img src={item.src} alt="" /></span>
            <span className="evidence-meta"><strong>{item.title}</strong><i aria-hidden="true">↗</i></span>
          </button>
        ))}
      </div>
      {active && activeIndex !== null && (
        <div
          className="evidence-overlay"
          role="presentation"
          data-presentation-interactive="true"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close();
          }}
        >
          <div
            className="evidence-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            data-presentation-interactive="true"
          >
            <div className="dialog-top"><div><span>Technical evidence</span><h3>{active.title}</h3></div><button type="button" aria-label="Close evidence" onClick={close}>×</button></div>
            <img src={active.src} alt={`${active.title} chart from the model analysis`} />
            <p>Illustrative feature-importance evidence from the source presentation. Higher bars indicate stronger influence in the associated LightGBM forecast.</p>
            <div className="evidence-dialog-controls">
              <button type="button" aria-label="Previous evidence item" onClick={() => showEvidence(activeIndex - 1)}>←</button>
              <button type="button" aria-label="Next evidence item" onClick={() => showEvidence(activeIndex + 1)}>→</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
