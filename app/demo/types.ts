export type DemoStage =
  | "ingestion"
  | "external"
  | "models"
  | "training"
  | "results"
  | "explainability"
  | "export";

export type SourcePreset = "minimal" | "weather" | "market" | "full" | "custom";
export type TrainingStatus = "idle" | "running" | "cancelled" | "complete";
export type ExportFormat = "csv" | "parquet" | "excel";

export type DemoState = {
  activeStage: DemoStage;
  sampleLoaded: boolean;
  selectedSources: string[];
  sourcePreset: SourcePreset;
  selectedModels: string[];
  horizonWeeks: 13 | 26;
  backtestWeeks: 13 | 26 | 52;
  metric: "mae" | "wape";
  frequency: "weekly" | "daily";
  trainingStatus: TrainingStatus;
  trainingProgress: number;
  selectedProduct: string;
  visibleModels: string[];
  exportFormat: ExportFormat;
  exportComplete: boolean;
};

export type DemoAction =
  | { type: "set-stage"; stage: DemoStage }
  | { type: "load-sample" }
  | { type: "apply-preset"; preset: SourcePreset }
  | { type: "toggle-source"; id: string }
  | { type: "toggle-model"; id: string }
  | { type: "set-horizon"; weeks: 13 | 26 }
  | { type: "set-backtest"; weeks: 13 | 26 | 52 }
  | { type: "set-metric"; metric: "mae" | "wape" }
  | { type: "set-frequency"; frequency: "weekly" | "daily" }
  | { type: "start-training" }
  | { type: "set-training-progress"; value: number }
  | { type: "cancel-training" }
  | { type: "finish-training" }
  | { type: "set-product"; product: string }
  | { type: "toggle-visible-model"; id: string }
  | { type: "set-export-format"; format: ExportFormat }
  | { type: "complete-export" }
  | { type: "reset" };
