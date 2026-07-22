import { CONTENT } from "./content/site-content";
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

export default function Page() {
  return (
    <main>
      <PresentationDeck>
        <SiteNav />

        <PresentationSlide id="opening" revealGroupCount={3}>
          <Hero />
        </PresentationSlide>

        <StorySections />

        <PresentationSlide
          id="platform"
          className="product-section"
          revealGroupCount={1}
          mode="flow"
        >
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

        <PresentationSlide
          id="videos"
          className="story-section video-section"
          revealGroupCount={2}
          cycles={[{ at: 2, itemCount: CONTENT.videos.length }]}
        >
          <div className="page-shell">
            <Reveal at={1}>
              <div className="section-kicker">
                <span>04</span>
                <p>Demonstrations</p>
              </div>
              <div className="section-heading split-heading">
                <h2 id="videos-title">Two views into the working system.</h2>
                <p>
                  Watch the platform in action: a data scientist exploring what
                  the system already knows, and a domain expert extending it
                  with a new signal.
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
          revealGroupCount={1}
          mode="flow"
        >
          <div className="page-shell">
            <div className="section-kicker">
              <span>05</span>
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

        <PresentationSlide id="closing" revealGroupCount={3}>
          <Closing />
        </PresentationSlide>

        <PresentationControls />
      </PresentationDeck>
    </main>
  );
}
