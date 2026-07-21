import type { Dispatch } from "react";
import { externalSources } from "../../demo/fixtures";
import { selectedFeatureCount } from "../../demo/reducer";
import type { DemoAction, DemoState, SourcePreset } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };
const presets: { id: SourcePreset; label: string }[] = [
  { id: "minimal", label: "Minimal — sales only" },
  { id: "weather", label: "Weather focus" },
  { id: "market", label: "Market focus" },
  { id: "full", label: "Full agriculture" },
  { id: "custom", label: "Custom" },
];
const hubs = ["Hannover · North", "Magdeburg · East", "Münster · West", "Karlsruhe · Mid-south", "Landshut · South"];

export function ExternalData({ state, dispatch }: Props) {
  const featureCount = selectedFeatureCount(state);
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 2 · Enrichment</p><h3>External data configuration</h3><p>Select the signals that may explain demand beyond sales history.</p></div><span className="stage-status info">{featureCount} external features selected</span></div>
      <div className="preset-row" aria-label="Source presets">
        {presets.map((preset) => <button key={preset.id} className={state.sourcePreset === preset.id ? "active" : ""} type="button" onClick={() => dispatch({ type: "apply-preset", preset: preset.id })}>{preset.label}</button>)}
      </div>
      <div className="stage-grid half">
        <div className="product-card">
          <div className="card-title"><div><span className="card-icon">＋</span><h4>Signal catalog</h4></div><span>{featureCount} / {externalSources.length}</span></div>
          <div className="source-list">
            {externalSources.map((source) => (
              <label key={source.id} className={state.selectedSources.includes(source.id) ? "selected" : ""}>
                <input type="checkbox" checked={state.selectedSources.includes(source.id)} onChange={() => dispatch({ type: "toggle-source", id: source.id })} />
                <span className="custom-check" aria-hidden="true">{state.selectedSources.includes(source.id) ? "✓" : ""}</span>
                <span><strong>{source.name}</strong><small>{source.detail}</small></span>
              </label>
            ))}
          </div>
        </div>
        <div className="product-card map-card">
          <div className="card-title"><div><span className="card-icon">⌖</span><h4>Regional hubs</h4></div><span>Germany</span></div>
          <div className="germany-map" aria-label="Five regional data hubs in Germany">
            <div className="map-shape" aria-hidden="true" />
            {hubs.map((hub, index) => <span key={hub} className={`map-pin pin-${index + 1}`} title={hub}>{index + 1}</span>)}
          </div>
          <ul className="hub-list">{hubs.map((hub, index) => <li key={hub}><span>{index + 1}</span>{hub}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
