import { CONTENT } from "../../content/site-content";

export function BasfScope() {
  return (
    <div
      className="basf-scope"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5,39,34,.94), rgba(5,39,34,.28)), url(${CONTENT.images.scope})`,
      }}
    >
      <p className="eyebrow light">The BASF forecasting setting</p>
      <h2>{CONTENT.scopeStatement}</h2>
      <p>
        Different product groups bring different demand patterns and drivers;
        the workflow stays consistent.
      </p>
      <ul>
        {CONTENT.targets.map((target) => (
          <li key={target}>{target}</li>
        ))}
      </ul>
    </div>
  );
}
