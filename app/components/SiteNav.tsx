const chapters = [
  ["Story", "#challenge"],
  ["Platform", "#platform"],
  ["Videos", "#videos"],
  ["Evidence", "#evidence"],
] as const;

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Presentation chapters">
      <a className="nav-brand" href="#opening" aria-label="KIT and BASF forecasting showcase home">
        <img src="/assets/kit-logo.png" alt="KIT" />
        <span className="nav-divider" aria-hidden="true" />
        <span>Forecasting showcase</span>
      </a>
      <div className="nav-links">
        {chapters.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
