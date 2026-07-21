"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "../content/site-content";

export function EvidenceGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : CONTENT.evidence[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeIndex]);

  return (
    <>
      <div className="evidence-grid">
        {CONTENT.evidence.map((item, index) => (
          <button
            className={index === 0 ? "evidence-card featured" : "evidence-card"}
            type="button"
            key={item.src}
            aria-label={`Open ${item.title}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="evidence-image"><img src={item.src} alt="" /></span>
            <span className="evidence-meta"><strong>{item.title}</strong><i aria-hidden="true">↗</i></span>
          </button>
        ))}
      </div>
      {active && (
        <div className="evidence-overlay" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setActiveIndex(null);
        }}>
          <div className="evidence-dialog" role="dialog" aria-modal="true" aria-label={active.title}>
            <div className="dialog-top"><div><span>Technical evidence</span><h3>{active.title}</h3></div><button type="button" aria-label="Close evidence" onClick={() => setActiveIndex(null)}>×</button></div>
            <img src={active.src} alt={`${active.title} chart from the model analysis`} />
            <p>Illustrative feature-importance evidence from the source presentation. Higher bars indicate stronger influence in the associated LightGBM forecast.</p>
          </div>
        </div>
      )}
    </>
  );
}
