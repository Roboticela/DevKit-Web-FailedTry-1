/**
 * Generate Semantic Color System (semantic-colors) for both templates + registry.
 * Run: node registry/scripts/generate-semantic-colors.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "semantic-colors";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

/** @typedef {{
 *  strong: string, hover: string, pressed: string,
 *  fg: string, icon: string, on: string,
 *  bg: string, surface: string, subtle: string, border: string,
 *  selected: string, disabled: string
 * }} SemPalette */

/** @type {Record<string, { label: string, light: SemPalette, dark: SemPalette, hc: SemPalette, hcd: SemPalette }>} */
const DOMAINS = {
  primary: {
    label: "Primary",
    light: {
      strong: "#0071e3",
      hover: "#0077ed",
      pressed: "#006edb",
      fg: "#0058b0",
      icon: "#0071e3",
      on: "#ffffff",
      bg: "rgba(0, 113, 227, 0.06)",
      surface: "rgba(0, 113, 227, 0.1)",
      subtle: "rgba(0, 113, 227, 0.12)",
      border: "rgba(0, 113, 227, 0.4)",
      selected: "rgba(0, 113, 227, 0.18)",
      disabled: "rgba(0, 113, 227, 0.28)",
    },
    dark: {
      strong: "#0a84ff",
      hover: "#409cff",
      pressed: "#0077ed",
      fg: "#64b5ff",
      icon: "#0a84ff",
      on: "#ffffff",
      bg: "rgba(10, 132, 255, 0.1)",
      surface: "rgba(10, 132, 255, 0.16)",
      subtle: "rgba(10, 132, 255, 0.18)",
      border: "rgba(10, 132, 255, 0.45)",
      selected: "rgba(10, 132, 255, 0.28)",
      disabled: "rgba(10, 132, 255, 0.28)",
    },
    hc: {
      strong: "#0000cc",
      hover: "#0000aa",
      pressed: "#000088",
      fg: "#0000cc",
      icon: "#0000cc",
      on: "#ffffff",
      bg: "#d6d6ff",
      surface: "#c0c0ff",
      subtle: "#d6d6ff",
      border: "#000000",
      selected: "#b0b0ff",
      disabled: "#999999",
    },
    hcd: {
      strong: "#66b3ff",
      hover: "#99ccff",
      pressed: "#4d99e6",
      fg: "#66b3ff",
      icon: "#66b3ff",
      on: "#000000",
      bg: "#001a33",
      surface: "#003366",
      subtle: "#003366",
      border: "#ffffff",
      selected: "#004080",
      disabled: "#999999",
    },
  },
  secondary: {
    label: "Secondary",
    light: {
      strong: "#e8e8ed",
      hover: "#dedee3",
      pressed: "#d4d4db",
      fg: "#1d1d1f",
      icon: "#6e6e73",
      on: "#1d1d1f",
      bg: "rgba(60, 60, 67, 0.04)",
      surface: "rgba(60, 60, 67, 0.06)",
      subtle: "rgba(60, 60, 67, 0.08)",
      border: "#d2d2d7",
      selected: "rgba(60, 60, 67, 0.12)",
      disabled: "rgba(60, 60, 67, 0.2)",
    },
    dark: {
      strong: "#2c2c2e",
      hover: "#3a3a3c",
      pressed: "#48484a",
      fg: "#f5f5f7",
      icon: "#a1a1a6",
      on: "#f5f5f7",
      bg: "rgba(235, 235, 245, 0.06)",
      surface: "rgba(235, 235, 245, 0.1)",
      subtle: "rgba(235, 235, 245, 0.12)",
      border: "#3a3a3c",
      selected: "rgba(235, 235, 245, 0.16)",
      disabled: "rgba(235, 235, 245, 0.2)",
    },
    hc: {
      strong: "#ffffff",
      hover: "#f0f0f0",
      pressed: "#e0e0e0",
      fg: "#000000",
      icon: "#000000",
      on: "#000000",
      bg: "#f0f0f0",
      surface: "#e8e8e8",
      subtle: "#f0f0f0",
      border: "#000000",
      selected: "#d0d0d0",
      disabled: "#666666",
    },
    hcd: {
      strong: "#000000",
      hover: "#1a1a1a",
      pressed: "#262626",
      fg: "#ffffff",
      icon: "#ffffff",
      on: "#ffffff",
      bg: "#0d0d0d",
      surface: "#1a1a1a",
      subtle: "#1a1a1a",
      border: "#ffffff",
      selected: "#262626",
      disabled: "#999999",
    },
  },
  success: {
    label: "Success",
    light: {
      strong: "#248a3d",
      hover: "#1f7a36",
      pressed: "#1a6b2f",
      fg: "#1b6b30",
      icon: "#248a3d",
      on: "#ffffff",
      bg: "rgba(36, 138, 61, 0.06)",
      surface: "rgba(36, 138, 61, 0.1)",
      subtle: "rgba(36, 138, 61, 0.12)",
      border: "rgba(36, 138, 61, 0.35)",
      selected: "rgba(36, 138, 61, 0.18)",
      disabled: "rgba(36, 138, 61, 0.28)",
    },
    dark: {
      strong: "#30d158",
      hover: "#32e05c",
      pressed: "#28c04e",
      fg: "#30d158",
      icon: "#30d158",
      on: "#003d14",
      bg: "rgba(48, 209, 88, 0.1)",
      surface: "rgba(48, 209, 88, 0.16)",
      subtle: "rgba(48, 209, 88, 0.18)",
      border: "rgba(48, 209, 88, 0.4)",
      selected: "rgba(48, 209, 88, 0.28)",
      disabled: "rgba(48, 209, 88, 0.28)",
    },
    hc: {
      strong: "#006600",
      hover: "#004d00",
      pressed: "#003300",
      fg: "#006600",
      icon: "#006600",
      on: "#ffffff",
      bg: "#d6f5d6",
      surface: "#c0f0c0",
      subtle: "#d6f5d6",
      border: "#000000",
      selected: "#a8e6a8",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66ff66",
      hover: "#88ff88",
      pressed: "#44ee44",
      fg: "#66ff66",
      icon: "#66ff66",
      on: "#000000",
      bg: "#003300",
      surface: "#004d00",
      subtle: "#003300",
      border: "#ffffff",
      selected: "#006600",
      disabled: "#999999",
    },
  },
  warning: {
    label: "Warning",
    light: {
      strong: "#c93400",
      hover: "#b42e00",
      pressed: "#9f2900",
      fg: "#a02a00",
      icon: "#c93400",
      on: "#ffffff",
      bg: "rgba(201, 52, 0, 0.06)",
      surface: "rgba(201, 52, 0, 0.1)",
      subtle: "rgba(201, 52, 0, 0.12)",
      border: "rgba(201, 52, 0, 0.35)",
      selected: "rgba(201, 52, 0, 0.18)",
      disabled: "rgba(201, 52, 0, 0.28)",
    },
    dark: {
      strong: "#ff9f0a",
      hover: "#ffb340",
      pressed: "#f08c00",
      fg: "#ffb340",
      icon: "#ff9f0a",
      on: "#1d1d1f",
      bg: "rgba(255, 159, 10, 0.1)",
      surface: "rgba(255, 159, 10, 0.16)",
      subtle: "rgba(255, 159, 10, 0.18)",
      border: "rgba(255, 159, 10, 0.4)",
      selected: "rgba(255, 159, 10, 0.28)",
      disabled: "rgba(255, 159, 10, 0.28)",
    },
    hc: {
      strong: "#8a5a00",
      hover: "#704800",
      pressed: "#563600",
      fg: "#8a5a00",
      icon: "#8a5a00",
      on: "#ffffff",
      bg: "#ffe8b3",
      surface: "#ffdd99",
      subtle: "#ffe8b3",
      border: "#000000",
      selected: "#ffd080",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ffcc66",
      hover: "#ffdd88",
      pressed: "#ffbb44",
      fg: "#ffcc66",
      icon: "#ffcc66",
      on: "#000000",
      bg: "#332200",
      surface: "#4d3300",
      subtle: "#332200",
      border: "#ffffff",
      selected: "#664400",
      disabled: "#999999",
    },
  },
  error: {
    label: "Error",
    light: {
      strong: "#d70015",
      hover: "#c40013",
      pressed: "#b00011",
      fg: "#b00012",
      icon: "#d70015",
      on: "#ffffff",
      bg: "rgba(215, 0, 21, 0.06)",
      surface: "rgba(215, 0, 21, 0.1)",
      subtle: "rgba(215, 0, 21, 0.12)",
      border: "rgba(215, 0, 21, 0.35)",
      selected: "rgba(215, 0, 21, 0.18)",
      disabled: "rgba(215, 0, 21, 0.28)",
    },
    dark: {
      strong: "#ff453a",
      hover: "#ff6961",
      pressed: "#e63c32",
      fg: "#ff6961",
      icon: "#ff453a",
      on: "#ffffff",
      bg: "rgba(255, 69, 58, 0.1)",
      surface: "rgba(255, 69, 58, 0.16)",
      subtle: "rgba(255, 69, 58, 0.18)",
      border: "rgba(255, 69, 58, 0.4)",
      selected: "rgba(255, 69, 58, 0.28)",
      disabled: "rgba(255, 69, 58, 0.28)",
    },
    hc: {
      strong: "#b00000",
      hover: "#900000",
      pressed: "#700000",
      fg: "#b00000",
      icon: "#b00000",
      on: "#ffffff",
      bg: "#ffd0d0",
      surface: "#ffb8b8",
      subtle: "#ffd0d0",
      border: "#000000",
      selected: "#ffa0a0",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ff6666",
      hover: "#ff8888",
      pressed: "#ff4444",
      fg: "#ff6666",
      icon: "#ff6666",
      on: "#000000",
      bg: "#330000",
      surface: "#4d0000",
      subtle: "#330000",
      border: "#ffffff",
      selected: "#660000",
      disabled: "#999999",
    },
  },
  information: {
    label: "Information",
    light: {
      strong: "#0071e3",
      hover: "#0077ed",
      pressed: "#006edb",
      fg: "#0058b0",
      icon: "#0071e3",
      on: "#ffffff",
      bg: "rgba(0, 113, 227, 0.06)",
      surface: "rgba(0, 113, 227, 0.1)",
      subtle: "rgba(0, 113, 227, 0.12)",
      border: "rgba(0, 113, 227, 0.35)",
      selected: "rgba(0, 113, 227, 0.18)",
      disabled: "rgba(0, 113, 227, 0.28)",
    },
    dark: {
      strong: "#64d2ff",
      hover: "#70d7ff",
      pressed: "#5ac8f5",
      fg: "#64d2ff",
      icon: "#64d2ff",
      on: "#00344d",
      bg: "rgba(100, 210, 255, 0.1)",
      surface: "rgba(100, 210, 255, 0.16)",
      subtle: "rgba(100, 210, 255, 0.18)",
      border: "rgba(100, 210, 255, 0.4)",
      selected: "rgba(100, 210, 255, 0.28)",
      disabled: "rgba(100, 210, 255, 0.28)",
    },
    hc: {
      strong: "#0000cc",
      hover: "#0000aa",
      pressed: "#000088",
      fg: "#0000cc",
      icon: "#0000cc",
      on: "#ffffff",
      bg: "#d6d6ff",
      surface: "#c0c0ff",
      subtle: "#d6d6ff",
      border: "#000000",
      selected: "#b0b0ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66b3ff",
      hover: "#99ccff",
      pressed: "#4d99e6",
      fg: "#66b3ff",
      icon: "#66b3ff",
      on: "#000000",
      bg: "#001a33",
      surface: "#003366",
      subtle: "#003366",
      border: "#ffffff",
      selected: "#004080",
      disabled: "#999999",
    },
  },
  neutral: {
    label: "Neutral",
    light: {
      strong: "#6e6e73",
      hover: "#5c5c61",
      pressed: "#4a4a4f",
      fg: "#6e6e73",
      icon: "#6e6e73",
      on: "#ffffff",
      bg: "rgba(60, 60, 67, 0.05)",
      surface: "rgba(60, 60, 67, 0.08)",
      subtle: "rgba(60, 60, 67, 0.1)",
      border: "rgba(60, 60, 67, 0.28)",
      selected: "rgba(60, 60, 67, 0.14)",
      disabled: "rgba(60, 60, 67, 0.22)",
    },
    dark: {
      strong: "#8e8e93",
      hover: "#a1a1a6",
      pressed: "#7a7a80",
      fg: "#a1a1a6",
      icon: "#8e8e93",
      on: "#1d1d1f",
      bg: "rgba(235, 235, 245, 0.06)",
      surface: "rgba(235, 235, 245, 0.1)",
      subtle: "rgba(235, 235, 245, 0.12)",
      border: "rgba(235, 235, 245, 0.28)",
      selected: "rgba(235, 235, 245, 0.16)",
      disabled: "rgba(235, 235, 245, 0.2)",
    },
    hc: {
      strong: "#333333",
      hover: "#1a1a1a",
      pressed: "#000000",
      fg: "#000000",
      icon: "#000000",
      on: "#ffffff",
      bg: "#f0f0f0",
      surface: "#e0e0e0",
      subtle: "#f0f0f0",
      border: "#000000",
      selected: "#d0d0d0",
      disabled: "#666666",
    },
    hcd: {
      strong: "#cccccc",
      hover: "#eeeeee",
      pressed: "#aaaaaa",
      fg: "#ffffff",
      icon: "#ffffff",
      on: "#000000",
      bg: "#1a1a1a",
      surface: "#262626",
      subtle: "#1a1a1a",
      border: "#ffffff",
      selected: "#333333",
      disabled: "#999999",
    },
  },
  ai: {
    label: "AI",
    light: {
      strong: "#8944ab",
      hover: "#7a3c99",
      pressed: "#6b3487",
      fg: "#6f3690",
      icon: "#8944ab",
      on: "#ffffff",
      bg: "rgba(137, 68, 171, 0.06)",
      surface: "rgba(137, 68, 171, 0.1)",
      subtle: "rgba(137, 68, 171, 0.12)",
      border: "rgba(137, 68, 171, 0.35)",
      selected: "rgba(137, 68, 171, 0.18)",
      disabled: "rgba(137, 68, 171, 0.28)",
    },
    dark: {
      strong: "#bf5af2",
      hover: "#cc78f5",
      pressed: "#b04ae0",
      fg: "#cc78f5",
      icon: "#bf5af2",
      on: "#ffffff",
      bg: "rgba(191, 90, 242, 0.1)",
      surface: "rgba(191, 90, 242, 0.16)",
      subtle: "rgba(191, 90, 242, 0.18)",
      border: "rgba(191, 90, 242, 0.4)",
      selected: "rgba(191, 90, 242, 0.28)",
      disabled: "rgba(191, 90, 242, 0.28)",
    },
    hc: {
      strong: "#5c008f",
      hover: "#4a0073",
      pressed: "#380057",
      fg: "#5c008f",
      icon: "#5c008f",
      on: "#ffffff",
      bg: "#f0d6ff",
      surface: "#e6c2ff",
      subtle: "#f0d6ff",
      border: "#000000",
      selected: "#d9a3ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#d9a3ff",
      hover: "#e6c2ff",
      pressed: "#cc88ff",
      fg: "#d9a3ff",
      icon: "#d9a3ff",
      on: "#000000",
      bg: "#1a0026",
      surface: "#2a003d",
      subtle: "#1a0026",
      border: "#ffffff",
      selected: "#3d0059",
      disabled: "#999999",
    },
  },
  automation: {
    label: "Automation",
    light: {
      strong: "#0d7a5f",
      hover: "#0b6b53",
      pressed: "#095c47",
      fg: "#0a634d",
      icon: "#0d7a5f",
      on: "#ffffff",
      bg: "rgba(13, 122, 95, 0.06)",
      surface: "rgba(13, 122, 95, 0.1)",
      subtle: "rgba(13, 122, 95, 0.12)",
      border: "rgba(13, 122, 95, 0.35)",
      selected: "rgba(13, 122, 95, 0.18)",
      disabled: "rgba(13, 122, 95, 0.28)",
    },
    dark: {
      strong: "#30d158",
      hover: "#3dde66",
      pressed: "#28c04e",
      fg: "#63e08a",
      icon: "#30d158",
      on: "#003d14",
      bg: "rgba(48, 209, 88, 0.1)",
      surface: "rgba(48, 209, 88, 0.16)",
      subtle: "rgba(48, 209, 88, 0.18)",
      border: "rgba(48, 209, 88, 0.4)",
      selected: "rgba(48, 209, 88, 0.28)",
      disabled: "rgba(48, 209, 88, 0.28)",
    },
    hc: {
      strong: "#006644",
      hover: "#004d33",
      pressed: "#003322",
      fg: "#006644",
      icon: "#006644",
      on: "#ffffff",
      bg: "#c8f5e8",
      surface: "#a8edd9",
      subtle: "#c8f5e8",
      border: "#000000",
      selected: "#88e0c8",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66ffcc",
      hover: "#88ffd9",
      pressed: "#44eebb",
      fg: "#66ffcc",
      icon: "#66ffcc",
      on: "#000000",
      bg: "#003322",
      surface: "#004d33",
      subtle: "#003322",
      border: "#ffffff",
      selected: "#006644",
      disabled: "#999999",
    },
  },
  billing: {
    label: "Billing",
    light: {
      strong: "#b25000",
      hover: "#9e4700",
      pressed: "#8a3e00",
      fg: "#8f4000",
      icon: "#b25000",
      on: "#ffffff",
      bg: "rgba(178, 80, 0, 0.06)",
      surface: "rgba(178, 80, 0, 0.1)",
      subtle: "rgba(178, 80, 0, 0.12)",
      border: "rgba(178, 80, 0, 0.35)",
      selected: "rgba(178, 80, 0, 0.18)",
      disabled: "rgba(178, 80, 0, 0.28)",
    },
    dark: {
      strong: "#ffd60a",
      hover: "#ffe04d",
      pressed: "#e6c200",
      fg: "#ffd60a",
      icon: "#ffd60a",
      on: "#1d1d1f",
      bg: "rgba(255, 214, 10, 0.1)",
      surface: "rgba(255, 214, 10, 0.16)",
      subtle: "rgba(255, 214, 10, 0.18)",
      border: "rgba(255, 214, 10, 0.4)",
      selected: "rgba(255, 214, 10, 0.28)",
      disabled: "rgba(255, 214, 10, 0.28)",
    },
    hc: {
      strong: "#996600",
      hover: "#805500",
      pressed: "#664400",
      fg: "#996600",
      icon: "#996600",
      on: "#ffffff",
      bg: "#fff0cc",
      surface: "#ffe8b3",
      subtle: "#fff0cc",
      border: "#000000",
      selected: "#ffdd99",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ffcc66",
      hover: "#ffdd88",
      pressed: "#ffbb44",
      fg: "#ffcc66",
      icon: "#ffcc66",
      on: "#000000",
      bg: "#332200",
      surface: "#4d3300",
      subtle: "#332200",
      border: "#ffffff",
      selected: "#664400",
      disabled: "#999999",
    },
  },
  analytics: {
    label: "Analytics",
    light: {
      strong: "#5856d6",
      hover: "#4c4abf",
      pressed: "#413fa8",
      fg: "#4644b0",
      icon: "#5856d6",
      on: "#ffffff",
      bg: "rgba(88, 86, 214, 0.06)",
      surface: "rgba(88, 86, 214, 0.1)",
      subtle: "rgba(88, 86, 214, 0.12)",
      border: "rgba(88, 86, 214, 0.35)",
      selected: "rgba(88, 86, 214, 0.18)",
      disabled: "rgba(88, 86, 214, 0.28)",
    },
    dark: {
      strong: "#5e5ce6",
      hover: "#7d7aff",
      pressed: "#4f4dd0",
      fg: "#7d7aff",
      icon: "#5e5ce6",
      on: "#ffffff",
      bg: "rgba(94, 92, 230, 0.1)",
      surface: "rgba(94, 92, 230, 0.16)",
      subtle: "rgba(94, 92, 230, 0.18)",
      border: "rgba(94, 92, 230, 0.4)",
      selected: "rgba(94, 92, 230, 0.28)",
      disabled: "rgba(94, 92, 230, 0.28)",
    },
    hc: {
      strong: "#3333aa",
      hover: "#292988",
      pressed: "#1f1f66",
      fg: "#3333aa",
      icon: "#3333aa",
      on: "#ffffff",
      bg: "#d6d6ff",
      surface: "#c0c0ff",
      subtle: "#d6d6ff",
      border: "#000000",
      selected: "#b0b0ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#9999ff",
      hover: "#b3b3ff",
      pressed: "#8080ff",
      fg: "#9999ff",
      icon: "#9999ff",
      on: "#000000",
      bg: "#1a1a40",
      surface: "#262660",
      subtle: "#1a1a40",
      border: "#ffffff",
      selected: "#333380",
      disabled: "#999999",
    },
  },
  security: {
    label: "Security",
    light: {
      strong: "#d70015",
      hover: "#c40013",
      pressed: "#b00011",
      fg: "#b00012",
      icon: "#d70015",
      on: "#ffffff",
      bg: "rgba(215, 0, 21, 0.06)",
      surface: "rgba(215, 0, 21, 0.1)",
      subtle: "rgba(215, 0, 21, 0.12)",
      border: "rgba(215, 0, 21, 0.35)",
      selected: "rgba(215, 0, 21, 0.18)",
      disabled: "rgba(215, 0, 21, 0.28)",
    },
    dark: {
      strong: "#ff453a",
      hover: "#ff6961",
      pressed: "#e63c32",
      fg: "#ff6961",
      icon: "#ff453a",
      on: "#ffffff",
      bg: "rgba(255, 69, 58, 0.1)",
      surface: "rgba(255, 69, 58, 0.16)",
      subtle: "rgba(255, 69, 58, 0.18)",
      border: "rgba(255, 69, 58, 0.4)",
      selected: "rgba(255, 69, 58, 0.28)",
      disabled: "rgba(255, 69, 58, 0.28)",
    },
    hc: {
      strong: "#b00000",
      hover: "#900000",
      pressed: "#700000",
      fg: "#b00000",
      icon: "#b00000",
      on: "#ffffff",
      bg: "#ffd0d0",
      surface: "#ffb8b8",
      subtle: "#ffd0d0",
      border: "#000000",
      selected: "#ffa0a0",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ff6666",
      hover: "#ff8888",
      pressed: "#ff4444",
      fg: "#ff6666",
      icon: "#ff6666",
      on: "#000000",
      bg: "#330000",
      surface: "#4d0000",
      subtle: "#330000",
      border: "#ffffff",
      selected: "#660000",
      disabled: "#999999",
    },
  },
  notifications: {
    label: "Notifications",
    light: {
      strong: "#0071e3",
      hover: "#0077ed",
      pressed: "#006edb",
      fg: "#0058b0",
      icon: "#0071e3",
      on: "#ffffff",
      bg: "rgba(0, 113, 227, 0.06)",
      surface: "rgba(0, 113, 227, 0.1)",
      subtle: "rgba(0, 113, 227, 0.12)",
      border: "rgba(0, 113, 227, 0.35)",
      selected: "rgba(0, 113, 227, 0.18)",
      disabled: "rgba(0, 113, 227, 0.28)",
    },
    dark: {
      strong: "#0a84ff",
      hover: "#409cff",
      pressed: "#0077ed",
      fg: "#64b5ff",
      icon: "#0a84ff",
      on: "#ffffff",
      bg: "rgba(10, 132, 255, 0.1)",
      surface: "rgba(10, 132, 255, 0.16)",
      subtle: "rgba(10, 132, 255, 0.18)",
      border: "rgba(10, 132, 255, 0.4)",
      selected: "rgba(10, 132, 255, 0.28)",
      disabled: "rgba(10, 132, 255, 0.28)",
    },
    hc: {
      strong: "#0000cc",
      hover: "#0000aa",
      pressed: "#000088",
      fg: "#0000cc",
      icon: "#0000cc",
      on: "#ffffff",
      bg: "#d6d6ff",
      surface: "#c0c0ff",
      subtle: "#d6d6ff",
      border: "#000000",
      selected: "#b0b0ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66b3ff",
      hover: "#99ccff",
      pressed: "#4d99e6",
      fg: "#66b3ff",
      icon: "#66b3ff",
      on: "#000000",
      bg: "#001a33",
      surface: "#003366",
      subtle: "#003366",
      border: "#ffffff",
      selected: "#004080",
      disabled: "#999999",
    },
  },
  collaboration: {
    label: "Collaboration",
    light: {
      strong: "#c9347a",
      hover: "#b42e6c",
      pressed: "#9f285e",
      fg: "#a02862",
      icon: "#c9347a",
      on: "#ffffff",
      bg: "rgba(201, 52, 122, 0.06)",
      surface: "rgba(201, 52, 122, 0.1)",
      subtle: "rgba(201, 52, 122, 0.12)",
      border: "rgba(201, 52, 122, 0.35)",
      selected: "rgba(201, 52, 122, 0.18)",
      disabled: "rgba(201, 52, 122, 0.28)",
    },
    dark: {
      strong: "#ff375f",
      hover: "#ff6482",
      pressed: "#e63055",
      fg: "#ff6482",
      icon: "#ff375f",
      on: "#ffffff",
      bg: "rgba(255, 55, 95, 0.1)",
      surface: "rgba(255, 55, 95, 0.16)",
      subtle: "rgba(255, 55, 95, 0.18)",
      border: "rgba(255, 55, 95, 0.4)",
      selected: "rgba(255, 55, 95, 0.28)",
      disabled: "rgba(255, 55, 95, 0.28)",
    },
    hc: {
      strong: "#990066",
      hover: "#770050",
      pressed: "#55003a",
      fg: "#990066",
      icon: "#990066",
      on: "#ffffff",
      bg: "#ffd6ee",
      surface: "#ffc0e4",
      subtle: "#ffd6ee",
      border: "#000000",
      selected: "#ffa8d6",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ff99cc",
      hover: "#ffb3d9",
      pressed: "#ff80bf",
      fg: "#ff99cc",
      icon: "#ff99cc",
      on: "#000000",
      bg: "#330022",
      surface: "#4d0033",
      subtle: "#330022",
      border: "#ffffff",
      selected: "#660044",
      disabled: "#999999",
    },
  },
  files: {
    label: "Files",
    light: {
      strong: "#5a6a7a",
      hover: "#4d5b69",
      pressed: "#404c58",
      fg: "#4a5968",
      icon: "#5a6a7a",
      on: "#ffffff",
      bg: "rgba(90, 106, 122, 0.06)",
      surface: "rgba(90, 106, 122, 0.1)",
      subtle: "rgba(90, 106, 122, 0.12)",
      border: "rgba(90, 106, 122, 0.35)",
      selected: "rgba(90, 106, 122, 0.18)",
      disabled: "rgba(90, 106, 122, 0.28)",
    },
    dark: {
      strong: "#8e9aab",
      hover: "#a4afbd",
      pressed: "#7a8799",
      fg: "#a4afbd",
      icon: "#8e9aab",
      on: "#1d1d1f",
      bg: "rgba(142, 154, 171, 0.1)",
      surface: "rgba(142, 154, 171, 0.16)",
      subtle: "rgba(142, 154, 171, 0.18)",
      border: "rgba(142, 154, 171, 0.4)",
      selected: "rgba(142, 154, 171, 0.28)",
      disabled: "rgba(142, 154, 171, 0.28)",
    },
    hc: {
      strong: "#334455",
      hover: "#223344",
      pressed: "#112233",
      fg: "#334455",
      icon: "#334455",
      on: "#ffffff",
      bg: "#e0e6ec",
      surface: "#d0d8e0",
      subtle: "#e0e6ec",
      border: "#000000",
      selected: "#c0ccd8",
      disabled: "#666666",
    },
    hcd: {
      strong: "#aabbcc",
      hover: "#ccd5e0",
      pressed: "#99aacc",
      fg: "#aabbcc",
      icon: "#aabbcc",
      on: "#000000",
      bg: "#1a222b",
      surface: "#2a3540",
      subtle: "#1a222b",
      border: "#ffffff",
      selected: "#3a4855",
      disabled: "#999999",
    },
  },
  crm: {
    label: "CRM",
    light: {
      strong: "#0088a3",
      hover: "#007790",
      pressed: "#00667c",
      fg: "#006f85",
      icon: "#0088a3",
      on: "#ffffff",
      bg: "rgba(0, 136, 163, 0.06)",
      surface: "rgba(0, 136, 163, 0.1)",
      subtle: "rgba(0, 136, 163, 0.12)",
      border: "rgba(0, 136, 163, 0.35)",
      selected: "rgba(0, 136, 163, 0.18)",
      disabled: "rgba(0, 136, 163, 0.28)",
    },
    dark: {
      strong: "#64d2ff",
      hover: "#7adaff",
      pressed: "#4fc4f5",
      fg: "#64d2ff",
      icon: "#64d2ff",
      on: "#00344d",
      bg: "rgba(100, 210, 255, 0.1)",
      surface: "rgba(100, 210, 255, 0.16)",
      subtle: "rgba(100, 210, 255, 0.18)",
      border: "rgba(100, 210, 255, 0.4)",
      selected: "rgba(100, 210, 255, 0.28)",
      disabled: "rgba(100, 210, 255, 0.28)",
    },
    hc: {
      strong: "#006666",
      hover: "#004d4d",
      pressed: "#003333",
      fg: "#006666",
      icon: "#006666",
      on: "#ffffff",
      bg: "#ccf0f0",
      surface: "#b3e8e8",
      subtle: "#ccf0f0",
      border: "#000000",
      selected: "#99e0e0",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66ffff",
      hover: "#88ffff",
      pressed: "#44eeee",
      fg: "#66ffff",
      icon: "#66ffff",
      on: "#000000",
      bg: "#003333",
      surface: "#004d4d",
      subtle: "#003333",
      border: "#ffffff",
      selected: "#006666",
      disabled: "#999999",
    },
  },
  calendar: {
    label: "Calendar",
    light: {
      strong: "#e05a3c",
      hover: "#c95035",
      pressed: "#b2462e",
      fg: "#c24c33",
      icon: "#e05a3c",
      on: "#ffffff",
      bg: "rgba(224, 90, 60, 0.06)",
      surface: "rgba(224, 90, 60, 0.1)",
      subtle: "rgba(224, 90, 60, 0.12)",
      border: "rgba(224, 90, 60, 0.35)",
      selected: "rgba(224, 90, 60, 0.18)",
      disabled: "rgba(224, 90, 60, 0.28)",
    },
    dark: {
      strong: "#ff6961",
      hover: "#ff857e",
      pressed: "#e65e57",
      fg: "#ff857e",
      icon: "#ff6961",
      on: "#1d1d1f",
      bg: "rgba(255, 105, 97, 0.1)",
      surface: "rgba(255, 105, 97, 0.16)",
      subtle: "rgba(255, 105, 97, 0.18)",
      border: "rgba(255, 105, 97, 0.4)",
      selected: "rgba(255, 105, 97, 0.28)",
      disabled: "rgba(255, 105, 97, 0.28)",
    },
    hc: {
      strong: "#cc3300",
      hover: "#aa2a00",
      pressed: "#882200",
      fg: "#cc3300",
      icon: "#cc3300",
      on: "#ffffff",
      bg: "#ffe0d6",
      surface: "#ffd0c0",
      subtle: "#ffe0d6",
      border: "#000000",
      selected: "#ffc0a8",
      disabled: "#666666",
    },
    hcd: {
      strong: "#ff9966",
      hover: "#ffb388",
      pressed: "#ff8044",
      fg: "#ff9966",
      icon: "#ff9966",
      on: "#000000",
      bg: "#331a00",
      surface: "#4d2800",
      subtle: "#331a00",
      border: "#ffffff",
      selected: "#663300",
      disabled: "#999999",
    },
  },
  forms: {
    label: "Forms",
    light: {
      strong: "#4a5fc1",
      hover: "#4154ad",
      pressed: "#384999",
      fg: "#3d4fa8",
      icon: "#4a5fc1",
      on: "#ffffff",
      bg: "rgba(74, 95, 193, 0.06)",
      surface: "rgba(74, 95, 193, 0.1)",
      subtle: "rgba(74, 95, 193, 0.12)",
      border: "rgba(74, 95, 193, 0.35)",
      selected: "rgba(74, 95, 193, 0.18)",
      disabled: "rgba(74, 95, 193, 0.28)",
    },
    dark: {
      strong: "#6c8cff",
      hover: "#8aa3ff",
      pressed: "#5a7aef",
      fg: "#8aa3ff",
      icon: "#6c8cff",
      on: "#ffffff",
      bg: "rgba(108, 140, 255, 0.1)",
      surface: "rgba(108, 140, 255, 0.16)",
      subtle: "rgba(108, 140, 255, 0.18)",
      border: "rgba(108, 140, 255, 0.4)",
      selected: "rgba(108, 140, 255, 0.28)",
      disabled: "rgba(108, 140, 255, 0.28)",
    },
    hc: {
      strong: "#2233aa",
      hover: "#1a2888",
      pressed: "#121e66",
      fg: "#2233aa",
      icon: "#2233aa",
      on: "#ffffff",
      bg: "#d6dcff",
      surface: "#c0c8ff",
      subtle: "#d6dcff",
      border: "#000000",
      selected: "#a8b4ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#99aaff",
      hover: "#b3c0ff",
      pressed: "#8090ff",
      fg: "#99aaff",
      icon: "#99aaff",
      on: "#000000",
      bg: "#0d1533",
      surface: "#1a2660",
      subtle: "#0d1533",
      border: "#ffffff",
      selected: "#263380",
      disabled: "#999999",
    },
  },
  reports: {
    label: "Reports",
    light: {
      strong: "#1d4f91",
      hover: "#194580",
      pressed: "#153b6f",
      fg: "#174280",
      icon: "#1d4f91",
      on: "#ffffff",
      bg: "rgba(29, 79, 145, 0.06)",
      surface: "rgba(29, 79, 145, 0.1)",
      subtle: "rgba(29, 79, 145, 0.12)",
      border: "rgba(29, 79, 145, 0.35)",
      selected: "rgba(29, 79, 145, 0.18)",
      disabled: "rgba(29, 79, 145, 0.28)",
    },
    dark: {
      strong: "#409cff",
      hover: "#64b5ff",
      pressed: "#2e8cf0",
      fg: "#64b5ff",
      icon: "#409cff",
      on: "#003066",
      bg: "rgba(64, 156, 255, 0.1)",
      surface: "rgba(64, 156, 255, 0.16)",
      subtle: "rgba(64, 156, 255, 0.18)",
      border: "rgba(64, 156, 255, 0.4)",
      selected: "rgba(64, 156, 255, 0.28)",
      disabled: "rgba(64, 156, 255, 0.28)",
    },
    hc: {
      strong: "#003399",
      hover: "#002880",
      pressed: "#001e66",
      fg: "#003399",
      icon: "#003399",
      on: "#ffffff",
      bg: "#d6e0ff",
      surface: "#c0d0ff",
      subtle: "#d6e0ff",
      border: "#000000",
      selected: "#a8c0ff",
      disabled: "#666666",
    },
    hcd: {
      strong: "#6699ff",
      hover: "#88b0ff",
      pressed: "#4480ff",
      fg: "#6699ff",
      icon: "#6699ff",
      on: "#000000",
      bg: "#001133",
      surface: "#001a4d",
      subtle: "#001133",
      border: "#ffffff",
      selected: "#002266",
      disabled: "#999999",
    },
  },
  integrations: {
    label: "Integrations",
    light: {
      strong: "#0088a3",
      hover: "#007790",
      pressed: "#00667c",
      fg: "#006f85",
      icon: "#0088a3",
      on: "#ffffff",
      bg: "rgba(0, 136, 163, 0.06)",
      surface: "rgba(0, 136, 163, 0.1)",
      subtle: "rgba(0, 136, 163, 0.12)",
      border: "rgba(0, 136, 163, 0.35)",
      selected: "rgba(0, 136, 163, 0.18)",
      disabled: "rgba(0, 136, 163, 0.28)",
    },
    dark: {
      strong: "#5ac8f5",
      hover: "#70d7ff",
      pressed: "#4ab8e6",
      fg: "#70d7ff",
      icon: "#5ac8f5",
      on: "#00344d",
      bg: "rgba(90, 200, 245, 0.1)",
      surface: "rgba(90, 200, 245, 0.16)",
      subtle: "rgba(90, 200, 245, 0.18)",
      border: "rgba(90, 200, 245, 0.4)",
      selected: "rgba(90, 200, 245, 0.28)",
      disabled: "rgba(90, 200, 245, 0.28)",
    },
    hc: {
      strong: "#006680",
      hover: "#004d60",
      pressed: "#003340",
      fg: "#006680",
      icon: "#006680",
      on: "#ffffff",
      bg: "#ccf0f8",
      surface: "#b3e8f2",
      subtle: "#ccf0f8",
      border: "#000000",
      selected: "#99e0ec",
      disabled: "#666666",
    },
    hcd: {
      strong: "#66d9ef",
      hover: "#88e3f3",
      pressed: "#44cce8",
      fg: "#66d9ef",
      icon: "#66d9ef",
      on: "#000000",
      bg: "#002833",
      surface: "#003d4d",
      subtle: "#002833",
      border: "#ffffff",
      selected: "#005266",
      disabled: "#999999",
    },
  },
};

const VARIANTS = [
  "bg",
  "surface",
  "border",
  "text",
  "icon",
  "hover",
  "pressed",
  "selected",
  "disabled",
  "subtle",
  "strong",
  "on",
];

/** Map palette keys → CSS token suffix (text uses fg) */
const VARIANT_KEY = {
  bg: "bg",
  surface: "surface",
  border: "border",
  text: "fg",
  icon: "icon",
  hover: "hover",
  pressed: "pressed",
  selected: "selected",
  disabled: "disabled",
  subtle: "subtle",
  strong: "strong",
  on: "on",
};

function emitDomainBlock(domain, palette, indent = "  ") {
  const lines = [];
  for (const v of VARIANTS) {
    const key = VARIANT_KEY[v];
    lines.push(`${indent}--color-${domain}-${v}: ${palette[key]};`);
  }
  // Solid shorthand + legacy bridges
  lines.push(`${indent}--color-${domain}: var(--color-${domain}-strong);`);
  lines.push(`${indent}--color-${domain}-muted: var(--color-${domain}-subtle);`);
  lines.push(`${indent}--color-${domain}-background: var(--color-${domain}-bg);`);
  // Legacy filled-button text often used -text as on-fill; expose -on and keep -text as accent (semantic)
  // Provide -text-on alias for migration
  lines.push(`${indent}--color-${domain}-text-on: var(--color-${domain}-on);`);
  return lines.join("\n");
}

function emitTheme(selector, themeKey) {
  const blocks = Object.keys(DOMAINS).map((d) => emitDomainBlock(d, DOMAINS[d][themeKey]));
  // Aliases: danger ↔ error, info ↔ information
  const aliases = [
    "  /* Status aliases */",
    "  --color-danger-bg: var(--color-error-bg);",
    "  --color-danger-surface: var(--color-error-surface);",
    "  --color-danger-border: var(--color-error-border);",
    "  --color-danger-text: var(--color-error-text);",
    "  --color-danger-icon: var(--color-error-icon);",
    "  --color-danger-hover: var(--color-error-hover);",
    "  --color-danger-pressed: var(--color-error-pressed);",
    "  --color-danger-selected: var(--color-error-selected);",
    "  --color-danger-disabled: var(--color-error-disabled);",
    "  --color-danger-subtle: var(--color-error-subtle);",
    "  --color-danger-strong: var(--color-error-strong);",
    "  --color-danger-on: var(--color-error-on);",
    "  --color-danger: var(--color-error-strong);",
    "  --color-danger-muted: var(--color-error-subtle);",
    "  --color-danger-text-on: var(--color-error-on);",
    "  --color-info-bg: var(--color-information-bg);",
    "  --color-info-surface: var(--color-information-surface);",
    "  --color-info-border: var(--color-information-border);",
    "  --color-info-text: var(--color-information-text);",
    "  --color-info-icon: var(--color-information-icon);",
    "  --color-info-hover: var(--color-information-hover);",
    "  --color-info-pressed: var(--color-information-pressed);",
    "  --color-info-selected: var(--color-information-selected);",
    "  --color-info-disabled: var(--color-information-disabled);",
    "  --color-info-subtle: var(--color-information-subtle);",
    "  --color-info-strong: var(--color-information-strong);",
    "  --color-info-on: var(--color-information-on);",
    "  --color-info: var(--color-information-strong);",
    "  --color-info-muted: var(--color-information-subtle);",
    "  --color-info-text-on: var(--color-information-on);",
    "  --semantic-error: var(--color-error);",
    "  --semantic-danger: var(--color-danger);",
    "  --semantic-information: var(--color-information);",
    "  --semantic-info: var(--color-info);",
  ];
  return `${selector} {\n${blocks.join("\n\n")}\n\n${aliases.join("\n")}\n}`;
}

function emitUtilities() {
  const lines = [
    "/* ═══════════════════════════════════════════════════════════════════════════",
    "   Utilities — .dk-sem-{domain}[-subtle|-strong|-outline]",
    "   ═══════════════════════════════════════════════════════════════════════════ */",
    "",
    ".dk-sem {",
    "  box-sizing: border-box;",
    "  display: inline-flex;",
    "  align-items: center;",
    "  gap: 0.375rem;",
    "  padding: 0.375rem 0.75rem;",
    "  border-radius: var(--radius-md, 0.625rem);",
    "  border: 1px solid var(--_sem-border, transparent);",
    "  background: var(--_sem-bg, transparent);",
    "  color: var(--_sem-text, inherit);",
    "  font-weight: 600;",
    "  line-height: 1.3;",
    "}",
    "",
    ".dk-sem-icon { color: var(--_sem-icon, var(--_sem-text)); }",
    "",
  ];

  for (const d of Object.keys(DOMAINS)) {
    lines.push(`.dk-sem-${d} {`);
    lines.push(`  --_sem-bg: var(--color-${d}-subtle);`);
    lines.push(`  --_sem-border: var(--color-${d}-border);`);
    lines.push(`  --_sem-text: var(--color-${d}-text);`);
    lines.push(`  --_sem-icon: var(--color-${d}-icon);`);
    lines.push(`}`);
    lines.push(`.dk-sem-${d}-subtle {`);
    lines.push(`  --_sem-bg: var(--color-${d}-bg);`);
    lines.push(`  --_sem-border: transparent;`);
    lines.push(`  --_sem-text: var(--color-${d}-text);`);
    lines.push(`  --_sem-icon: var(--color-${d}-icon);`);
    lines.push(`}`);
    lines.push(`.dk-sem-${d}-strong {`);
    lines.push(`  --_sem-bg: var(--color-${d}-strong);`);
    lines.push(`  --_sem-border: var(--color-${d}-strong);`);
    lines.push(`  --_sem-text: var(--color-${d}-on);`);
    lines.push(`  --_sem-icon: var(--color-${d}-on);`);
    lines.push(`}`);
    lines.push(`.dk-sem-${d}-outline {`);
    lines.push(`  --_sem-bg: transparent;`);
    lines.push(`  --_sem-border: var(--color-${d}-border);`);
    lines.push(`  --_sem-text: var(--color-${d}-text);`);
    lines.push(`  --_sem-icon: var(--color-${d}-icon);`);
    lines.push(`}`);
    lines.push(`.dk-sem-${d}-surface {`);
    lines.push(`  --_sem-bg: var(--color-${d}-surface);`);
    lines.push(`  --_sem-border: var(--color-${d}-border);`);
    lines.push(`  --_sem-text: var(--color-${d}-text);`);
    lines.push(`  --_sem-icon: var(--color-${d}-icon);`);
    lines.push(`}`);
    lines.push("");
  }

  // danger / info class aliases
  for (const [alias, src] of [
    ["danger", "error"],
    ["info", "information"],
  ]) {
    lines.push(`/* alias ${alias} → ${src} */`);
    lines.push(`.dk-sem-${alias} { --_sem-bg: var(--color-${src}-subtle); --_sem-border: var(--color-${src}-border); --_sem-text: var(--color-${src}-text); --_sem-icon: var(--color-${src}-icon); }`);
    lines.push(`.dk-sem-${alias}-subtle { --_sem-bg: var(--color-${src}-bg); --_sem-border: transparent; --_sem-text: var(--color-${src}-text); --_sem-icon: var(--color-${src}-icon); }`);
    lines.push(`.dk-sem-${alias}-strong { --_sem-bg: var(--color-${src}-strong); --_sem-border: var(--color-${src}-strong); --_sem-text: var(--color-${src}-on); --_sem-icon: var(--color-${src}-on); }`);
    lines.push(`.dk-sem-${alias}-outline { --_sem-bg: transparent; --_sem-border: var(--color-${src}-border); --_sem-text: var(--color-${src}-text); --_sem-icon: var(--color-${src}-icon); }`);
    lines.push(`.dk-sem-${alias}-surface { --_sem-bg: var(--color-${src}-surface); --_sem-border: var(--color-${src}-border); --_sem-text: var(--color-${src}-text); --_sem-icon: var(--color-${src}-icon); }`);
    lines.push("");
  }

  lines.push("/* Interactive states for semantic chips/buttons */");
  lines.push(".dk-sem:hover { filter: none; background: var(--_sem-bg); }");
  lines.push(".dk-sem:focus-visible { outline: 2px solid var(--color-focus-ring, currentColor); outline-offset: 2px; }");
  lines.push('.dk-sem[aria-disabled="true"], .dk-sem:disabled { opacity: 1; color: var(--color-disabled-text); border-color: var(--color-disabled-border); background: var(--color-disabled-bg); cursor: not-allowed; }');
  lines.push("");
  lines.push("/* Soft surface role helpers */");
  for (const d of Object.keys(DOMAINS)) {
    lines.push(`.dk-sem-fill-${d} { background: var(--color-${d}-bg); color: var(--color-${d}-text); border-color: var(--color-${d}-border); }`);
  }

  return lines.join("\n");
}

function buildCss() {
  const header = `/**
 * DevKit Semantic Color System — Layer 1 Foundation (id: 36 · semantic-colors)
 *
 * Defines meaning of color across the app: status + product domains.
 * Each domain exposes: bg, surface, border, text, icon, hover, pressed,
 * selected, disabled, subtle, strong, on (text/icon on strong fill).
 *
 * Themes: light · dark · high-contrast · high-contrast-dark
 * Requires: color-tokens.css (load this AFTER color-tokens + theme profiles)
 * Generated by: registry/scripts/generate-semantic-colors.mjs — do not hand-edit.
 */

`;

  const light = emitTheme(":root,\n[data-theme=\"light\"]", "light");
  const dark = emitTheme('[data-theme="dark"],\n.dark', "dark");
  const hc = emitTheme(
    '[data-theme="high-contrast"],\n[data-contrast="high"]',
    "hc"
  );
  const hcd = emitTheme('[data-theme="high-contrast-dark"]', "hcd");

  // Primary/secondary legacy bridges that themes may override
  const legacyNote = `
/* Compat: solid action tokens used by existing components */
:root,
[data-theme] {
  --color-primary-muted: var(--color-primary-subtle);
  --color-secondary-muted: var(--color-secondary-subtle);
  --color-success-muted: var(--color-success-subtle);
  --color-warning-muted: var(--color-warning-subtle);
  --color-error-muted: var(--color-error-subtle);
  --color-notifications-badge: var(--color-error-strong);
}
`;

  return [header, light, "", dark, "", hc, "", hcd, legacyNote, emitUtilities()].join(
    "\n"
  );
}

function buildDocs() {
  const domainList = Object.entries(DOMAINS)
    .map(([id, d]) => `| \`${id}\` | ${d.label} |`)
    .join("\n");

  return `# Semantic Color System

**Package:** \`semantic-colors\` · **Layer:** 1 Foundation · **ID:** 36  
**Group:** Theme Engine · **Depends on:** \`color-tokens\`

## Purpose

Defines the **meaning** of color across the product — status and enterprise domains — with a full variant set that adapts automatically across Light, Dark, and High Contrast themes.

## Install

\`\`\`bash
devkit add color-tokens semantic-colors
\`\`\`

\`\`\`ts
import "@/styles/color-tokens.css";
import "@/styles/semantic-colors.css"; // after theme profiles if used
\`\`\`

## Domains

| Token id | Meaning |
|----------|---------|
${domainList}
| \`danger\` | Alias of \`error\` |
| \`info\` | Alias of \`information\` |

## Variants (every domain)

| Variant | Token | Use |
|---------|-------|-----|
| Background | \`--color-{d}-bg\` | Soft page / section tint |
| Surface | \`--color-{d}-surface\` | Cards / wells |
| Border | \`--color-{d}-border\` | Outlines |
| Text | \`--color-{d}-text\` | Accent text on default surfaces |
| Icon | \`--color-{d}-icon\` | Glyphs |
| Hover | \`--color-{d}-hover\` | Stronger solid / control hover |
| Pressed | \`--color-{d}-pressed\` | Active press |
| Selected | \`--color-{d}-selected\` | Selection fill |
| Disabled | \`--color-{d}-disabled\` | Disabled accent |
| Subtle | \`--color-{d}-subtle\` | Soft emphasis fill |
| Strong | \`--color-{d}-strong\` | Solid emphasis (also \`--color-{d}\`) |
| On | \`--color-{d}-on\` | Text/icon **on** strong fill |

Also: \`--color-{d}-background\` → bg, \`--color-{d}-muted\` → subtle, \`--color-{d}-text-on\` → on.

## Utilities

\`\`\`html
<span class="dk-sem dk-sem-success">Saved</span>
<span class="dk-sem dk-sem-ai-strong">AI</span>
<span class="dk-sem dk-sem-billing-outline">Invoice</span>
<div class="dk-sem-fill-security">…</div>
\`\`\`

Modifiers: default (subtle+border), \`-subtle\`, \`-strong\`, \`-outline\`, \`-surface\`.

## Themes

Tokens redefine under \`data-theme="light|dark|high-contrast|high-contrast-dark"\` and \`data-contrast="high"\`. Switch themes via Theme Engine — no component changes required.

## Customization

Override any domain under a theme scope or \`ThemeScope\` vars:

\`\`\`css
[data-theme="light"] {
  --color-primary-strong: #0047ab;
  --color-primary-text: #003380;
}
\`\`\`
`;
}

function buildTs() {
  const domains = Object.keys(DOMAINS);
  return `/**
 * Semantic Color System — domain / variant registry.
 * Tokens live in semantic-colors.css (load after color-tokens).
 */
export const SEMANTIC_COLOR_DOMAINS = ${JSON.stringify(domains, null, 2)} as const;

export const SEMANTIC_COLOR_ALIASES = {
  danger: "error",
  info: "information",
} as const;

export const SEMANTIC_COLOR_VARIANTS = ${JSON.stringify(VARIANTS, null, 2)} as const;

export type SemanticColorDomain =
  | (typeof SEMANTIC_COLOR_DOMAINS)[number]
  | keyof typeof SEMANTIC_COLOR_ALIASES;

export type SemanticColorVariant = (typeof SEMANTIC_COLOR_VARIANTS)[number];

export function semanticColorToken(
  domain: SemanticColorDomain,
  variant: SemanticColorVariant = "strong"
): string {
  const resolved =
    domain in SEMANTIC_COLOR_ALIASES
      ? SEMANTIC_COLOR_ALIASES[domain as keyof typeof SEMANTIC_COLOR_ALIASES]
      : domain;
  return \`--color-\${resolved}-\${variant}\`;
}
`;
}

// ── Write artifacts ──────────────────────────────────────────────────────────

const css = buildCss();
const docs = buildDocs();
const ts = buildTs();

const nextRoot = join(COMP, NAME, "nextjs-compact/v1/files");
const viteRoot = join(COMP, NAME, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/semantic-colors.css"), css);
write(join(nextRoot, "docs/SEMANTIC_COLORS.md"), docs);
write(join(nextRoot, "components/ui/SemanticColors.ts"), ts);

copy(join(nextRoot, "styles/semantic-colors.css"), join(viteRoot, "src/styles/semantic-colors.css"));
copy(join(nextRoot, "docs/SEMANTIC_COLORS.md"), join(viteRoot, "docs/SEMANTIC_COLORS.md"));
copy(
  join(nextRoot, "components/ui/SemanticColors.ts"),
  join(viteRoot, "src/components/ui/SemanticColors.ts")
);

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        {
          source: "files/styles/semantic-colors.css",
          destination: "styles/semantic-colors.css",
        },
        {
          source: "files/components/ui/SemanticColors.ts",
          destination: "components/ui/SemanticColors.ts",
        },
        {
          source: "files/docs/SEMANTIC_COLORS.md",
          destination: "docs/devkit/SEMANTIC_COLORS.md",
        },
      ],
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, NAME, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/semantic-colors.css",
          destination: "src/styles/semantic-colors.css",
        },
        {
          source: "files/src/components/ui/SemanticColors.ts",
          destination: "src/components/ui/SemanticColors.ts",
        },
        {
          source: "files/docs/SEMANTIC_COLORS.md",
          destination: "docs/devkit/SEMANTIC_COLORS.md",
        },
      ],
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, NAME, "component.json"),
  JSON.stringify(
    {
      id: 36,
      name: "semantic-colors",
      displayName: "Semantic Color System",
      description:
        "Complete Semantic Color System — Primary/Secondary/Success/Warning/Error/Information/Neutral plus AI, Automation, Billing, Analytics, Security, Notifications, Collaboration, Files, CRM, Calendar, Forms, Reports, Integrations; each with bg/surface/border/text/icon/hover/pressed/selected/disabled/subtle/strong; adapts Light/Dark/High Contrast.",
      category: "foundation",
      group: "theme-engine",
      groupName: "Theme Engine",
      kind: "component",
      layer: 1,
      icon: "palette",
      author: "Roboticela",
      license: "MIT",
      tags: [
        "foundation",
        "theme-engine",
        "semantic-colors",
        "design-tokens",
        "a11y",
      ],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: false,
      stub: false,
      fileKind: "css",
      versions: {
        latest: "1.0.0",
        stable: "1.0.0",
        history: [{ version: "1.0.0", releaseDate: "2026-08-07", breaking: false }],
      },
      requiredConfig: [],
      optionalConfig: [],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
if (existsSync(registryPath)) {
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  for (const entry of registry.components) {
    if (entry.name !== NAME) continue;
    Object.assign(entry, {
      stub: false,
      latestVersion: "1.0.0",
      displayName: "Semantic Color System",
      description:
        "Complete Semantic Color System — status + enterprise domains with full variant sets; adapts Light/Dark/High Contrast.",
      icon: "palette",
      tags: [
        "foundation",
        "theme-engine",
        "semantic-colors",
        "design-tokens",
        "a11y",
      ],
    });
  }
  registry.updatedAt = "2026-08-07T00:00:00Z";
  write(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

console.log(
  `Semantic Color System generated (${Object.keys(DOMAINS).length} domains × ${VARIANTS.length} variants × 4 themes).`
);
