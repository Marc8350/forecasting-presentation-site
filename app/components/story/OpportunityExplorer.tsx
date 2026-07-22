"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";

// Clockwise order starting at the top: Research → Understand → Forecast → Explain.
const CLOCKWISE_IDS = ["research", "understand", "forecast", "explain"] as const;

export function OpportunityExplorer() {
  const [selectedId, setSelectedId] = useState("research");
  const selected = CONTENT.opportunityUseCases.find(
    (item) => item.id === selectedId,
  )!;
  const clockwiseUseCases = CLOCKWISE_IDS.map(
    (id) => CONTENT.opportunityUseCases.find((item) => item.id === id)!,
  );

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
            aria-pressed={item.id === selectedId}
            data-selected={item.id === selectedId}
            className={`opportunity-node opportunity-${item.id}`}
            style={{ "--node-index": index } as CSSProperties}
            onClick={() => setSelectedId(item.id)}
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
