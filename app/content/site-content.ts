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
    {
      id: "silos",
      title: "Siloed data infrastructure",
      explanation:
        "Features are scattered across multiple, non-connected sources: important signals are distributed across systems, owners, and formats. An ERP system holding order data, for example, usually isn't connected to a weather platform — so building one feature table means integrating systems that were never designed to talk to each other.",
      image: "/assets/fields/challenge-silos-v2.jpg",
    },
    {
      id: "history",
      title: "Inconsistent data quality and data types",
      explanation:
        "Data might contain missing values or errors which are not properly documented, and comparable fields can arrive in different formats across sources — making it hard to trust a signal before it has been cleaned and validated.",
      image: "/assets/fields/challenge-history-v2.jpg",
    },
    {
      id: "domain",
      title: "Missing domain knowledge",
      explanation:
        "When forecasting deeply technical products, the data scientist responsible for the forecast might not possess the domain knowledge needed to design the most powerful features. In our case, these are specific biological indicators for when pests are likely to emerge, based on weather conditions.",
      image: "/assets/fields/challenge-domain-v2.jpg",
    },
    {
      id: "research",
      title: "Time-intensive model research",
      explanation:
        "New models require data scientists to familiarize themselves with them: understanding how to interpret their output, what their inputs require, and how to carefully transform existing data into fitting inputs before the model can even be evaluated.",
      image: "/assets/fields/challenge-research-v2.jpg",
    },
  ],
  opportunity: {
    title: "A holistic GenAI opportunity",
    body: "Combine transformer-based forecasting with agentic support across data understanding, model research, evaluation, and operationalization.",
  },
  videos: [
    {
      id: "demo-1",
      title: "Exploring the features already in the system",
      description:
        "A data scientist walks through the features already available in the platform before building anything new on top of them.",
      youtubeId: "3SmZsfm7_mw",
    },
    {
      id: "demo-2",
      title: "Contributing a new feature",
      description:
        "A biologist first reviews the existing data, then discovers new open-source soil data and ingests it into the architecture automatically.",
      youtubeId: "hBWWQyUH2-U",
    },
  ],
  opportunityUseCases: [
    {
      id: "understand",
      title: "Understand",
      explanation:
        "AI takes the role of an advising data scientist: helping you understand a datasource by visualizing it, flagging quality issues, and connecting it to the existing forecasting context.",
    },
    {
      id: "research",
      title: "Research",
      explanation:
        "AI agents help discover relevant signals in open sources, along with methods and evidence in the literature, as a foundation for building better features.",
    },
    {
      id: "forecast",
      title: "Forecast",
      explanation:
        "GenAI agents help implement forecast models — understanding their architecture and intended use case within a framework that makes implementation and comparison simple, speeding up iteration.",
    },
    {
      id: "explain",
      title: "Explain",
      explanation:
        "AI translates model behavior and forecast drivers for technical and business stakeholders. A non-technical stakeholder can simply ask, \"What is the most important external driver for our revenue?\" and get a clear answer.",
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
        "Train consistently across selected features.",
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
    opportunity: "/assets/fields/opportunity-field-v2.png",
  },
  evidence: [
    {
      src: "/assets/evidence/heatmap-family-importance.png",
      title: "Cross-category feature importance heatmap",
    },
    {
      src: "/assets/evidence/top-features-by-group.png",
      title: "Top features by product group (LightGBM)",
    },
    {
      src: "/assets/evidence/top-features-moirai-by-group.png",
      title: "Top features by product group (Moirai)",
    },
    {
      src: "/assets/evidence/top-features-insecticides.png",
      title: "Insecticide drivers",
    },
    {
      src: "/assets/evidence/top-features-herbicides.png",
      title: "Herbicide drivers",
    },
    {
      src: "/assets/evidence/top-features-fungicides.png",
      title: "Fungicide drivers",
    },
    {
      src: "/assets/evidence/top-features-seed-treatment.png",
      title: "Seed treatment drivers",
    },
    {
      src: "/assets/evidence/top-features-field-crops-seeds.png",
      title: "Field crop seed drivers",
    },
    {
      src: "/assets/evidence/top-features-comparison-insecticides.png",
      title: "Insecticide driver comparison",
    },
    {
      src: "/assets/evidence/top-features-comparison-herbicides.png",
      title: "Herbicide driver comparison",
    },
    {
      src: "/assets/evidence/top-features-comparison-fungicides.png",
      title: "Fungicide driver comparison",
    },
    {
      src: "/assets/evidence/top-features-comparison-seed-treatment.png",
      title: "Seed treatment driver comparison",
    },
    {
      src: "/assets/evidence/top-features-comparison-field-crops-seeds.png",
      title: "Field crop seed driver comparison",
    },
    {
      src: "/assets/evidence/top-features-moirai-insecticides.png",
      title: "Insecticide drivers (Moirai)",
    },
    {
      src: "/assets/evidence/top-features-moirai-herbicides.png",
      title: "Herbicide drivers (Moirai)",
    },
    {
      src: "/assets/evidence/top-features-moirai-fungicides.png",
      title: "Fungicide drivers (Moirai)",
    },
    {
      src: "/assets/evidence/top-features-moirai-seed-treatment.png",
      title: "Seed treatment drivers (Moirai)",
    },
    {
      src: "/assets/evidence/top-features-moirai-field-crops-seeds.png",
      title: "Field crop seed drivers (Moirai)",
    },
  ],
} as const;
