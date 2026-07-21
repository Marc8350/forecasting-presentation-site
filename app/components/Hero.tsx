import { CONTENT } from "../content/site-content";

export function Hero() {
  return (
    <header className="hero" id="opening">
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <p className="eyebrow light">Data Science Challenge 2026</p>
          <h1>Forecasting, from fragmented data to confident decisions.</h1>
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
          <div className="hero-team" aria-label="Project team">
            <span>Built by</span>
            <strong>{CONTENT.team.join(" · ")}</strong>
          </div>
        </div>
        <div className="hero-visual" aria-label="Forecasting platform preview">
          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src="/assets/kit-building.jpg"
              alt="KIT campus building"
            />
            <div className="hero-photo-caption">
              <span>KIT × BASF</span>
              <span>Sales forecasting model</span>
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
              <i /><i /><i /><i /><i />
            </span>
            <div>
              <strong>5 target groups</strong>
              <span>One coherent platform</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-metrics page-shell" aria-label="Project scope">
        <div><strong>5</strong><span>Forecast targets</span></div>
        <div><strong>13</strong><span>Week horizon</span></div>
        <div><strong>3</strong><span>Model families</span></div>
        <div><strong>1</strong><span>End-to-end workflow</span></div>
      </div>
    </header>
  );
}
