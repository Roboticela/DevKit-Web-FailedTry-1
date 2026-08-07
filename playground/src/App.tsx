import catalog from "./foundation-catalog.json";

type CatalogComponent = {
  id: number;
  name: string;
  displayName: string;
  stub?: boolean;
};

type Subgroup = {
  id: string;
  name: string;
  components: CatalogComponent[];
};

type Group = {
  id: string;
  name: string;
  description: string;
  templates: string[];
  subgroups: Subgroup[];
};

const groups = catalog.groups as Group[];

function packageCount(group: Group) {
  return group.subgroups.reduce((n, s) => n + s.components.length, 0);
}

export function App() {
  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>
            Layer 1 stubs — Interaction Controls packages are registered empty
            for both templates.
          </p>
        </div>
      </header>

      {groups.map((group) => (
        <section
          key={group.id}
          className="catalog-group"
          aria-labelledby={`group-${group.id}`}
        >
          <h2 id={`group-${group.id}`}>{group.name}</h2>
          <p className="catalog-group-desc">{group.description}</p>
          <p className="catalog-group-meta">
            templates={group.templates.join(", ")} · subgroups=
            {group.subgroups.length} · packages={packageCount(group)}
          </p>

          {group.subgroups.map((subgroup) => (
            <div key={subgroup.id} className="catalog-subgroup">
              <h3 className="catalog-subgroup-title">
                {subgroup.name}
                <span className="catalog-meta">
                  {" "}
                  · {subgroup.components.length} packages
                </span>
              </h3>
              <ul className="catalog-list">
                {subgroup.components.length === 0 ? (
                  <li>
                    <span className="catalog-name">None registered</span>
                    <span className="catalog-meta">{subgroup.id}</span>
                  </li>
                ) : (
                  subgroup.components.map((comp) => (
                    <li key={comp.name}>
                      <span className="catalog-name">
                        {String(comp.id).padStart(3, "0")} {comp.displayName}
                        {comp.stub ? (
                          <span className="catalog-badge">stub</span>
                        ) : null}
                      </span>
                      <span className="catalog-meta">{comp.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </section>
      ))}

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
