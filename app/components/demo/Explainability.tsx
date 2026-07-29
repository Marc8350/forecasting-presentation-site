import type { Dispatch } from "react";
import type { DemoAction, DemoState } from "../../demo/types";

type Props = { state: DemoState; dispatch: Dispatch<DemoAction> };

export function Explainability({ state }: Props) {
  return (
    <div className="stage-screen">
      <div className="stage-heading"><div><p className="stage-eyebrow">Step 6 · Trust</p><h3>Explainability and drivers</h3><p>See which external signals influence the champion forecast and how they vary by product.</p></div><span className="stage-status info">Champion · LightGBM</span></div>
      <div className="stage-grid explain-layout">
        <div className="product-card explain-image-card"><div className="card-title"><div><span className="card-icon">↗</span><h4>Top drivers · {state.selectedProduct}</h4></div><span>Mean |SHAP|</span></div><img src="/assets/evidence/top-features-seed-treatment.png" alt="Feature importance chart for the seed treatment LightGBM model" /></div>
        <div className="driver-summary">
          <article><span>01</span><div><strong>Regional precipitation</strong><p>Recent moisture conditions align with treatment timing and near-term demand.</p></div></article>
          <article><span>02</span><div><strong>Order-to-delivery lag</strong><p>Operational lead times are a strong signal for the shape of upcoming sales.</p></div></article>
          <article><span>03</span><div><strong>Commodity momentum</strong><p>Market expectations provide context beyond the sales series alone.</p></div></article>
          <div className="plain-language-note"><strong>In plain English</strong><p>The champion forecast combines the recent sales pattern with weather, logistics, and market context. Importance indicates influence—not causation.</p></div>
        </div>
      </div>
    </div>
  );
}
