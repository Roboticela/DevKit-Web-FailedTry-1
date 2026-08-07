import { useState } from "react";

type CategoryId = "components" | "pages" | "scaffolds";

const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "components", name: "Components" },
  { id: "pages", name: "Pages" },
  { id: "scaffolds", name: "Scaffolds" },
];

export function App() {
  const [category, setCategory] = useState<CategoryId>("components");
  const active = CATEGORIES.find((c) => c.id === category)!;

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">DevKit</h1>
        <nav className="nav" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === category ? "nav-item is-active" : "nav-item"}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">
        <h2 className="title">{active.name}</h2>
        <p className="empty">Nothing here yet.</p>
      </main>
    </div>
  );
}
