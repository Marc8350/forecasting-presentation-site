"use client";

import { useState } from "react";
import { CONTENT } from "../../content/site-content";

export function ChallengeExplorer() {
  const [selectedId, setSelectedId] = useState(CONTENT.challenges[0].id);
  const selected =
    CONTENT.challenges.find((item) => item.id === selectedId) ??
    CONTENT.challenges[0];

  return (
    <div className="challenge-explorer" data-presentation-interactive="true">
      <div className="challenge-options">
        {CONTENT.challenges.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
            aria-pressed={item.id === selectedId}
            className="challenge-option"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent, rgba(4,31,27,.86)), url(${item.image})`,
            }}
            onClick={() => setSelectedId(item.id)}
          >
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <div className="challenge-explanation" aria-live="polite">
        <strong>{selected.title}</strong>
        <p>{selected.explanation}</p>
      </div>
    </div>
  );
}
