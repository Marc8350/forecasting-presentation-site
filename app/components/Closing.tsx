import { CONTENT } from "../content/site-content";
import { Reveal } from "./presentation/Reveal";

export function Closing() {
  return (
    <footer className="closing">
      <div className="page-shell closing-grid">
        <div>
          <p className="eyebrow light">Beyond this challenge</p>
          <h2>One workflow. Many forecasting realities.</h2>
          <p>
            The workflow generalizes beyond crop protection wherever teams face
            fragmented data, limited history, and high model-selection costs.
          </p>
        </div>
        <div className="closing-identities">
          <div className="institution-lockups" aria-label="Project partners">
            <div className="brand-plate brand-plate-kit">
              <img
                className="brand-mark brand-mark-kit"
                src="/assets/kit-logo.png"
                alt="Karlsruhe Institute of Technology (KIT) logo"
              />
            </div>
            <div className="brand-lockup brand-lockup-basf">
              <div className="brand-plate brand-plate-basf">
                <img
                  className="brand-mark brand-mark-basf"
                  src="/assets/basf-logo.svg"
                  alt="BASF logo"
                />
              </div>
              <Reveal at={1} className="closing-brand-descriptor">
                <span className="brand-descriptor">Agricultural Solutions</span>
              </Reveal>
            </div>
          </div>
        </div>
        <Reveal at={2} className="closing-team">
          <span>Data Science Challenge team</span>
          {CONTENT.team.map((member, index) => (
            <div key={member}>
              <span>0{index + 1}</span>
              <strong>{member}</strong>
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal at={2} className="page-shell footer-line">
        <span>Sales Forecasting Model for BASF</span>
        <span>2026 · Interactive presentation</span>
      </Reveal>
    </footer>
  );
}
