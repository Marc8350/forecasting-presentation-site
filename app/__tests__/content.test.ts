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
