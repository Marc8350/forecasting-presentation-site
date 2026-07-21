export default function Page() {
  return (
    <main>
      <nav aria-label="Presentation chapters">
        <a href="#challenge">Challenge</a>
        <a href="#platform">Platform</a>
        <a href="#evidence">Evidence</a>
      </nav>
      <header>
        <p>Data Science Challenge 2026</p>
        <h1>Forecasting, from fragmented data to confident decisions.</h1>
      </header>
      <section id="challenge" aria-labelledby="challenge-title">
        <h2 id="challenge-title">The forecasting challenge</h2>
      </section>
      <section id="platform" aria-label="Interactive forecasting platform" />
      <section id="evidence" aria-labelledby="evidence-title">
        <h2 id="evidence-title">Technical evidence</h2>
      </section>
    </main>
  );
}
