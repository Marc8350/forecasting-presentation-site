"use client";

import type { CSSProperties } from "react";
import { CONTENT } from "../../content/site-content";
import { useCycleSelection } from "../../presentation/scroll";
import { HighlightedText } from "../ui/highlighted-text";

export function PlatformBlocks() {
  const { activeIndex, selectStop } = useCycleSelection(1, CONTENT.platformBlocks.length);
  const selected = CONTENT.platformBlocks[activeIndex];

  return (
    <div className="platform-blocks" data-presentation-interactive="true">
      <div className="platform-block-rail">
        {CONTENT.platformBlocks.map((block, index) => (
          <button
            key={block.id}
            type="button"
            aria-label={block.title}
            aria-pressed={index === activeIndex}
            onClick={() => selectStop(index)}
          >
            <span>0{index + 1}</span>
            {block.title}
          </button>
        ))}
      </div>
      <ol aria-live="polite" key={selected.id}>
        {selected.steps.map((step, index) => (
          <li key={step.text} style={{ "--step-index": index } as CSSProperties}>
            <HighlightedText text={step.text} phrases={step.highlights} />
          </li>
        ))}
      </ol>
    </div>
  );
}
