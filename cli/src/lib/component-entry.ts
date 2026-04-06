export interface ComponentEntry {
  name: string;
  displayName: string;
  description: string;
  category: string;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: { id: string; label: string; description: string }[];
  latestVersion: string;
  tags: string[];
}
