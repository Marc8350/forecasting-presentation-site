import type { Dispatch } from "react";
import { chartSeries, productMetrics } from "../../demo/fixtures";
import { CONTENT } from "../../content/site-content";
import type { DemoAction, DemoState } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function Results({ state, dispatch }: Props) {
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 5 · Evaluation</p><h3>Forecast results and metrics</h3><p>Compare model quality, inspect the horizon, and identify a champion.</p></div><span className="stage-status success">13-week forecast ready</span></div>
      <div className="result-controls"><label>Product group<select value={state.selectedProduct} onChange={(event) => dispatch({ type: "set-product", product: event.target.value })}>{CONTENT.targets.map((target) => <option key={target}>{target}</option>)}</select></label><span>Illustrative metrics · rolling backtest</span></div>
      <div className="stage-grid result-layout">
        <div className="product-card ranking-card">
          <div className="card-title"><div><span className="card-icon">≡</span><h4>Model ranking</h4></div><span>Sorted by WAPE</span></div>
          <div className="ranking-table" role="table" aria-label="Model ranking">
            <div role="row" className="ranking-head"><span>Rank</span><span>Model</span><span>WAPE</span><span>MAE</span></div>
            {productMetrics.map((item) => <div role="row" key={item.model} className={item.rank === 1 ? "champion" : ""}><span>{item.rank}</span><span><strong>{item.model}</strong><small>{item.family}</small></span><span>{item.wape}%</span><span>{item.mae.toLocaleString("en-US")}</span></div>)}
          </div>
        </div>
        <div className="product-card forecast-card">
          <div className="card-title"><div><span className="card-icon">⌁</span><h4>Forecast visualization</h4></div><span>{state.selectedProduct}</span></div>
          <div className="forecast-meta"><strong>Historical sales → 13-week forecast</strong><span>90% confidence interval</span></div>
          <div className="css-chart" role="img" aria-label="Illustrative weekly sales forecast with rising values and confidence interval">
            <div className="chart-grid" aria-hidden="true"><i/><i/><i/><i/></div>
            <div className="chart-bars" aria-hidden="true">{chartSeries.map((value, index) => <i key={`${value}-${index}`} style={{ height: `${value}%` }} className={index > 8 ? "forecast" : "history"} />)}</div>
            <div className="confidence-band" aria-hidden="true" />
          </div>
          <div className="chart-legend"><span><i className="history"/>History</span><span><i className="forecast"/>LightGBM forecast</span><span><i className="band"/>Confidence interval</span></div>
        </div>
      </div>
      <div className="model-visibility"><strong>Visible forecasts</strong>{["auto-ets", "lightgbm", "moirai"].map((id) => <label key={id}><input type="checkbox" checked={state.visibleModels.includes(id)} onChange={() => dispatch({ type: "toggle-visible-model", id })}/>{id === "auto-ets" ? "AutoETS" : id === "lightgbm" ? "LightGBM" : "Moirai"}</label>)}</div>
    </div>
  );
}
