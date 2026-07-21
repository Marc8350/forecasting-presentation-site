export const CONTENT = {
  team: ["Erik Dwornik", "Marc Rodig", "Dary Lin"],
  scopeStatement:
    "In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.",
  targets: [
    "Insecticides",
    "Herbicides",
    "Fungicides",
    "Seeds",
    "Seed treatment",
  ],
  challenges: [
    {
      id: "silos",
      title: "Siloed data infrastructure",
      explanation:
        "Important sales and market signals are distributed across systems, owners, and formats.",
      image: "/assets/fields/challenge-silos-v2.png",
    },
    {
      id: "history",
      title: "Limited historical data availability",
      explanation:
        "Short or incomplete histories make robust validation and seasonality detection harder.",
      image: "/assets/fields/challenge-history-v2.png",
    },
    {
      id: "domain",
      title: "Missing domain knowledge",
      explanation:
        "Product, crop, weather, and market context are necessary to interpret forecast drivers correctly.",
      image: "/assets/fields/challenge-domain-v2.png",
    },
    {
      id: "research",
      title: "Time-intensive model research",
      explanation:
        "Repeatedly comparing new forecasting methods consumes expert time and slows business decisions.",
      image: "/assets/fields/challenge-research-v2.png",
    },
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
  opportunityUseCases: [
    {
      id: "understand",
      title: "Understand",
      explanation:
        "AI profiles unfamiliar datasets, flags quality issues, and summarizes the available forecasting context.",
    },
    {
      id: "research",
      title: "Research",
      explanation:
        "AI helps discover relevant signals, methods, and evidence for a specific product group.",
    },
    {
      id: "forecast",
      title: "Forecast",
      explanation:
        "Foundation and conventional models can be configured, compared, and combined within one workflow.",
    },
    {
      id: "explain",
      title: "Explain",
      explanation:
        "AI translates model behavior and forecast drivers for technical and business stakeholders.",
    },
  ],
  platformBlocks: [
    {
      id: "features",
      title: "Discover and build features",
      steps: [
        "Explore useful internal and external data sources.",
        "Ingest them safely through predefined data contracts.",
        "Combine signals and domain knowledge into candidate features.",
        "Rank features with statistical and machine-learning measures.",
      ],
    },
    {
      id: "models",
      title: "Model and evaluate",
      steps: [
        "Configure statistical, machine-learning, and foundation models with a few clicks.",
        "Train consistently across product groups.",
        "Backtest, compare, rank, and select candidate forecasts.",
      ],
    },
    {
      id: "operations",
      title: "Explain and operationalize",
      steps: [
        "Explain data quality, feature relevance, forecast behavior, and model choice.",
        "Adapt explanations for stakeholders with different technical backgrounds.",
        "Export results and register the champion model for operational use.",
      ],
    },
  ],
  images: {
    hero: "/assets/fields/hero-field-v2.png",
    opportunity: "/assets/fields/opportunity-field-v2.png",
    scope: "/assets/fields/scope-field-v2.png",
  },
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
