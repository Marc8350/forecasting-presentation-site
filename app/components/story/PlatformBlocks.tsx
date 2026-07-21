"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";

export function PlatformBlocks() {
  const [selectedId, setSelectedId] = useState(
    CONTENT.platformBlocks[0].id,
  );
  const selected =
    CONTENT.platformBlocks.find((item) => item.id === selectedId) ??
    CONTENT.platformBlocks[0];

  return (
    <div className="platform-blocks" data-presentation-interactive="true">
      <div className="platform-block-rail">
        {CONTENT.platformBlocks.map((block, index) => (
          <button
            key={block.id}
            type="button"
            aria-label={block.title}
            aria-pressed={block.id === selectedId}
            onClick={() => setSelectedId(block.id)}
          >
            <span>0{index + 1}</span>
            {block.title}
          </button>
        ))}
      </div>
      <ol aria-live="polite">
        {selected.steps.map((step, index) => (
          <li key={step} style={{ "--step-index": index } as CSSProperties}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
