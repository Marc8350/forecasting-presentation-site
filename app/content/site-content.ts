export const CONTENT = {
  team: ["Erik Dwornik", "Marc Rodig", "Dary Lin"],
  targets: [
    "Insecticides",
    "Herbicides",
    "Fungicides",
    "Seeds",
    "Seed treatment",
  ],
  challenges: [
    "Siloed data infrastructure",
    "Limited historical data availability",
    "Missing domain knowledge",
    "Time-intensive model research",
  ],
  opportunity: {
    title: "A holistic GenAI opportunity",
    body: "Combine transformer-based forecasting with agentic support across data understanding, model research, evaluation, and operationalization.",
  },
  videos: [
    {
      id: "demo-1",
      title: "From data to a forecast-ready foundation",
      description:
        "See how sales history and external signals become a validated forecasting dataset.",
      duration: "Runtime unavailable",
    },
    {
      id: "demo-2",
      title: "Selecting and training the right model portfolio",
      description:
        "Compare statistical, machine-learning, and foundation-model strategies in one workflow.",
      duration: "Runtime unavailable",
    },
    {
      id: "demo-3",
      title: "Explaining, exporting, and operationalizing results",
      description:
        "Move from model rankings and feature drivers to registry and retraining decisions.",
      duration: "Runtime unavailable",
    },
  ],
  evidence: [
    {
      src: "/assets/evidence/composite-ranking.png",
      title: "Cross-category feature ranking",
    },
    {
      src: "/assets/evidence/seeds.png",
      title: "Field crop seed drivers",
    },
    {
      src: "/assets/evidence/herbicides.png",
      title: "Herbicide drivers",
    },
    {
      src: "/assets/evidence/fungicides.png",
      title: "Fungicide drivers",
    },
    {
      src: "/assets/evidence/seed-treatment.png",
      title: "Seed treatment drivers",
    },
    {
      src: "/assets/evidence/insecticides.png",
      title: "Insecticide drivers",
    },
    {
      src: "/assets/evidence/feature-family-map.png",
      title: "Recommended feature families",
    },
  ],
} as const;
