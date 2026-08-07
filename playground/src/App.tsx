export function App() {
  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>Empty monorepo — no components or scaffolds registered.</p>
        </div>
      </header>

      <section className="catalog-group" aria-labelledby="components-heading">
        <h2 id="components-heading">Components</h2>
        <ul className="catalog-list">
          <li>
            <span className="catalog-name">None registered</span>
            <span className="catalog-meta">kind=component</span>
          </li>
        </ul>
      </section>

      <section className="catalog-group" aria-labelledby="scaffolds-heading">
        <h2 id="scaffolds-heading">Scaffolds</h2>
        <ul className="catalog-list">
          <li>
            <span className="catalog-name">None registered</span>
            <span className="catalog-meta">kind=scaffold</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
