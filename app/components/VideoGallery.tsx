"use client";

import { CONTENT } from "../content/site-content";
import { useCycleSelection } from "../presentation/scroll";

export function VideoGallery() {
  const { activeIndex, selectStop } = useCycleSelection(2, CONTENT.videos.length);
  const active = CONTENT.videos[activeIndex];
  const move = (delta: number) => {
    selectStop(Math.min(CONTENT.videos.length - 1, Math.max(0, activeIndex + delta)));
  };

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
    </div>
  );
}
