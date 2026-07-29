"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONTENT } from "../content/site-content";
import { useCycleSelection } from "../presentation/scroll";

export function VideoGallery() {
  const { activeIndex, selectStop } = useCycleSelection(2, CONTENT.videos.length);
  const active = CONTENT.videos[activeIndex];
  const move = (delta: number) => {
    selectStop(Math.min(CONTENT.videos.length - 1, Math.max(0, activeIndex + delta)));
  };

  // Frozen at open time so background scroll (which drives activeIndex in
  // pinned mode) can't swap or remount the video out from under the viewer.
  const [expanded, setExpanded] = useState<(typeof CONTENT.videos)[number] | null>(null);
  const expandButton = useRef<HTMLButtonElement | null>(null);

  const openExpanded = () => setExpanded(active);
  const closeExpanded = () => {
    setExpanded(null);
    expandButton.current?.focus();
  };

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExpanded();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expanded]);

  return (
    <div className="video-carousel video-card" data-presentation-interactive="true">
      <div className="video-embed">
        <iframe
          key={active.id}
          src={`https://www.youtube.com/embed/${active.youtubeId}`}
          title={active.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          type="button"
          className="video-expand-trigger"
          aria-label={`Expand ${active.title}`}
          ref={expandButton}
          onClick={openExpanded}
        >
          Expand ↗
        </button>
      </div>
      <div className="video-body video-carousel-copy" aria-live="polite">
        <div>
          <span>0{activeIndex + 1} / 0{CONTENT.videos.length}</span>
        </div>
        <h3>{active.title}</h3>
        <p>{active.description}</p>
      </div>
      <div className="video-carousel-controls">
        <button
          type="button"
          aria-label="Previous demonstration"
          disabled={activeIndex === 0}
          onClick={() => move(-1)}
        >
          ←
        </button>
        {CONTENT.videos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            aria-label={`Show demonstration ${index + 1}`}
            aria-pressed={index === activeIndex}
            onClick={() => selectStop(index)}
          />
        ))}
        <button
          type="button"
          aria-label="Next demonstration"
          disabled={activeIndex === CONTENT.videos.length - 1}
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
      {expanded &&
        createPortal(
          <div
            className="video-overlay"
            role="presentation"
            data-presentation-interactive="true"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) closeExpanded();
            }}
          >
            <div
              className="video-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={expanded.title}
              data-presentation-interactive="true"
            >
              <div className="dialog-top">
                <div>
                  <span>Demonstration</span>
                  <h3>{expanded.title}</h3>
                </div>
                <button type="button" aria-label="Close video" onClick={closeExpanded}>
                  ×
                </button>
              </div>
              <div className="video-dialog-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${expanded.youtubeId}?autoplay=1`}
                  title={expanded.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p>{expanded.description}</p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
