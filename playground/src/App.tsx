import catalog from "./foundation-catalog.json";

type CatalogComponent = {
  id: number;
  name: string;
  displayName: string;
  fileKind: string;
  stub?: boolean;
};

type CatalogGroup = {
  id: string;
  name: string;
  idRange: { min: number; max: number };
  components: CatalogComponent[];
};

const groups = catalog.groups as CatalogGroup[];
const total = groups.reduce((n, g) => n + g.components.length, 0);
const scaffolds = (catalog as { scaffolds?: unknown[] }).scaffolds ?? [];

export function App() {
  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>
            Empty Layer 1 foundation — {total} component stubs · {scaffolds.length} scaffolds.
            Implementations and demos are cleared; packages return null / reserved CSS only.
          </p>
        </div>
      </header>

      <section className="catalog-group" aria-labelledby="scaffolds-heading">
        <h2 id="scaffolds-heading">Scaffolds</h2>
        {scaffolds.length === 0 ? (
          <ul className="catalog-list">
            <li>
              <span className="catalog-name">None registered</span>
              <span className="catalog-meta">kind=scaffold · reserved</span>
            </li>
          </ul>
        ) : null}
      </section>

      {groups.map((group) => (
        <section key={group.id} className="catalog-group" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`}>
            {group.name}{" "}
            <span className="catalog-meta">
              #{group.idRange.min}–{group.idRange.max}
            </span>
          </h2>
          <ul className="catalog-list">
            {group.components.map((c) => (
              <li key={c.id}>
                <span className="catalog-name">
                  {c.displayName}
                  <span className="catalog-badge">stub</span>
                </span>
                <span className="catalog-meta">
                  {c.id} · {c.name} · {c.fileKind}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
