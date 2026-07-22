"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT } from "../content/site-content";

export function EvidenceGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const launchButton = useRef<HTMLButtonElement | null>(null);
  const thumbRail = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);
  const active = CONTENT.evidence[activeIndex];
  const count = CONTENT.evidence.length;

  const showEvidence = (index: number) => {
    setActiveIndex(((index % count) + count) % count);
  };

  const openDialog = () => setDialogOpen(true);

  const close = () => {
    setDialogOpen(false);
    launchButton.current?.focus();
  };

  useEffect(() => {
    // Skip on mount: this slide renders off-screen from page load in the
    // scroll-scrubbed layout, so scrolling the active thumb into view here
    // would drag the whole window down before the user ever navigates.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const activeThumb = thumbRail.current?.querySelector("[aria-pressed='true']");
    activeThumb?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (!dialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialogOpen]);

  return (
    <>
      <div className="evidence-carousel" data-presentation-interactive="true">
        <div className="evidence-stage">
          <button
            className="evidence-stage-nav prev"
            type="button"
            aria-label="Previous evidence"
            onClick={() => showEvidence(activeIndex - 1)}
          >
            ←
          </button>
          <button
            className="evidence-stage-frame"
            type="button"
            aria-label={`Open ${active.title}`}
            ref={launchButton}
            onClick={openDialog}
          >
            <img
              key={active.src}
              src={active.src}
              alt={`${active.title} chart from the model analysis`}
              decoding="async"
            />
          </button>
          <button
            className="evidence-stage-nav next"
            type="button"
            aria-label="Next evidence"
            onClick={() => showEvidence(activeIndex + 1)}
          >
            →
          </button>
        </div>
        <div className="evidence-stage-meta" aria-live="polite">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {count}
          </span>
          <strong>{active.title}</strong>
          <i aria-hidden="true">Click the chart to inspect ↗</i>
        </div>
        <div className="evidence-thumb-rail" ref={thumbRail}>
          {CONTENT.evidence.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-label={`Show evidence ${index + 1}: ${item.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => showEvidence(index)}
            >
              <img src={item.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
      {dialogOpen && (
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
            <p>{active.description}</p>
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
