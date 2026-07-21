import { Hero } from "./components/Hero";
import { SiteNav } from "./components/SiteNav";
import { StorySections } from "./components/StorySections";

export default function Page() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <StorySections />
      <section className="product-section" id="platform" aria-label="Interactive forecasting platform">
        <div className="page-shell section-placeholder">
          <p className="eyebrow light">Interactive product showcase</p>
          <h2>Explore the complete forecasting lifecycle.</h2>
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
