import { Hero } from "./components/Hero";
import { ForecastShowcase } from "./components/ForecastShowcase";
import { SiteNav } from "./components/SiteNav";
import { StorySections } from "./components/StorySections";

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
      <section id="videos" aria-labelledby="videos-title" className="story-section">
        <div className="page-shell"><h2 id="videos-title">Video demonstrations</h2></div>
      </section>
      <section id="evidence" aria-labelledby="evidence-title" className="story-section">
        <div className="page-shell"><h2 id="evidence-title">Technical evidence</h2></div>
      </section>
    </main>
  );
}
