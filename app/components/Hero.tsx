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
          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src={CONTENT.images.hero}
              alt="Agricultural field at sunset"
            />
            <div className="hero-photo-caption">
              <span>Sales forecasting</span>
              <span>From signals to decisions</span>
            </div>
          </div>
          <div className="signal-card signal-card-top">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>13-week horizon</strong>
              <span>Forecast-ready workflow</span>
            </div>
          </div>
          <div className="signal-card signal-card-bottom">
            <span className="mini-chart" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <div>
              <strong>5 target groups</strong>
              <span>One coherent platform</span>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal at={3} className="hero-metrics page-shell">
        <div>
          <strong>5</strong>
          <span>Forecast targets</span>
        </div>
        <div>
          <strong>13</strong>
          <span>Week horizon</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Model families</span>
        </div>
        <div>
          <strong>1</strong>
          <span>End-to-end workflow</span>
        </div>
      </Reveal>
    </header>
  );
}
