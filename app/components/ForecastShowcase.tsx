"use client";

import { useReducer } from "react";
import { initialDemoState } from "../demo/fixtures";
import { demoReducer } from "../demo/reducer";
import type { DemoStage } from "../demo/types";
import { DataIngestion } from "./demo/DataIngestion";
import { Explainability } from "./demo/Explainability";
import { ExportRegistry } from "./demo/ExportRegistry";
import { ExternalData } from "./demo/ExternalData";
import { ModelSelection } from "./demo/ModelSelection";
import { Results } from "./demo/Results";
import { TrainingExecution } from "./demo/TrainingExecution";

const stages: { id: DemoStage; label: string; number: string }[] = [
  { id: "ingestion", label: "Data ingestion", number: "01" },
  { id: "external", label: "External data", number: "02" },
  { id: "models", label: "Model selection", number: "03" },
  { id: "training", label: "Training", number: "04" },
  { id: "results", label: "Results", number: "05" },
  { id: "explainability", label: "Explainability", number: "06" },
  { id: "export", label: "Export and registry", number: "07" },
];

export function ForecastShowcase() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);

  const content = {
    ingestion: <DataIngestion state={state} dispatch={dispatch} />,
    external: <ExternalData state={state} dispatch={dispatch} />,
    models: <ModelSelection state={state} dispatch={dispatch} />,
    training: <TrainingExecution state={state} dispatch={dispatch} />,
    results: <Results state={state} dispatch={dispatch} />,
    explainability: <Explainability state={state} dispatch={dispatch} />,
    export: <ExportRegistry state={state} dispatch={dispatch} />,
  } satisfies Record<DemoStage, React.ReactNode>;

  return (
    <div className="showcase">
      <div className="showcase-topbar">
        <div>
          <span className="product-mark" aria-hidden="true">F</span>
          <div><strong>Forecast OS</strong><span>Crop protection demand platform</span></div>
        </div>
        <div className="showcase-actions">
          <span className="demo-badge"><i aria-hidden="true" />Illustrative showcase — no production data</span>
          <button className="text-button" type="button" onClick={() => dispatch({ type: "reset" })}>
            Reset showcase
          </button>
        </div>
      </div>
      <div className="showcase-layout">
        <div className="stage-tabs" role="tablist" aria-label="Forecasting platform stages">
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-label={stage.label}
              aria-selected={state.activeStage === stage.id}
              aria-controls="forecast-stage-panel"
              className={state.activeStage === stage.id ? "active" : ""}
              onClick={() => dispatch({ type: "set-stage", stage: stage.id })}
            >
              <span>{stage.number}</span>{stage.label}
            </button>
          ))}
        </div>
        <div className="showcase-panel" id="forecast-stage-panel" role="tabpanel">
          {content[state.activeStage]}
        </div>
      </div>
    </div>
  );
}
