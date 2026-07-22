"use client";

import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";

const CLOCKWISE_IDS = ["research", "understand", "forecast", "explain"] as const;

export function OpportunityExplorer() {
  const { activeIndex, selectStop } = useCycleSelection(
    1,
    CONTENT.opportunityUseCases.length,
  );
  const clockwiseUseCases = CLOCKWISE_IDS.map(
    (id) => CONTENT.opportunityUseCases.find((item) => item.id === id)!,
  );
  const selected = clockwiseUseCases[activeIndex];

  return (
    <div className="opportunity-explorer" data-presentation-interactive="true">
      <div
        className="opportunity-lifecycle"
        aria-label="AI-assisted forecasting lifecycle"
      >
        <div className="opportunity-center">AI-assisted forecasting</div>
        {clockwiseUseCases.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selected.id}
            data-selected={item.id === selected.id}
            className={`opportunity-node opportunity-${item.id}`}
            style={{ "--node-index": index } as CSSProperties}
            onClick={() => selectStop(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="opportunity-explanation" aria-live="polite">
        {selected.explanation}
      </p>
    </div>
  );
}
