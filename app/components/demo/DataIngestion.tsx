import type { Dispatch } from "react";
import type { DemoAction, DemoState } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function DataIngestion({ state, dispatch }: Props) {
  return (
    <div className="stage-screen">
      <div className="stage-heading">
        <div><p className="stage-eyebrow">Step 1 · Foundation</p><h3>Data ingestion</h3><p>Bring weekly sales history into a validated, forecast-ready structure.</p></div>
        <span className={`stage-status ${state.sampleLoaded ? "success" : "neutral"}`}>
          {state.sampleLoaded ? "Validation passed" : "No sample loaded"}
        </span>
      </div>
      <div className="stage-grid two-thirds">
        <div className="product-card upload-card">
          <div className="card-title"><div><span className="card-icon">↑</span><h4>Sales data</h4></div><span>CSV · Parquet · Excel</span></div>
          <div className={`drop-zone ${state.sampleLoaded ? "loaded" : ""}`}>
            <span className="upload-symbol" aria-hidden="true">{state.sampleLoaded ? "✓" : "＋"}</span>
            <strong>{state.sampleLoaded ? "sample_crop_sales_2023_2026.csv" : "Drop your primary sales file here"}</strong>
            <p>{state.sampleLoaded ? "154 weekly observations · 4 product groups" : "The showcase keeps files local and does not upload data."}</p>
            <button className="product-button primary" type="button" onClick={() => dispatch({ type: "load-sample" })}>
              Load sample dataset
            </button>
            <button className="product-button secondary" type="button" onClick={() => dispatch({ type: "load-sample" })}>
              Choose a local file
            </button>
          </div>
          <div className="ingestion-options">
            <label>Delimiter detection<select defaultValue="auto"><option value="auto">Automatic</option><option value="comma">Comma</option><option value="semicolon">Semicolon</option></select></label>
            <label>Schema profile<select defaultValue="sales"><option value="sales">Weekly sales</option><option value="custom">Custom mapping</option></select></label>
          </div>
        </div>
        <aside className="product-card validation-card">
          <div className="card-title"><div><span className="card-icon">◇</span><h4>Validation</h4></div></div>
          <dl className="validation-list">
            <div><dt>Rows detected</dt><dd>{state.sampleLoaded ? "154" : "—"}</dd></div>
            <div><dt>Date coverage</dt><dd>{state.sampleLoaded ? "Jan 2023 – Dec 2025" : "—"}</dd></div>
            <div><dt>Frequency</dt><dd>{state.sampleLoaded ? "Weekly" : "—"}</dd></div>
            <div><dt>Missing periods</dt><dd>{state.sampleLoaded ? "0" : "—"}</dd></div>
            <div><dt>Forecast horizon</dt><dd>{state.sampleLoaded ? "13 weeks ready" : "—"}</dd></div>
          </dl>
          <div className="validation-note"><span aria-hidden="true">i</span><p>154 weeks support a 13-week horizon and a 26-week rolling backtest.</p></div>
        </aside>
      </div>
      {state.sampleLoaded && (
        <div className="schema-strip" aria-label="Detected schema">
          <span><small>week_start</small><strong>Date</strong></span>
          <span><small>product_group</small><strong>Category</strong></span>
          <span><small>region</small><strong>Text</strong></span>
          <span><small>net_sales</small><strong>Numeric target</strong></span>
        </div>
      )}
    </div>
  );
}
