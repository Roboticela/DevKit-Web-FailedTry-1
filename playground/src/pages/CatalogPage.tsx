import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Caption,
  Card,
  Heading,
  Paragraph,
  Tabs,
  SearchField,
  ActionSegmentedControl,
} from "../ui/registry";
import {
  CATEGORIES,
  filterPackages,
  listAllPackages,
  packagePath,
  subgroupsFor,
  type CatalogPackage,
  type CategoryId,
} from "../lib/registry-catalog";
import { getPreview } from "../previews";

function PackageCard({ pkg }: { pkg: CatalogPackage }) {
  const navigate = useNavigate();
  const preview = getPreview(pkg.name);
  const Preview = preview?.Mini ?? preview?.Preview;

  return (
    <Card
      variant="outlined"
      interactive
      orientation="vertical"
      aria-label={pkg.displayName}
      onClick={() => navigate(packagePath(pkg))}
      className="pg-package-card"
    >
      <Card.Media className="pg-package-card__preview" fit="contain">
        {Preview ? (
          <div className="pg-preview-frame pg-preview-frame--mini" onClick={(e) => e.stopPropagation()}>
            <Preview />
          </div>
        ) : (
          <Caption size="sm">No preview</Caption>
        )}
      </Card.Media>
      <Card.Header>
        <Card.Title as="h3">{pkg.displayName}</Card.Title>
        <Card.Metadata>
          {pkg.kind} · v{pkg.latestVersion}
        </Card.Metadata>
      </Card.Header>
      <Card.Body>
        <Card.Description>{pkg.description}</Card.Description>
      </Card.Body>
    </Card>
  );
}

export function CatalogPage() {
  const all = useMemo(() => listAllPackages(), []);
  const [category, setCategory] = useState<CategoryId>("components");
  const [query, setQuery] = useState("");
  const [subgroup, setSubgroup] = useState("all");

  const inCategory = useMemo(
    () => all.filter((p) => p.category === category),
    [all, category]
  );
  const subgroups = useMemo(() => subgroupsFor(inCategory), [inCategory]);
  const filtered = useMemo(
    () =>
      filterPackages(all, {
        category,
        query,
        subgroup: category === "components" ? subgroup : "all",
      }),
    [all, category, query, subgroup]
  );

  const counts = useMemo(() => {
    const map: Record<CategoryId, number> = {
      components: 0,
      pages: 0,
      scaffolds: 0,
    };
    for (const p of all) map[p.category] += 1;
    return map;
  }, [all]);

  return (
    <div className="pg-catalog">
      <header className="pg-catalog__hero">
        <div className="pg-catalog__intro">
          <Heading level={2} size="title">
            Catalog
          </Heading>
          <Paragraph variant="secondary" className="pg-catalog__lede">
            Browse registry packages. Everything here is installed from the DevKit registry — reuse,
            do not rebuild.
          </Paragraph>
        </div>

        <div className="pg-catalog__toolbar">
          <SearchField
            label="Search packages"
            hideLabel
            appearance="toolbar"
            placeholder="Search name, description, tags…"
            value={query}
            onValueChange={setQuery}
            clearable
            fullWidth
            resultsStatus={query.trim() ? (filtered.length > 0 ? "available" : "empty") : "idle"}
            resultsStatusLabel={
              query.trim()
                ? filtered.length > 0
                  ? `${filtered.length} packages found`
                  : "No packages match your search"
                : undefined
            }
          />
        </div>
      </header>

      <Tabs
        label="Package kind"
        indicator="underline"
        value={category}
        onValueChange={(id: string) => {
          setCategory(id as CategoryId);
          setSubgroup("all");
        }}
        items={CATEGORIES.map((c) => ({
          id: c.id,
          label: `${c.name} (${counts[c.id]})`,
          panel: null,
        }))}
      />

      {category === "components" && subgroups.length > 1 ? (
        <div className="pg-catalog__subgroups">
          <ActionSegmentedControl
            label="Subgroup filter"
            size="sm"
            equalWidth={false}
            overflow="scroll"
            value={subgroup}
            onValueChange={setSubgroup}
            options={subgroups.map((s) => ({ id: s.id, label: s.label }))}
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="pg-empty">
          <Paragraph variant="secondary">
            {inCategory.length === 0
              ? `No ${category} in the registry yet.`
              : "No packages match your search."}
          </Paragraph>
        </div>
      ) : (
        <div className="pg-grid">
          {filtered.map((pkg) => (
            <PackageCard key={`${pkg.category}:${pkg.name}`} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
