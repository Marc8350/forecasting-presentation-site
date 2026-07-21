import type { Dispatch } from "react";
import type { DemoAction, DemoState, ExportFormat } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function ExportRegistry({ state, dispatch }: Props) {
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 7 · Operations</p><h3>Model export and registry</h3><p>Package forecasts, register champions, and define the operating cadence.</p></div><span className="stage-status success">4 champions selected</span></div>
      <div className="stage-grid export-layout">
        <div className="product-card">
          <div className="card-title"><div><span className="card-icon">⇩</span><h4>Export forecast table</h4></div><span>52 rows</span></div>
          <p className="card-copy">13 weeks × 4 product groups. All values remain illustrative and local to this browser.</p>
          <fieldset className="format-options"><legend>File format</legend>{(["csv", "parquet", "excel"] as ExportFormat[]).map((format) => <label key={format}><input type="radio" name="format" checked={state.exportFormat === format} onChange={() => dispatch({ type: "set-export-format", format })}/><span>{format === "csv" ? "CSV" : format === "parquet" ? "Parquet" : "Excel"}</span></label>)}</fieldset>
          <div className="export-preview"><span>forecast_week</span><span>product_group</span><span>prediction</span><span>lower_90</span><span>upper_90</span></div>
        </div>
        <div className="product-card operations-card">
          <div className="card-title"><div><span className="card-icon">◎</span><h4>Operating configuration</h4></div><span>Registry ready</span></div>
          <label>Retraining cadence<select defaultValue="monthly"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></select></label>
          <label>Serving mode<select defaultValue="batch"><option value="batch">Scheduled batch</option><option value="endpoint">On-demand endpoint</option></select></label>
          <div className="toggle-list"><label><input type="checkbox" defaultChecked/><span>Error alerts</span></label><label><input type="checkbox" defaultChecked/><span>WAPE threshold alerts</span></label><label><input type="checkbox"/><span>Online serving endpoint</span></label></div>
          <div className="champion-strip"><span>Seed treatment</span><strong>LightGBM · v1</strong></div>
        </div>
      </div>
      <div className="export-action-row">
        <button className="product-button primary" type="button" onClick={() => dispatch({ type: "complete-export" })}>Simulate export and registration</button>
        {state.exportComplete && <span className="export-complete"><i aria-hidden="true">✓</i>Illustrative export completed</span>}
      </div>
    </div>
  );
}
