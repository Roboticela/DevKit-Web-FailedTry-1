import * as React from "react";

export type StepperSize = "sm" | "md";

/**
 * - `auto` — vertical under ~480px, horizontal otherwise
 * - `horizontal` — desktop-style row
 * - `vertical` — stacked stages
 * - `compact` — current step emphasis with short trail (narrow-friendly)
 */
export type StepperOrientation = "auto" | "horizontal" | "vertical" | "compact";

/**
 * - `linear` — only current (and optionally completed) are actionable; future steps blocked
 * - `non-linear` — any non-disabled step may be activated
 */
export type StepperMode = "linear" | "non-linear";

export type StepStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "disabled"
  | "error";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  /** Optional custom mark; defaults to step index or a check when completed. */
  icon?: React.ReactNode;
  /**
   * Explicit status. When omitted, derived from `value` / index:
   * before current → completed, match → current, after → upcoming.
   * `error` and `disabled` must be set explicitly.
   */
  status?: StepStatus;
  /** Force non-interactive even in non-linear mode. */
  disabled?: boolean;
}

export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onChange"> {
  /** Accessible name for the progress landmark. */
  label: string;
  steps: StepperStep[];
  /** Controlled current step id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: StepperSize;
  orientation?: StepperOrientation;
  mode?: StepperMode;
  /**
   * When true (default in non-linear, or when `mode` allows), completed/current
   * steps are activatable. Informational steppers set `interactive={false}`.
   */
  interactive?: boolean;
  disabled?: boolean;
}

const SIZE_CLASS: Record<StepperSize, string> = {
  sm: "dk-stepper--sm",
  md: "dk-stepper--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferVertical(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 479px)").matches;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.25 6.5 11.25 12.5 4.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function resolveStatus(
  step: StepperStep,
  index: number,
  currentIndex: number
): StepStatus {
  if (step.disabled) return "disabled";
  if (step.status) return step.status;
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "current";
  return "upcoming";
}

/**
 * Stepper (ID 035) — ordered stages for workflows, setup, checkout, and progress.
 *
 * Completion is explicit (status / position relative to current) — visiting alone
 * does not mark a step complete. Interactive steps are navigational; informational
 * steppers must set `interactive={false}`.
 */
export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(
  {
    label,
    steps,
    value: valueProp,
    defaultValue,
    onValueChange,
    size = "md",
    orientation = "auto",
    mode = "linear",
    interactive: interactiveProp,
    disabled = false,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-stepper-${reactId}`;

  const firstId = steps.find((s) => !s.disabled)?.id ?? steps[0]?.id ?? "";
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? firstId
  );
  const selected = isControlled ? String(valueProp) : uncontrolled;
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === selected)
  );

  const interactive = interactiveProp !== false;

  const [resolvedOrientation, setResolvedOrientation] = React.useState<
    "horizontal" | "vertical" | "compact"
  >(() => {
    if (orientation === "vertical") return "vertical";
    if (orientation === "compact") return "compact";
    if (orientation === "horizontal") return "horizontal";
    return "horizontal";
  });

  React.useEffect(() => {
    if (orientation === "horizontal") {
      setResolvedOrientation("horizontal");
      return;
    }
    if (orientation === "vertical") {
      setResolvedOrientation("vertical");
      return;
    }
    if (orientation === "compact") {
      setResolvedOrientation("compact");
      return;
    }
    const sync = () =>
      setResolvedOrientation(preferVertical() ? "vertical" : "horizontal");
    sync();
    const mq = window.matchMedia("(max-width: 479px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [orientation]);

  const commit = (id: string) => {
    if (disabled) return;
    if (!isControlled) setUncontrolled(id);
    onValueChange?.(id);
  };

  const canActivate = (step: StepperStep, index: number, status: StepStatus) => {
    if (!interactive || disabled || step.disabled || status === "disabled") {
      return false;
    }
    if (mode === "non-linear") {
      return status !== "disabled";
    }
    // linear: current + completed (+ error on/before current) are navigable
    return index <= currentIndex || status === "completed" || status === "error";
  };

  const statusLabel = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "current":
        return "Current";
      case "upcoming":
        return "Upcoming";
      case "disabled":
        return "Disabled";
      case "error":
        return "Error";
      default:
        return "";
    }
  };

  const focusStep = (id: string) => {
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(id)
        : id.replace(/"/g, '\\"');
    const root = document.getElementById(rootId);
    root
      ?.querySelector<HTMLElement>(`[data-step-id="${safe}"]`)
      ?.focus();
  };

  const move = (direction: 1 | -1) => {
    const activatable = steps
      .map((step, index) => ({
        step,
        index,
        status: resolveStatus(step, index, currentIndex),
      }))
      .filter(({ step, index, status }) => canActivate(step, index, status));
    if (activatable.length === 0) return;
    const pos = activatable.findIndex(({ step }) => step.id === selected);
    const start = pos === -1 ? 0 : pos;
    const next =
      activatable[(start + direction + activatable.length) % activatable.length];
    if (!next) return;
    commit(next.step.id);
    focusStep(next.step.id);
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
    if (disabled || !interactive) return;
    const vertical = resolvedOrientation === "vertical";
    const rtl =
      typeof document !== "undefined" &&
      (document.documentElement.dir === "rtl" ||
        getComputedStyle(event.currentTarget).direction === "rtl");

    switch (event.key) {
      case "ArrowRight":
        if (!vertical) {
          event.preventDefault();
          move(rtl ? -1 : 1);
        }
        break;
      case "ArrowLeft":
        if (!vertical) {
          event.preventDefault();
          move(rtl ? 1 : -1);
        }
        break;
      case "ArrowDown":
        if (vertical) {
          event.preventDefault();
          move(1);
        }
        break;
      case "ArrowUp":
        if (vertical) {
          event.preventDefault();
          move(-1);
        }
        break;
      case "Home":
        event.preventDefault();
        {
          const first = steps.find((s, i) =>
            canActivate(s, i, resolveStatus(s, i, currentIndex))
          );
          if (first) {
            commit(first.id);
            focusStep(first.id);
          }
        }
        break;
      case "End":
        event.preventDefault();
        {
          const reversed = [...steps].reverse();
          const last = reversed.find((s) => {
            const i = steps.findIndex((x) => x.id === s.id);
            return canActivate(s, i, resolveStatus(s, i, currentIndex));
          });
          if (last) {
            commit(last.id);
            focusStep(last.id);
          }
        }
        break;
      default:
        break;
    }
  };

  const compactCurrent = steps[currentIndex] ?? steps[0];
  const compactStatus = compactCurrent
    ? resolveStatus(compactCurrent, currentIndex, currentIndex)
    : "current";

  return (
    <nav
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-stepper",
        SIZE_CLASS[size],
        `dk-stepper--${resolvedOrientation}`,
        `dk-stepper--${mode}`,
        interactive ? "dk-stepper--interactive" : "dk-stepper--informative",
        disabled && "dk-stepper--disabled",
        className
      )}
      aria-label={label}
      data-size={size}
      data-orientation={resolvedOrientation}
      data-mode={mode}
      data-interactive={interactive || undefined}
      data-disabled={disabled || undefined}
    >
      {resolvedOrientation === "compact" ? (
        <div className="dk-stepper__compact">
          <p className="dk-stepper__compact-meta">
            Step {currentIndex + 1} of {steps.length}
          </p>
          {compactCurrent ? (
            <div
              className={cx(
                "dk-stepper__compact-current",
                `dk-stepper__step--${compactStatus}`
              )}
            >
              <span className="dk-stepper__indicator" aria-hidden="true">
                {compactStatus === "completed" ? (
                  <CheckIcon />
                ) : compactStatus === "error" ? (
                  <ErrorIcon />
                ) : (
                  compactCurrent.icon ?? currentIndex + 1
                )}
              </span>
              <span className="dk-stepper__copy">
                <span className="dk-stepper__label">{compactCurrent.label}</span>
                {compactCurrent.description ? (
                  <span className="dk-stepper__desc">
                    {compactCurrent.description}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <ol
          className="dk-stepper__list"
          onKeyDown={onListKeyDown}
        >
          {steps.map((step, index) => {
            const status = resolveStatus(step, index, currentIndex);
            const isActive = canActivate(step, index, status);
            const isLast = index === steps.length - 1;
            const mark =
              step.icon ??
              (status === "completed" ? (
                <CheckIcon />
              ) : status === "error" ? (
                <ErrorIcon />
              ) : (
                index + 1
              ));

            const ariaLabel = `${step.label}, ${statusLabel(status)}${
              step.description ? `, ${step.description}` : ""
            }`;

            const body = (
              <>
                <span className="dk-stepper__rail" aria-hidden="true">
                  <span className="dk-stepper__indicator">{mark}</span>
                  {!isLast ? <span className="dk-stepper__connector" /> : null}
                </span>
                <span className="dk-stepper__copy">
                  <span className="dk-stepper__label">{step.label}</span>
                  {step.description ? (
                    <span className="dk-stepper__desc">{step.description}</span>
                  ) : null}
                </span>
              </>
            );

            return (
              <li
                key={step.id}
                className={cx(
                  "dk-stepper__step",
                  `dk-stepper__step--${status}`,
                  isActive && "dk-stepper__step--actionable"
                )}
                data-status={status}
              >
                {isActive ? (
                  <button
                    type="button"
                    className="dk-stepper__trigger"
                    data-step-id={step.id}
                    aria-label={ariaLabel}
                    aria-current={status === "current" ? "step" : undefined}
                    disabled={disabled}
                    onClick={() => commit(step.id)}
                  >
                    {body}
                  </button>
                ) : (
                  <div
                    className="dk-stepper__trigger dk-stepper__trigger--static"
                    data-step-id={step.id}
                    aria-current={status === "current" ? "step" : undefined}
                  >
                    <span className="dk-stepper__sr-only">{ariaLabel}</span>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
});

Stepper.displayName = "Stepper";

export default Stepper;
