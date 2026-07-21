import { existsSync } from "node:fs";
import { join } from "node:path";
import { CONTENT } from "../content/site-content";

describe("approved English content", () => {
  it("covers every target, demo, and evidence item", () => {
    expect(CONTENT.targets).toEqual([
      "Insecticides",
      "Herbicides",
      "Fungicides",
      "Seeds",
      "Seed treatment",
    ]);
    expect(CONTENT.videos).toHaveLength(3);
    expect(CONTENT.evidence).toHaveLength(7);
    expect(CONTENT.team).toEqual([
      "Erik Dwornik",
      "Marc Rodig",
      "Dary Lin",
    ]);
  });

  it("describes the BASF sales-forecast setting and every interactive story", () => {
    expect(CONTENT.scopeStatement).toBe(
      "In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.",
    );
    expect(CONTENT.challenges).toHaveLength(4);
    expect(CONTENT.challenges.every((item) => item.explanation.length > 40)).toBe(
      true,
    );
    expect(CONTENT.opportunityUseCases.map((item) => item.id)).toEqual([
      "understand",
      "research",
      "forecast",
      "explain",
    ]);
    expect(CONTENT.platformBlocks).toHaveLength(3);
    expect(CONTENT.videos).toHaveLength(3);
  });

  it("includes every locally hosted field image", () => {
    for (const relativePath of [
      "public/assets/fields/hero-field-v2.png",
      "public/assets/fields/challenge-silos-v2.png",
      "public/assets/fields/challenge-history-v2.png",
      "public/assets/fields/challenge-domain-v2.png",
      "public/assets/fields/challenge-research-v2.png",
      "public/assets/fields/opportunity-field-v2.png",
      "public/assets/fields/scope-field-v2.png",
    ]) {
      expect(existsSync(join(process.cwd(), relativePath))).toBe(true);
    }
  });

  it("contains no visible German interface vocabulary", () => {
    const serialized = JSON.stringify(CONTENT);
    for (const term of [
      "Zurück",
      "Weiter",
      "Wöchentlich",
      "Abbrechen",
      "Beispieldatei",
      "Ausgewählt",
    ]) {
      expect(serialized).not.toContain(term);
    }
  });
});
