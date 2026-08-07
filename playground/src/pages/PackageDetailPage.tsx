import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Caption,
  Heading,
  Paragraph,
  Spinner,
  Tabs,
  useToast,
} from "../ui/registry";
import { getPackage, type CategoryId } from "../lib/registry-catalog";
import { getPreview, PreviewFallback } from "../previews";
import { getPackageDocs, getPackageSource } from "../lib/package-files";

export function PackageDetailPage() {
  const { kind = "components", name = "" } = useParams<{
    kind: CategoryId;
    name: string;
  }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("preview");

  const pkg = useMemo(() => getPackage(kind as CategoryId, name), [kind, name]);
  const preview = pkg ? getPreview(pkg.name) : undefined;
  const docs = pkg ? getPackageDocs(pkg.category, pkg.name) : null;
  const source = pkg ? getPackageSource(pkg.category, pkg.name) : null;

  if (!pkg) {
    return (
      <div className="pg-detail">
        <Paragraph>Package not found.</Paragraph>
        <Button type="button" variant="secondary" onClick={() => navigate("/")}>
          Back to catalog
        </Button>
      </div>
    );
  }

  const Preview = preview?.Preview;
  const Variants = preview?.Variants;
  const Playground = preview?.Playground;

  const copyCode = async () => {
    if (!source) {
      toast.publish({ message: "No source available", variant: "warning" });
      return;
    }
    try {
      await navigator.clipboard.writeText(source);
      toast.publish({ message: "Code copied", variant: "success" });
    } catch {
      toast.publish({ message: "Copy failed", variant: "error" });
    }
  };

  return (
    <div className="pg-detail">
      <div className="pg-detail__nav">
        <Button type="button" variant="quiet" size="sm" onClick={() => navigate("/")}>
          ← Catalog
        </Button>
      </div>

      <header className="pg-detail__header">
        <Heading level={2} size="title">
          {pkg.displayName}
        </Heading>
        <Paragraph variant="secondary">{pkg.description}</Paragraph>
        <Caption>
          {pkg.kind} · v{pkg.latestVersion}
          {pkg.subgroupName ? ` · ${pkg.subgroupName}` : ""}
        </Caption>
      </header>

      <Tabs
        label={`${pkg.displayName} sections`}
        value={tab}
        onValueChange={setTab}
        indicator="underline"
        items={[
          {
            id: "preview",
            label: "Preview",
            panel: (
              <div className="pg-detail__panel">
                <div className="pg-preview-frame">
                  {Preview ? <Preview /> : <PreviewFallback />}
                </div>
              </div>
            ),
          },
          {
            id: "docs",
            label: "Docs",
            panel: (
              <div className="pg-detail__panel pg-docs">
                {docs ? (
                  <ReactMarkdown>{docs}</ReactMarkdown>
                ) : (
                  <Paragraph variant="secondary">No documentation file found.</Paragraph>
                )}
              </div>
            ),
          },
          {
            id: "variants",
            label: "Variants",
            panel: (
              <div className="pg-detail__panel">
                {Variants ? (
                  <Variants />
                ) : (
                  <Paragraph variant="secondary">
                    {pkg.hasVariants
                      ? "Variant gallery not wired for this package yet."
                      : "This package does not declare visual variants."}
                  </Paragraph>
                )}
              </div>
            ),
          },
          {
            id: "playground",
            label: "Playground",
            panel: (
              <div className="pg-detail__panel">
                {Playground ? (
                  <Playground />
                ) : (
                  <div className="pg-preview-frame">
                    {Preview ? <Preview /> : <PreviewFallback />}
                    <Caption>Interactive controls coming for this package.</Caption>
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "code",
            label: "Code",
            panel: (
              <div className="pg-detail__panel">
                <div className="pg-code-toolbar">
                  <Button type="button" size="sm" onClick={copyCode}>
                    Copy code
                  </Button>
                  <Caption>{pkg.name}</Caption>
                </div>
                {source ? (
                  <pre className="pg-code">
                    <code>{source}</code>
                  </pre>
                ) : (
                  <div className="pg-empty">
                    <Spinner label="Source unavailable" labelMode="visible" />
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
