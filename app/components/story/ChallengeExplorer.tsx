"use client";

import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";
import { HighlightedText } from "../ui/highlighted-text";

export function ChallengeExplorer() {
  const { activeIndex, selectStop } = useCycleSelection(1, CONTENT.challenges.length);
  const selected = CONTENT.challenges[activeIndex];

  return (
    <div className="challenge-explorer" data-presentation-interactive="true">
      <div className="challenge-options">
        {CONTENT.challenges.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
            aria-pressed={index === activeIndex}
            className="challenge-option"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent, rgba(4,31,27,.86)), url(${item.image})`,
            }}
            onClick={() => selectStop(index)}
          >
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <div className="challenge-explanation" aria-live="polite">
        <strong>{selected.title}</strong>
        <p key={selected.id}>
          <HighlightedText
            text={selected.explanation}
            phrases={selected.highlights}
          />
        </p>
      </div>
    </div>
  );
}
