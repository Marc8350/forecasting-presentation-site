import { CONTENT } from "../content/site-content";
import { Reveal } from "./presentation/Reveal";

export function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <div className="institution-lockups" aria-label="Project partners">
            <div className="brand-plate brand-plate-kit">
              <img
                className="brand-mark brand-mark-kit"
                src="/assets/kit-logo.png"
                alt="Karlsruhe Institute of Technology (KIT)"
              />
            </div>
            <div className="brand-lockup brand-lockup-basf">
              <div className="brand-plate brand-plate-basf">
                <img
                  className="brand-mark brand-mark-basf"
                  src="/assets/basf-logo.png"
                  alt="BASF"
                />
              </div>
              <span className="brand-descriptor">Agricultural Solutions</span>
            </div>
          </div>
          <p className="hero-partnership">KIT × BASF Data Science Challenge</p>
          <h1>Forecasting, from fragmented data to confident decisions.</h1>
          <Reveal at={1}>
            <p className="hero-lede">
              A holistic, AI-assisted workflow that turns scattered signals into
              explainable forecasts—and makes the path from data to deployment
              visible.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#platform">
                Explore the platform <span aria-hidden="true">↘</span>
              </a>
              <a className="button button-ghost" href="#challenge">
                Read the story
              </a>
            </div>
          </Reveal>
          <Reveal at={3}>
            <div className="hero-team" aria-label="Project team">
              <span>Built by</span>
              <strong>{CONTENT.team.join(" · ")}</strong>
            </div>
          </Reveal>
        </div>
        <Reveal at={2} className="hero-visual">
          <div className="hero-qr-card">
            <div className="hero-qr-plate">
              <img
                src="/assets/qrcode.png"
                alt="QR code linking to the interactive forecasting mockup"
                width={224}
                height={224}
              />
            </div>
            <p className="hero-qr-caption">Scan me to explore the mockup</p>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
