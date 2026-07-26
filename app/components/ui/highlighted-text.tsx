"use client";

import { Fragment } from "react";
import { useReducedMotion } from "motion/react";
import { Highlighter } from "./highlighter";

const HIGHLIGHT_COLOR = "#ffd02f";

type HighlightedTextProps = {
  text: string;
  phrases: readonly string[];
  color?: string;
  animationDuration?: number;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Wraps every occurrence of the given phrases in a yellow marker highlight.
 * Pass a changing React `key` from the parent to replay the draw animation.
 */
export function HighlightedText({
  text,
  phrases,
  color = HIGHLIGHT_COLOR,
  animationDuration = 900,
}: HighlightedTextProps) {
  const reducedMotion = useReducedMotion();
  const matches = phrases.filter((phrase) => phrase.length > 0 && text.includes(phrase));

  if (matches.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${matches.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        matches.includes(part) ? (
          <Highlighter
            key={index}
            action="highlight"
            color={color}
            animationDuration={reducedMotion ? 0 : animationDuration}
            padding={1}
            className="text-highlight"
          >
            {part}
          </Highlighter>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
