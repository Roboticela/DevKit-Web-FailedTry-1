/**
 * Icon registry — 24×24 viewBox, 1.5 stroke, round caps/joins.
 * Categories cover navigation → accessibility.
 */

export type IconCategory =
  | "navigation"
  | "actions"
  | "communication"
  | "ai"
  | "automation"
  | "files"
  | "billing"
  | "analytics"
  | "security"
  | "settings"
  | "collaboration"
  | "notifications"
  | "media"
  | "commerce"
  | "development"
  | "accessibility"
  | "status"
  | "brand";

export type IconVariant = "outlined" | "filled" | "duotone" | "status";

export interface IconDefinition {
  name: string;
  label: string;
  category: IconCategory;
  aliases: string[];
  /** Outlined path(s) — stroked */
  outlined: string;
  /** Filled path(s) — optional */
  filled?: string;
  /** Secondary fill for duotone (drawn under stroke) */
  duotone?: string;
}

/** Shared SVG attrs for outlined strokes */
export const ICON_STROKE_ATTRS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "var(--icon-stroke, 1.5)",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ICON_REGISTRY: IconDefinition[] = [
  // Navigation
  {
    name: "home",
    label: "Home",
    category: "navigation",
    aliases: ["house", "dashboard-home"],
    outlined: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
    filled: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
    duotone: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
  },
  {
    name: "menu",
    label: "Menu",
    category: "navigation",
    aliases: ["hamburger", "nav"],
    outlined: "M4 7h16M4 12h16M4 17h16",
  },
  {
    name: "chevron-right",
    label: "Chevron right",
    category: "navigation",
    aliases: ["next", "forward"],
    outlined: "m9 6 6 6-6 6",
  },
  {
    name: "chevron-left",
    label: "Chevron left",
    category: "navigation",
    aliases: ["back", "previous"],
    outlined: "m15 6-6 6 6 6",
  },
  {
    name: "search",
    label: "Search",
    category: "navigation",
    aliases: ["find", "magnify"],
    outlined: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35",
  },

  // Actions
  {
    name: "plus",
    label: "Add",
    category: "actions",
    aliases: ["add", "create", "new"],
    outlined: "M12 5v14M5 12h14",
  },
  {
    name: "trash",
    label: "Delete",
    category: "actions",
    aliases: ["delete", "remove"],
    outlined: "M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7",
    duotone: "M8 7h8v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7z",
  },
  {
    name: "edit",
    label: "Edit",
    category: "actions",
    aliases: ["pencil", "modify"],
    outlined: "M4 20h4l10.5-10.5a2.12 2.12 0 0 0-3-3L5 17v3zM13.5 6.5l3 3",
  },
  {
    name: "check",
    label: "Check",
    category: "actions",
    aliases: ["done", "confirm", "success-check"],
    outlined: "m5 12 5 5L20 7",
  },
  {
    name: "close",
    label: "Close",
    category: "actions",
    aliases: ["x", "dismiss", "cancel"],
    outlined: "M6 6l12 12M18 6 6 18",
  },
  {
    name: "more",
    label: "More",
    category: "actions",
    aliases: ["ellipsis", "options"],
    outlined: "M6 12h.01M12 12h.01M18 12h.01",
    filled: "M6 12a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 6 12zm6 0a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 12 12zm6 0a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 18 12z",
  },

  // Communication
  {
    name: "mail",
    label: "Mail",
    category: "communication",
    aliases: ["email", "envelope"],
    outlined: "M4 6h16v12H4V6zm0 0 8 7 8-7",
    duotone: "M4 6h16v12H4z",
  },
  {
    name: "message",
    label: "Message",
    category: "communication",
    aliases: ["chat", "comment"],
    outlined: "M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
    duotone: "M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  },
  {
    name: "phone",
    label: "Phone",
    category: "communication",
    aliases: ["call"],
    outlined:
      "M7 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16.5 12l4 1.5V17a2 2 0 0 1-2 2A14 14 0 0 1 5 5a2 2 0 0 1 2-2z",
  },

  // AI
  {
    name: "sparkles",
    label: "AI sparkles",
    category: "ai",
    aliases: ["ai", "magic", "assistant"],
    outlined: "M12 3v3M12 18v3M3 12h3M18 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    filled: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
  },
  {
    name: "bot",
    label: "Bot",
    category: "ai",
    aliases: ["robot", "agent"],
    outlined: "M8 9h8v7a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V9zm4-5v3M9 12h.01M15 12h.01M8 16h8",
    duotone: "M8 9h8v7a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V9z",
  },

  // Automation
  {
    name: "workflow",
    label: "Workflow",
    category: "automation",
    aliases: ["automation", "pipeline"],
    outlined: "M6 7h4v4H6V7zm8 0h4v4h-4V7zM8 11v2h8v-2M10 13v4h4v-4",
  },
  {
    name: "zap",
    label: "Automation",
    category: "automation",
    aliases: ["bolt", "trigger"],
    outlined: "M13 2 4 14h7l-1 8 10-14h-7l1-6z",
    filled: "M13 2 4 14h7l-1 8 10-14h-7l1-6z",
    duotone: "M13 2 4 14h7l-1 8 10-14h-7l1-6z",
  },

  // Files
  {
    name: "file",
    label: "File",
    category: "files",
    aliases: ["document", "doc"],
    outlined: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 0v5h5",
    duotone: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
  },
  {
    name: "folder",
    label: "Folder",
    category: "files",
    aliases: ["directory"],
    outlined: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
    filled: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
    duotone: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  },
  {
    name: "download",
    label: "Download",
    category: "files",
    aliases: ["save-as"],
    outlined: "M12 4v12m0 0 4-4m-4 4-4-4M5 20h14",
  },
  {
    name: "upload",
    label: "Upload",
    category: "files",
    aliases: ["export"],
    outlined: "M12 20V8m0 0 4 4m-4-4-4 4M5 4h14",
  },

  // Billing
  {
    name: "credit-card",
    label: "Credit card",
    category: "billing",
    aliases: ["payment", "billing", "card"],
    outlined: "M3 7h18v12H3V7zm0 3h18M7 15h4",
    duotone: "M3 7h18v12H3z",
  },
  {
    name: "receipt",
    label: "Receipt",
    category: "billing",
    aliases: ["invoice"],
    outlined: "M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3zm4 5h4M10 12h4M10 16h2",
  },

  // Analytics
  {
    name: "chart",
    label: "Chart",
    category: "analytics",
    aliases: ["analytics", "stats", "bar-chart"],
    outlined: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  },
  {
    name: "trend-up",
    label: "Trend up",
    category: "analytics",
    aliases: ["growth", "increase"],
    outlined: "M3 17 10 10l4 4 7-7M14 7h7v7",
  },

  // Security
  {
    name: "lock",
    label: "Lock",
    category: "security",
    aliases: ["secure", "security"],
    outlined: "M8 11V8a4 4 0 1 1 8 0v3M7 11h10v10H7V11z",
    duotone: "M7 11h10v10H7z",
  },
  {
    name: "shield",
    label: "Shield",
    category: "security",
    aliases: ["protect", "safety"],
    outlined: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z",
    filled: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z",
    duotone: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z",
  },
  {
    name: "eye",
    label: "Visible",
    category: "security",
    aliases: ["view", "show"],
    outlined: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },

  // Settings
  {
    name: "settings",
    label: "Settings",
    category: "settings",
    aliases: ["gear", "preferences", "cog"],
    outlined:
      "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-6v2m0 14v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M3 12h2m14 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4",
  },
  {
    name: "sliders",
    label: "Sliders",
    category: "settings",
    aliases: ["filters", "tune"],
    outlined: "M5 7h8M17 7h2M5 17h2M11 17h8M13 5v4M7 15v4",
  },

  // Collaboration
  {
    name: "users",
    label: "Users",
    category: "collaboration",
    aliases: ["team", "people", "collaborate"],
    outlined: "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm13 9v-1a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.74",
  },
  {
    name: "share",
    label: "Share",
    category: "collaboration",
    aliases: ["export-share"],
    outlined: "M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm9 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8.6 11.5l6.8-3M8.6 12.5l6.8 3",
  },

  // Notifications
  {
    name: "bell",
    label: "Notifications",
    category: "notifications",
    aliases: ["notification", "alert"],
    outlined: "M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9zm4 9a2 2 0 0 0 4 0",
    duotone: "M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z",
  },
  {
    name: "inbox",
    label: "Inbox",
    category: "notifications",
    aliases: ["mailbox"],
    outlined: "M4 6h16v12H4V6zm0 6h5l1.5 2h3L15 12h5",
  },

  // Media
  {
    name: "image",
    label: "Image",
    category: "media",
    aliases: ["photo", "picture"],
    outlined: "M4 5h16v14H4V5zm0 10 4-4 3 3 3-4 6 5M9 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    duotone: "M4 5h16v14H4z",
  },
  {
    name: "play",
    label: "Play",
    category: "media",
    aliases: ["video-play"],
    outlined: "M8 6v12l10-6L8 6z",
    filled: "M8 6v12l10-6L8 6z",
  },

  // Commerce
  {
    name: "cart",
    label: "Cart",
    category: "commerce",
    aliases: ["shopping", "bag"],
    outlined: "M3 5h2l2.5 11h11L21 8H7M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  {
    name: "tag",
    label: "Tag",
    category: "commerce",
    aliases: ["price", "label"],
    outlined: "M3 12V4h8l10 10-8 8L3 12zm5-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },

  // Development
  {
    name: "code",
    label: "Code",
    category: "development",
    aliases: ["developer", "terminal-code"],
    outlined: "m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14",
  },
  {
    name: "terminal",
    label: "Terminal",
    category: "development",
    aliases: ["console", "cli"],
    outlined: "M4 5h16v14H4V5zm3 4 3 3-3 3M12 15h5",
  },

  // Accessibility
  {
    name: "accessibility",
    label: "Accessibility",
    category: "accessibility",
    aliases: ["a11y", "universal"],
    outlined: "M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 9h10M12 9v5m-3 7 3-7 3 7",
  },
  {
    name: "contrast",
    label: "Contrast",
    category: "accessibility",
    aliases: ["theme-contrast"],
    outlined: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0v18",
    filled: "M12 3a9 9 0 0 0 0 18V3z",
  },

  // Status
  {
    name: "info",
    label: "Information",
    category: "status",
    aliases: ["information"],
    outlined: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-8v4m0-8h.01",
    filled: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  },
  {
    name: "warning",
    label: "Warning",
    category: "status",
    aliases: ["alert-triangle", "caution"],
    outlined: "M12 4 3 20h18L12 4zm0 6v4m0 3h.01",
    filled: "M12 4 3 20h18L12 4z",
    duotone: "M12 4 3 20h18L12 4z",
  },
  {
    name: "error",
    label: "Error",
    category: "status",
    aliases: ["danger", "critical"],
    outlined: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-3.5-5.5 7-7m0 7-7-7",
  },
  {
    name: "success",
    label: "Success",
    category: "status",
    aliases: ["ok", "complete"],
    outlined: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-3.5-8.5 2.5 2.5 5-5",
    filled: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  },

  // Brand / product
  {
    name: "devkit",
    label: "DevKit",
    category: "brand",
    aliases: ["logo", "brand"],
    outlined: "M7 7h10v10H7V7zm3 3h4v4h-4v-4zM4 4h2v2H4V4zm14 0h2v2h-2V4zM4 18h2v2H4v-2zm14 0h2v2h-2v-2z",
    filled: "M7 7h10v10H7z",
    duotone: "M7 7h10v10H7z",
  },
];

export type IconName = (typeof ICON_REGISTRY)[number]["name"];

const BY_NAME = new Map(ICON_REGISTRY.map((i) => [i.name, i]));
const BY_ALIAS = new Map<string, IconDefinition>();
for (const icon of ICON_REGISTRY) {
  BY_ALIAS.set(icon.name, icon);
  for (const a of icon.aliases) BY_ALIAS.set(a.toLowerCase(), icon);
}

export function getIcon(nameOrAlias: string): IconDefinition | undefined {
  return BY_ALIAS.get(nameOrAlias) ?? BY_ALIAS.get(nameOrAlias.toLowerCase()) ?? BY_NAME.get(nameOrAlias);
}

export function searchIcons(query: string): IconDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return ICON_REGISTRY;
  return ICON_REGISTRY.filter(
    (i) =>
      i.name.includes(q) ||
      i.label.toLowerCase().includes(q) ||
      i.category.includes(q) ||
      i.aliases.some((a) => a.includes(q))
  );
}

export function iconsByCategory(category: IconCategory): IconDefinition[] {
  return ICON_REGISTRY.filter((i) => i.category === category);
}

export const ICON_CATEGORIES: IconCategory[] = [
  "navigation",
  "actions",
  "communication",
  "ai",
  "automation",
  "files",
  "billing",
  "analytics",
  "security",
  "settings",
  "collaboration",
  "notifications",
  "media",
  "commerce",
  "development",
  "accessibility",
  "status",
  "brand",
];
