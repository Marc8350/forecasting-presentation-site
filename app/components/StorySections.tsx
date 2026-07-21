import { CONTENT } from "../content/site-content";

const journey = [
  ["01", "Ingest", "Validate sales history and schema"],
  ["02", "Enrich", "Add weather, market, and crop signals"],
  ["03", "Select", "Compare three model families"],
  ["04", "Train", "Execute a transparent pipeline"],
  ["05", "Evaluate", "Rank forecasts and backtests"],
  ["06", "Explain", "Surface the strongest drivers"],
  ["07", "Operationalize", "Export, register, and retrain"],
] as const;

export function StorySections() {
  return (
    <>
      <section className="story-section challenge-section" id="challenge" aria-labelledby="challenge-title">
        <div className="page-shell">
          <div className="section-kicker"><span>01</span><p>The business challenge</p></div>
          <div className="section-heading split-heading">
            <h2 id="challenge-title">Forecasting is more than choosing a model.</h2>
            <p>
              Conventional forecasting often begins with proprietary history
              and ends with a model score. The difficult work happens in
              between: finding signals, validating assumptions, and turning
              results into decisions.
            </p>
          </div>
          <div className="challenge-grid">
            {CONTENT.challenges.map((challenge, index) => (
              <article className="challenge-card" key={challenge}>
                <span>0{index + 1}</span>
                <h3>{challenge}</h3>
                <p>{[
                  "Critical signals live across systems and owners.",
                  "Short histories make robust evaluation difficult.",
                  "Forecast drivers demand product and market context.",
                  "New methods require repeated discovery and validation.",
                ][index]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section opportunity-section" id="opportunity" aria-labelledby="opportunity-title">
        <div className="page-shell opportunity-grid">
          <div className="opportunity-copy">
            <div className="section-kicker light"><span>02</span><p>The opportunity</p></div>
            <h2 id="opportunity-title">{CONTENT.opportunity.title}</h2>
            <p className="large-copy">{CONTENT.opportunity.body}</p>
            <div className="opportunity-pill-row">
              <span>Transformer forecasting</span>
              <span>Agentic research support</span>
              <span>Explainable decisions</span>
            </div>
          </div>
          <div className="opportunity-orbit" aria-label="AI-assisted forecasting lifecycle">
            <div className="orbit-center"><strong>GenAI</strong><span>across the lifecycle</span></div>
            <div className="orbit-node orbit-a">Understand</div>
            <div className="orbit-node orbit-b">Research</div>
            <div className="orbit-node orbit-c">Forecast</div>
            <div className="orbit-node orbit-d">Explain</div>
          </div>
        </div>
      </section>

      <section className="story-section scope-section" id="scope" aria-labelledby="scope-title">
        <div className="page-shell">
          <div className="section-kicker"><span>03</span><p>Forecasting scope</p></div>
          <div className="section-heading split-heading">
            <h2 id="scope-title">Five categories. Different drivers. One system.</h2>
            <p>
              The workflow stays consistent while each product group keeps its
              own demand pattern, external signals, champion model, and
              explanation.
            </p>
          </div>
          <div className="target-list">
            {CONTENT.targets.map((target, index) => (
              <div className="target-row" key={target}>
                <span className="target-index">0{index + 1}</span>
                <strong>{target}</strong>
                <span className="target-line" aria-hidden="true" />
                <span className="target-status">Forecast target</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section journey-section" id="platform-overview" aria-labelledby="journey-title">
        <div className="page-shell">
          <div className="section-kicker"><span>04</span><p>The platform</p></div>
          <div className="section-heading split-heading">
            <h2 id="journey-title">A connected path from raw history to operational forecasts.</h2>
            <p>
              Every stage exposes its assumptions and hands structured state to
              the next. Explore the same workflow below as an interactive
              product experience.
            </p>
          </div>
          <ol className="journey-list">
            {journey.map(([number, title, detail]) => (
              <li key={number}>
                <span>{number}</span>
                <div><strong>{title}</strong><p>{detail}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
