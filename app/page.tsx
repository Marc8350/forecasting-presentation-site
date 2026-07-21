import { Hero } from "./components/Hero";
import { ForecastShowcase } from "./components/ForecastShowcase";
import { Closing } from "./components/Closing";
import { EvidenceGallery } from "./components/EvidenceGallery";
import { SiteNav } from "./components/SiteNav";
import { StorySections } from "./components/StorySections";
import { VideoGallery } from "./components/VideoGallery";

export default function Page() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <StorySections />
      <section className="product-section" id="platform" aria-label="Interactive forecasting platform">
        <div className="page-shell">
          <div className="product-intro">
            <p className="eyebrow light">Interactive product showcase</p>
            <h2>Explore the complete forecasting lifecycle.</h2>
            <p>Every control below is functional. Walk through a deterministic simulation from sample data to an operational champion model.</p>
          </div>
          <ForecastShowcase />
        </div>
      </section>
      <section id="videos" aria-labelledby="videos-title" className="story-section video-section">
        <div className="page-shell">
          <div className="section-kicker"><span>05</span><p>Demonstrations</p></div>
          <div className="section-heading split-heading"><h2 id="videos-title">Three views into the working system.</h2><p>The original deck reserved three demo chapters. These replacement-ready states explain what each future recording will cover.</p></div>
          <VideoGallery />
        </div>
      </section>
      <section id="evidence" aria-labelledby="evidence-title" className="story-section evidence-section">
        <div className="page-shell">
          <div className="section-kicker"><span>06</span><p>Backup evidence</p></div>
          <div className="section-heading split-heading"><h2 id="evidence-title">Inspect the drivers behind each forecast.</h2><p>The backup analysis remains available for technical reviewers without interrupting the executive story.</p></div>
          <EvidenceGallery />
        </div>
      </section>
      <Closing />
    </main>
  );
}
