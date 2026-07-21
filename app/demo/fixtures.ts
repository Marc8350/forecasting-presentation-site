import type { DemoState } from "./types";

export const initialDemoState: DemoState = {
  activeStage: "ingestion",
  sampleLoaded: false,
  selectedSources: ["weather", "crop-area", "commodity-prices", "regional-calendar"],
  sourcePreset: "weather",
  selectedModels: ["auto-ets", "lightgbm", "moirai", "chronos"],
  horizonWeeks: 13,
  backtestWeeks: 26,
  metric: "wape",
  frequency: "weekly",
  trainingStatus: "idle",
  trainingProgress: 0,
  selectedProduct: "Seed treatment",
  visibleModels: ["auto-ets", "lightgbm", "moirai"],
  exportFormat: "parquet",
  exportComplete: false,
};

export const sourcePresets = {
  minimal: [],
  weather: ["weather", "crop-area", "commodity-prices", "regional-calendar"],
  market: ["commodity-prices", "producer-prices", "trade-volume"],
  full: [
    "weather",
    "crop-area",
    "commodity-prices",
    "regional-calendar",
    "producer-prices",
    "trade-volume",
  ],
  custom: ["weather", "commodity-prices"],
} as const;

export const externalSources = [
  { id: "weather", name: "Weather observations", detail: "Temperature, rainfall, sunshine, and wind" },
  { id: "crop-area", name: "Crop area", detail: "Regional planted-area estimates" },
  { id: "commodity-prices", name: "Commodity prices", detail: "Market price and momentum signals" },
  { id: "regional-calendar", name: "Agricultural calendar", detail: "Sowing, treatment, and harvest windows" },
  { id: "producer-prices", name: "Producer price index", detail: "Input-cost and pricing pressure" },
  { id: "trade-volume", name: "Trade volume", detail: "Import and export movements" },
] as const;

export const modelCatalog = [
  { id: "auto-ets", name: "AutoETS", family: "Statistical", detail: "Robust seasonal baseline" },
  { id: "auto-theta", name: "AutoTheta", family: "Statistical", detail: "Stable trend extrapolation" },
  { id: "lightgbm", name: "LightGBM", family: "Machine learning", detail: "External feature interactions" },
  { id: "xgboost", name: "XGBoost", family: "Machine learning", detail: "Nonlinear boosted trees" },
  { id: "moirai", name: "Moirai", family: "Foundation model", detail: "Pretrained time-series forecasting" },
  { id: "chronos", name: "Chronos", family: "Foundation model", detail: "Tokenized probabilistic forecasts" },
] as const;

export const pipelineNodes = [
  { id: "bronze", name: "Bronze ingestion", input: "Weekly sales CSV", output: "Validated bronze table" },
  { id: "features", name: "Feature preparation", input: "Sales and external signals", output: "Model-ready gold features" },
  { id: "forecasting", name: "Forecasting", input: "Gold features and configuration", output: "Metrics and 13-week forecasts" },
] as const;

export const productMetrics = [
  { model: "LightGBM", family: "Machine learning", mae: 18240, wape: 8.4, rank: 1 },
  { model: "AutoETS", family: "Statistical", mae: 19880, wape: 9.1, rank: 2 },
  { model: "Moirai", family: "Foundation model", mae: 21120, wape: 9.7, rank: 3 },
  { model: "Chronos", family: "Foundation model", mae: 22940, wape: 10.5, rank: 4 },
] as const;

export const chartSeries = [42, 48, 45, 57, 55, 63, 68, 65, 74, 78, 76, 84, 88] as const;
