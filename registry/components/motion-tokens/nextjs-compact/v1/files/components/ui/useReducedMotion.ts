import * as React from "react";

/** Detects OS reduced-motion preference (and optional data-motion override). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const forced = root.dataset.motion;
    if (forced === "reduce") {
      setReduced(true);
      return;
    }
    if (forced === "full") {
      setReduced(false);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export type MotionPreference = "system" | "full" | "reduce";

/** Sets `data-motion` on `<html>` for global motion preference. */
export function useMotionPreference(
  preference: MotionPreference = "system"
): void {
  React.useEffect(() => {
    const root = document.documentElement;
    if (preference === "system") delete root.dataset.motion;
    else root.dataset.motion = preference;
    return () => {
      delete root.dataset.motion;
    };
  }, [preference]);
}
