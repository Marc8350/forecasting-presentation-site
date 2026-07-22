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
    expect(CONTENT.videos).toHaveLength(2);
    expect(CONTENT.evidence).toHaveLength(18);
    expect(CONTENT.team).toEqual([
      "Erik Dwornik",
      "Marc Rodig",
      "Dary Lin",
    ]);
  });

  it("describes every interactive story", () => {
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
    expect(CONTENT.videos).toHaveLength(2);
  });

  it("includes every locally hosted field and evidence image", () => {
    for (const relativePath of [
      "public/assets/qrcode.png",
      "public/assets/fields/challenge-silos-v2.jpg",
      "public/assets/fields/challenge-history-v2.jpg",
      "public/assets/fields/challenge-domain-v2.jpg",
      "public/assets/fields/challenge-research-v2.jpg",
      "public/assets/fields/opportunity-field-v2.png",
    ]) {
      expect(existsSync(join(process.cwd(), relativePath))).toBe(true);
    }
    for (const item of CONTENT.evidence) {
      expect(existsSync(join(process.cwd(), "public", item.src))).toBe(true);
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
