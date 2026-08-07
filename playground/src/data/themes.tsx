import type { ReactNode } from "react";

export type ThemeOption = {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
};

function SystemIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="2.75"
        y="4.25"
        width="14.5"
        height="10"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 16.25h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3.25v1.5M10 15.25v1.5M3.25 10h1.5M15.25 10h1.5M5.4 5.4l1.06 1.06M13.54 13.54l1.06 1.06M14.6 5.4l-1.06 1.06M6.46 13.54l-1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11.75 3.5A6.75 6.75 0 1 0 16.5 12.25 5.25 5.25 0 0 1 11.75 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighContrastIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3.75v12.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 3.75a6.25 6.25 0 0 1 0 12.5Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.5 10a5.5 5.5 0 0 1 9.9-3.3M15.5 10a5.5 5.5 0 0 1-9.9 3.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.25 4.75v2.5h2.5M5.75 15.25v-2.5h-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Theme choices for Select demos — icons + descriptions. */
export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "system",
    label: "System",
    description: "Match the device appearance",
    icon: <SystemIcon />,
  },
  {
    value: "light",
    label: "Light",
    description: "Bright surfaces and clear contrast",
    icon: <LightIcon />,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low-light friendly surfaces",
    icon: <DarkIcon />,
  },
  {
    value: "high-contrast",
    label: "High contrast",
    description: "Stronger borders and text",
    icon: <HighContrastIcon />,
  },
  {
    value: "auto-schedule",
    label: "Auto schedule",
    description: "Light by day, dark at night",
    icon: <AutoIcon />,
  },
];
