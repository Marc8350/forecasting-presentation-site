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
      highlights: [
        "building one feature table means integrating systems that were never designed to talk to each other",
      ],
      image: "/assets/fields/challenge-silos-v2.jpg",
    },
    {
      id: "history",
      title: "Inconsistent data quality and data types",
      explanation:
        "Data might contain missing values or errors which are not properly documented, and comparable fields can arrive in different formats across sources — making it hard to trust a signal before it has been cleaned and validated.",
      highlights: ["missing values or errors", "cleaned and validated"],
      image: "/assets/fields/challenge-history-v2.jpg",
    },
    {
      id: "domain",
      title: "Missing domain knowledge",
      explanation:
        "When forecasting deeply technical products, the data scientist responsible for the forecast might not possess the domain knowledge needed to design the most powerful features. In our case, these are specific biological indicators for when pests are likely to emerge, based on weather conditions.",
      highlights: [
        "might not possess the domain knowledge needed to design the most powerful features",
      ],
      image: "/assets/fields/challenge-domain-v2.jpg",
    },
    {
      id: "research",
      title: "Time-intensive model research",
      explanation:
        "New models require data scientists to familiarize themselves with them: understanding how to interpret their output, what their inputs require, and how to carefully transform existing data into fitting inputs before the model can even be evaluated.",
      highlights: ["require data scientists to familiarize themselves"],
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
      highlights: [
        "visualizing it, flagging quality issues, and connecting it to the existing forecasting context.",
      ],
    },
    {
      id: "research",
      title: "Research",
      explanation:
        "AI agents help discover relevant signals in open sources, along with methods and evidence in the literature, as a foundation for building better features.",
      highlights: [
        "discover relevant signals in open sources, along with methods and evidence in the literature",
      ],
    },
    {
      id: "forecast",
      title: "Forecast",
      explanation:
        "GenAI agents help implement forecast models — understanding their architecture and intended use case within a framework that makes implementation and comparison simple, speeding up iteration.",
      highlights: ["GenAI agents help implement forecast models"],
    },
    {
      id: "explain",
      title: "Explain",
      explanation:
        "AI translates model behavior and forecast drivers for technical and business stakeholders. A non-technical stakeholder can simply ask, \"What is the most important external driver for our revenue?\" and get a clear answer.",
      highlights: [
        "AI translates model behavior and forecast drivers for technical and business stakeholders",
      ],
    },
  ],
  platformBlocks: [
    {
      id: "features",
      title: "Discover and build features",
      steps: [
        {
          text: "Explore useful internal and external data sources.",
          highlights: ["Explore", "data sources"],
        },
        {
          text: "Ingest them safely through predefined data contracts.",
          highlights: ["Ingest them safely"],
        },
        {
          text: "Combine signals and domain knowledge into candidate features.",
          highlights: ["candidate features"],
        },
        {
          text: "Rank features with statistical and machine-learning measures.",
          highlights: ["Rank features"],
        },
      ],
    },
    {
      id: "models",
      title: "Model and evaluate",
      steps: [
        {
          text: "Configure statistical, machine-learning, and foundation models with a few clicks.",
          highlights: ["Configure", "models"],
        },
        {
          text: "Train consistently across selected features.",
          highlights: ["Train consistently"],
        },
        {
          text: "Backtest, compare, rank, and select candidate forecasts.",
          highlights: ["candidate"],
        },
      ],
    },
    {
      id: "operations",
      title: "Explain and operationalize",
      steps: [
        {
          text: "Explain data quality, feature relevance, forecast behavior, and model choice.",
          highlights: ["Explain"],
        },
        {
          text: "Adapt explanations for stakeholders with different technical backgrounds.",
          highlights: ["Adapt explanations", "different"],
        },
        {
          text: "Export results and register the champion model for operational use.",
          highlights: ["Export results"],
        },
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
      description:
        "Counts how many LightGBM-recommended features fall into each signal family — weather, prices, lags, PPI, and more — for every product group, showing which feature types matter most where.",
    },
    {
      src: "/assets/evidence/top-features-by-group.png",
      title: "Top features by product group (LightGBM)",
      description:
        "Ranks the top-10 LightGBM features by composite score for Fungicides, Herbicides, and Insecticides side by side; bar length shows mean SHAP magnitude, which doesn't always track the ranking.",
    },
    {
      src: "/assets/evidence/top-features-moirai-by-group.png",
      title: "Top features by product group (Moirai)",
      description:
        "The same three-group top-feature comparison, computed for the Moirai foundation model instead of LightGBM.",
    },
    {
      src: "/assets/evidence/top-features-insecticides.png",
      title: "Insecticide drivers",
      description:
        "Top-10 LightGBM-recommended features for Insecticides, ordered by composite rank with bar length showing mean SHAP magnitude.",
    },
    {
      src: "/assets/evidence/top-features-herbicides.png",
      title: "Herbicide drivers",
      description:
        "Top-10 LightGBM-recommended features for Herbicides, ordered by composite rank with bar length showing mean SHAP magnitude.",
    },
    {
      src: "/assets/evidence/top-features-fungicides.png",
      title: "Fungicide drivers",
      description:
        "Top-10 LightGBM-recommended features for Fungicides, ordered by composite rank with bar length showing mean SHAP magnitude.",
    },
    {
      src: "/assets/evidence/top-features-seed-treatment.png",
      title: "Seed treatment drivers",
      description:
        "Top-10 LightGBM-recommended features for Seed Treatment, ordered by composite rank with bar length showing mean SHAP magnitude.",
    },
    {
      src: "/assets/evidence/top-features-field-crops-seeds.png",
      title: "Field crop seed drivers",
      description:
        "LightGBM-recommended features for Field Crops Seeds — this group recommends far fewer features than the other four, so the chart has just one bar.",
    },
    {
      src: "/assets/evidence/top-features-comparison-insecticides.png",
      title: "Insecticide driver comparison",
      description:
        "LightGBM (blue) versus Moirai (orange) feature rankings for Insecticides, side by side; each model keeps its own axis since their SHAP scales aren't directly comparable.",
    },
    {
      src: "/assets/evidence/top-features-comparison-herbicides.png",
      title: "Herbicide driver comparison",
      description:
        "LightGBM (blue) versus Moirai (orange) feature rankings for Herbicides, side by side; each model keeps its own axis since their SHAP scales aren't directly comparable.",
    },
    {
      src: "/assets/evidence/top-features-comparison-fungicides.png",
      title: "Fungicide driver comparison",
      description:
        "LightGBM (blue) versus Moirai (orange) feature rankings for Fungicides, side by side; each model keeps its own axis since their SHAP scales aren't directly comparable.",
    },
    {
      src: "/assets/evidence/top-features-comparison-seed-treatment.png",
      title: "Seed treatment driver comparison",
      description:
        "LightGBM (blue) versus Moirai (orange) feature rankings for Seed Treatment, side by side; each model keeps its own axis since their SHAP scales aren't directly comparable.",
    },
    {
      src: "/assets/evidence/top-features-comparison-field-crops-seeds.png",
      title: "Field crop seed driver comparison",
      description:
        "LightGBM (blue) versus Moirai (orange) feature rankings for Field Crops Seeds, the group with the fewest recommended features under both models.",
    },
    {
      src: "/assets/evidence/top-features-moirai-insecticides.png",
      title: "Insecticide drivers (Moirai)",
      description:
        "Top Moirai-recommended features for Insecticides, ranked the same way as the LightGBM chart for direct comparison.",
    },
    {
      src: "/assets/evidence/top-features-moirai-herbicides.png",
      title: "Herbicide drivers (Moirai)",
      description:
        "Top Moirai-recommended features for Herbicides, ranked the same way as the LightGBM chart for direct comparison.",
    },
    {
      src: "/assets/evidence/top-features-moirai-fungicides.png",
      title: "Fungicide drivers (Moirai)",
      description:
        "Top Moirai-recommended features for Fungicides, ranked the same way as the LightGBM chart for direct comparison.",
    },
    {
      src: "/assets/evidence/top-features-moirai-seed-treatment.png",
      title: "Seed treatment drivers (Moirai)",
      description:
        "Top Moirai-recommended features for Seed Treatment, ranked the same way as the LightGBM chart for direct comparison.",
    },
    {
      src: "/assets/evidence/top-features-moirai-field-crops-seeds.png",
      title: "Field crop seed drivers (Moirai)",
      description:
        "Moirai recommends only two features for Field Crops Seeds, far fewer than the roughly 15 typical for the other four groups.",
    },
  ],
} as const;
