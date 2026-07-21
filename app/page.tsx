import { Closing } from "./components/Closing";
import { EvidenceGallery } from "./components/EvidenceGallery";
import { ForecastShowcase } from "./components/ForecastShowcase";
import { Hero } from "./components/Hero";
import { PresentationControls } from "./components/presentation/PresentationControls";
import { PresentationDeck } from "./components/presentation/PresentationDeck";
import { PresentationSlide } from "./components/presentation/PresentationSlide";
import { Reveal } from "./components/presentation/Reveal";
import { SiteNav } from "./components/SiteNav";
import { StorySections } from "./components/StorySections";
import { VideoGallery } from "./components/VideoGallery";

const SLIDES = [
  { id: "opening", revealCount: 3 },
  { id: "challenge", revealCount: 2 },
  { id: "opportunity", revealCount: 2 },
  { id: "scope", revealCount: 2 },
  { id: "platform-overview", revealCount: 2 },
  { id: "platform", revealCount: 1 },
  { id: "videos", revealCount: 2 },
  { id: "evidence", revealCount: 1 },
  { id: "closing", revealCount: 2 },
] as const;

export default function Page() {
  return (
    <main>
      <PresentationDeck slides={SLIDES}>
        <SiteNav />

        <PresentationSlide id="opening">
          <Hero />
        </PresentationSlide>

        <StorySections />

        <PresentationSlide id="platform" className="product-section">
          <div className="page-shell">
            <Reveal at={1} className="product-intro">
              <p className="eyebrow light">Interactive forecasting platform</p>
              <h2>Explore the complete forecasting lifecycle.</h2>
              <p>
                Every control below is functional. Walk through a deterministic
                simulation from sample data to an operational champion model.
              </p>
            </Reveal>
            <div
              data-testid="forecasting-showcase-wrapper"
              data-presentation-interactive="true"
            >
              <ForecastShowcase />
            </div>
          </div>
        </PresentationSlide>

        <PresentationSlide id="videos" className="story-section video-section">
          <div className="page-shell">
            <Reveal at={1}>
              <div className="section-kicker">
                <span>05</span>
                <p>Demonstrations</p>
              </div>
              <div className="section-heading split-heading">
                <h2 id="videos-title">Three views into the working system.</h2>
                <p>
                  The original deck reserved three demo chapters. These
                  replacement-ready states explain what each future recording
                  will cover.
                </p>
              </div>
            </Reveal>
            <Reveal at={2}>
              <VideoGallery />
            </Reveal>
          </div>
        </PresentationSlide>

        <PresentationSlide
          id="evidence"
          className="story-section evidence-section"
        >
          <div className="page-shell">
            <div className="section-kicker">
              <span>06</span>
              <p>Backup evidence</p>
            </div>
            <div className="section-heading split-heading">
              <h2 id="evidence-title">
                Inspect the drivers behind each forecast.
              </h2>
              <p>
                The backup analysis remains available for technical reviewers
                without interrupting the executive story.
              </p>
            </div>
            <Reveal at={1}>
              <EvidenceGallery />
            </Reveal>
          </div>
        </PresentationSlide>

        <PresentationSlide id="closing">
          <Closing />
        </PresentationSlide>

        <PresentationControls />
      </PresentationDeck>
    </main>
  );
}
