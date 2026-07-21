"use client";

import { useState } from "react";
import { CONTENT } from "../../content/site-content";

export function OpportunityExplorer() {
  const [selectedId, setSelectedId] = useState("understand");
  const selected = CONTENT.opportunityUseCases.find(
    (item) => item.id === selectedId,
  )!;

  return (
    <div className="opportunity-explorer" data-presentation-interactive="true">
      <div
        className="opportunity-lifecycle"
        aria-label="AI-assisted forecasting lifecycle"
      >
        <div className="opportunity-center">AI-assisted forecasting</div>
        {CONTENT.opportunityUseCases.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selectedId}
            data-selected={item.id === selectedId}
            className={`opportunity-node opportunity-${item.id}`}
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
