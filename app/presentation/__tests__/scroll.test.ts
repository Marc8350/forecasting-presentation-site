import { describe, expect, it } from "vitest";
import {
  bandIndex,
  computeStopFractions,
  itemStopFraction,
  revealThreshold,
} from "../scroll";

describe("revealThreshold", () => {
  it("spaces reveal groups evenly with a trailing settle zone", () => {
    expect(revealThreshold(1, 2)).toBeCloseTo(1 / 3);
    expect(revealThreshold(2, 2)).toBeCloseTo(2 / 3);
  });

  it("handles a single reveal group", () => {
    expect(revealThreshold(1, 1)).toBeCloseTo(0.5);
  });
});

describe("bandIndex", () => {
  it("clamps to the first item before the band starts", () => {
    expect(bandIndex(0.1, 4, 1 / 3, 2 / 3)).toBe(0);
  });

  it("clamps to the last item after the band ends", () => {
    expect(bandIndex(0.9, 4, 1 / 3, 2 / 3)).toBe(3);
  });

  it("picks the matching item within the band", () => {
    const start = 1 / 3;
    const end = 2 / 3;
    expect(bandIndex(start + 0.001, 4, start, end)).toBe(0);
    expect(bandIndex((start + end) / 2, 4, start, end)).toBe(2);
  });

  it("always returns 0 for a single-item band", () => {
    expect(bandIndex(0.5, 1, 0, 1)).toBe(0);
  });
});

describe("itemStopFraction", () => {
  it("lands on each item's midpoint within the band", () => {
    const start = 1 / 3;
    const end = 2 / 3;
    expect(itemStopFraction(start, end, 4, 0)).toBeCloseTo(start + (0.5 / 4) * (end - start));
    expect(itemStopFraction(start, end, 4, 3)).toBeCloseTo(start + (3.5 / 4) * (end - start));
  });

  it("lands on the band midpoint for a single-item band", () => {
    expect(itemStopFraction(0.5, 1, 1, 0)).toBeCloseTo(0.75);
  });
});

describe("computeStopFractions", () => {
  it("emits one midpoint stop per non-cycling reveal group", () => {
    const fractions = computeStopFractions(3, []);
    expect(fractions).toHaveLength(3);
    expect(fractions[0]).toBeLessThan(fractions[1]);
    expect(fractions[1]).toBeLessThan(fractions[2]);
  });

  it("expands a cycling reveal group into one stop per item", () => {
    const fractions = computeStopFractions(2, [{ at: 1, itemCount: 4 }]);
    // 4 stops for the cycling group at position 1, plus 1 for group 2.
    expect(fractions).toHaveLength(5);
    expect(fractions.every((value, index) => index === 0 || value > fractions[index - 1])).toBe(
      true,
    );
  });
});
