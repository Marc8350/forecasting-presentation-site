import { CONTENT } from "../content/site-content";
import { PresentationSlide } from "./presentation/PresentationSlide";
import { Reveal } from "./presentation/Reveal";
import { ChallengeExplorer } from "./story/ChallengeExplorer";
import { OpportunityExplorer } from "./story/OpportunityExplorer";
import { PlatformBlocks } from "./story/PlatformBlocks";

export function StorySections() {
  return (
    <>
      <PresentationSlide
        id="challenge"
        className="story-section challenge-section"
      >
        <div className="page-shell">
          <div className="section-kicker">
            <span>01</span>
            <p>The business challenge</p>
          </div>
          <div className="section-heading split-heading">
            <h2 id="challenge-title">
              Forecasting is more than choosing a model.
            </h2>
            <p>
              The difficult work happens between historical data and a model
              score: finding signals, validating assumptions, and turning
              results into decisions.
            </p>
          </div>
          <Reveal at={1}>
            <ChallengeExplorer />
          </Reveal>
          <Reveal at={2} className="story-takeaway">
            <p>
              A useful platform must reduce all four constraints without hiding
              the evidence behind a recommendation.
            </p>
          </Reveal>
        </div>
      </PresentationSlide>

      <PresentationSlide
        id="opportunity"
        className="story-section opportunity-section"
      >
        <div className="page-shell opportunity-grid">
          <div className="opportunity-copy">
            <div className="section-kicker light">
              <span>02</span>
              <p>The opportunity</p>
            </div>
            <h2 id="opportunity-title">{CONTENT.opportunity.title}</h2>
            <p className="large-copy">{CONTENT.opportunity.body}</p>
            <Reveal at={2} className="opportunity-pill-row">
              <span>Transformer forecasting</span>
              <span>Agentic research support</span>
              <span>Explainable decisions</span>
            </Reveal>
          </div>
          <Reveal at={1}>
            <OpportunityExplorer />
          </Reveal>
        </div>
      </PresentationSlide>

      <PresentationSlide
        id="platform-overview"
        className="story-section journey-section"
      >
        <div className="page-shell">
          <div className="section-kicker">
            <span>03</span>
            <p>The platform</p>
          </div>
          <div className="section-heading split-heading">
            <h2 id="journey-title">
              A connected path from raw history to operational forecasts.
            </h2>
            <p>
              Choose a workflow block to inspect how structured state moves from
              feature discovery through operationalization.
            </p>
          </div>
          <Reveal at={1}>
            <PlatformBlocks />
          </Reveal>
          <Reveal at={2} className="story-takeaway">
            <p>
              Our framework provides theoretical grounding as guardrails for the
              agents, and carefully manages context across all stages.
            </p>
          </Reveal>
        </div>
      </PresentationSlide>
    </>
  );
}
