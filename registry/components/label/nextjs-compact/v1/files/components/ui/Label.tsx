import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  truncate?: boolean;
}

/** Form and UI label text. */
export function Label({ truncate = false, className = "", children, ...props }: LabelProps) {
  return (
    <label className={`dk-type-label ${truncate ? "dk-truncate" : ""} ${className}`.trim()} {...props}>
      {children}
    </label>
  );
}
