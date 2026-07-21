import { CONTENT } from "../content/site-content";

export function Closing() {
  return (
    <footer className="closing">
      <div className="page-shell closing-grid">
        <div>
          <p className="eyebrow light">Beyond this challenge</p>
          <h2>One workflow. Many forecasting realities.</h2>
          <p>The workflow generalizes beyond crop protection wherever teams face fragmented data, limited history, and high model-selection costs.</p>
        </div>
        <div className="closing-team">
          <span>Data Science Challenge team</span>
          {CONTENT.team.map((member, index) => <div key={member}><span>0{index + 1}</span><strong>{member}</strong></div>)}
          <img src="/assets/kit-logo.png" alt="Karlsruhe Institute of Technology" />
        </div>
      </div>
      <div className="page-shell footer-line"><span>Sales Forecasting Model for BASF</span><span>2026 · Interactive case study</span></div>
    </footer>
  );
}
