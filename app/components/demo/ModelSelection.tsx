import type { Dispatch } from "react";
import { modelCatalog } from "../../demo/fixtures";
import { runtimeEstimateMinutes, selectedModelCount } from "../../demo/reducer";
import type { DemoAction, DemoState } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function ModelSelection({ state, dispatch }: Props) {
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 3 · Portfolio</p><h3>Model selection</h3><p>Compare robust baselines, feature-aware ML, and pretrained forecasting models.</p></div><span className="stage-status info">{selectedModelCount(state)} models selected · ~{runtimeEstimateMinutes(state)} min</span></div>
      <div className="stage-grid model-layout">
        <div className="model-catalog">
          {["Statistical", "Machine learning", "Foundation model"].map((family) => (
            <section className="model-family" key={family}><h4>{family}</h4><div>{modelCatalog.filter((model) => model.family === family).map((model) => {
              const selected = state.selectedModels.includes(model.id);
              return <button type="button" key={model.id} className={selected ? "model-card selected" : "model-card"} aria-pressed={selected} onClick={() => dispatch({ type: "toggle-model", id: model.id })}><span className="model-check" aria-hidden="true">{selected ? "✓" : ""}</span><strong>{model.name}</strong><small>{model.detail}</small></button>;
            })}</div></section>
          ))}
        </div>
        <aside className="product-card configuration-card">
          <div className="card-title"><div><span className="card-icon">⚙</span><h4>Forecast configuration</h4></div></div>
          <label>Forecast horizon<select value={state.horizonWeeks} onChange={(event) => dispatch({ type: "set-horizon", weeks: Number(event.target.value) as 13 | 26 })}><option value={13}>13 weeks</option><option value={26}>26 weeks</option></select></label>
          <label>Backtest window<select value={state.backtestWeeks} onChange={(event) => dispatch({ type: "set-backtest", weeks: Number(event.target.value) as 13 | 26 | 52 })}><option value={13}>13 weeks</option><option value={26}>26 weeks</option><option value={52}>52 weeks</option></select></label>
          <label>Evaluation metric<select value={state.metric} onChange={(event) => dispatch({ type: "set-metric", metric: event.target.value as "mae" | "wape" })}><option value="wape">WAPE</option><option value="mae">MAE</option></select></label>
          <fieldset><legend>Frequency</legend><label><input type="radio" name="frequency" checked={state.frequency === "weekly"} onChange={() => dispatch({ type: "set-frequency", frequency: "weekly" })} />Weekly</label><label><input type="radio" name="frequency" checked={state.frequency === "daily"} onChange={() => dispatch({ type: "set-frequency", frequency: "daily" })} />Daily</label></fieldset>
          <div className="config-summary"><span>Selected portfolio</span><strong>{selectedModelCount(state)} models · {state.horizonWeeks}-week horizon</strong></div>
        </aside>
      </div>
    </div>
  );
}
