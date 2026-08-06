import * as React from "react";

export type SpaceScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: "page" | "section" | "card" | "form" | "modal" | "nav" | "stack" | "inline";
  p?: SpaceScale;
  px?: SpaceScale;
  py?: SpaceScale;
  m?: SpaceScale;
  mx?: SpaceScale;
  my?: SpaceScale;
  gap?: SpaceScale;
  as?: keyof React.JSX.IntrinsicElements;
}

const PRESET: Record<NonNullable<SpaceProps["preset"]>, string> = {
  page: "dk-space-page",
  section: "dk-space-section",
  card: "dk-space-card dk-space-card-stack",
  form: "dk-space-form",
  modal: "dk-space-modal dk-space-modal-stack",
  nav: "dk-space-nav-item",
  stack: "dk-space-stack",
  inline: "dk-space-inline",
};

/** Tokenized spacing box — prefer presets over raw scales when possible. */
export function Space({
  preset,
  p,
  px,
  py,
  m,
  mx,
  my,
  gap,
  as = "div",
  className = "",
  children,
  ...props
}: SpaceProps) {
  const Tag = as as React.ElementType;
  const classes = [
    preset ? PRESET[preset] : "",
    p != null ? `dk-p-${p}` : "",
    px != null ? `dk-px-${px}` : "",
    py != null ? `dk-py-${py}` : "",
    m != null ? `dk-m-${m}` : "",
    mx != null ? `dk-mx-${mx}` : "",
    my != null ? `dk-my-${my}` : "",
    gap != null ? `dk-gap-${gap}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
