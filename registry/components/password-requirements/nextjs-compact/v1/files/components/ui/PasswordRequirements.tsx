import * as React from "react";
import { List } from "../../../../../../../list/nextjs-compact/v1/files/components/ui/List";
import { ListItem } from "../../../../../../../list-item/nextjs-compact/v1/files/components/ui/ListItem";

/**
 * Password Requirements — live rule checklist for credential fields.
 * Composes List + List Item only. No custom list chrome.
 * Pass into Password Input via `requirements`.
 */

export type PasswordRequirementRule = {
  id: string;
  label: string;
  description?: string;
  /** Return true when the rule is satisfied. */
  test: (password: string) => boolean;
};

export type PasswordRequirementStatus = "pending" | "met" | "unmet";

export type PasswordRequirementResult = {
  id: string;
  label: string;
  description?: string;
  met: boolean;
  status: PasswordRequirementStatus;
};

export type PasswordRequirementsVariant = "checklist" | "compact" | "detailed";

export type PasswordRequirementsProps = {
  /** Live password value — rules re-evaluate while typing. */
  value?: string;
  /** Customizable rules. Default: `DEFAULT_PASSWORD_REQUIREMENT_RULES`. */
  rules?: PasswordRequirementRule[];
  /**
   * Controlled results. When provided, skips `rules` / `value` evaluation
   * (still useful for server-driven validation).
   */
  results?: PasswordRequirementResult[];
  variant?: PasswordRequirementsVariant;
  /** Treat empty password as pending (neutral) instead of unmet. Default: true. */
  pendingWhenEmpty?: boolean;
  label?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Slot: icon when a rule is met. */
  metIcon?: React.ReactNode;
  /** Slot: icon when a rule is unmet. */
  unmetIcon?: React.ReactNode;
  /** Slot: icon while pending (empty value). */
  pendingIcon?: React.ReactNode;
  /** Slot: replace an entire row. */
  renderItem?: (result: PasswordRequirementResult) => React.ReactNode;
  /** Called when evaluation changes. */
  onRequirementsChange?: (results: PasswordRequirementResult[], allMet: boolean) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.75 10.25 9 12.5l4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 7.5 12.5 12.5M12.5 7.5 7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Sensible defaults for registration / change-password forms. */
export const DEFAULT_PASSWORD_REQUIREMENT_RULES: PasswordRequirementRule[] = [
  {
    id: "length",
    label: "At least 12 characters",
    description: "Longer passwords are harder to guess.",
    test: (password) => password.length >= 12,
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "One symbol",
    description: "Examples: ! @ # $ %",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export function evaluatePasswordRequirements(
  password: string,
  rules: PasswordRequirementRule[],
  pendingWhenEmpty = true
): PasswordRequirementResult[] {
  const empty = password.length === 0;
  return rules.map((rule) => {
    const met = rule.test(password);
    let status: PasswordRequirementStatus;
    if (empty && pendingWhenEmpty) status = "pending";
    else status = met ? "met" : "unmet";
    return {
      id: rule.id,
      label: rule.label,
      description: rule.description,
      met,
      status,
    };
  });
}

export const PasswordRequirements = React.forwardRef<HTMLDivElement, PasswordRequirementsProps>(
  function PasswordRequirements(
    {
      value = "",
      rules = DEFAULT_PASSWORD_REQUIREMENT_RULES,
      results: resultsProp,
      variant = "checklist",
      pendingWhenEmpty = true,
      label = "Password requirements",
      hideLabel = false,
      disabled = false,
      className = "",
      id,
      metIcon,
      unmetIcon,
      pendingIcon,
      renderItem,
      onRequirementsChange,
    },
    ref
  ) {
    const reactId = React.useId();
    const headingId = `${id ?? reactId}-label`;

    const results = React.useMemo(() => {
      if (resultsProp) return resultsProp;
      return evaluatePasswordRequirements(value, rules, pendingWhenEmpty);
    }, [pendingWhenEmpty, resultsProp, rules, value]);

    const allMet = results.length > 0 && results.every((r) => r.met);

    const onChangeRef = React.useRef(onRequirementsChange);
    onChangeRef.current = onRequirementsChange;
    const lastKey = React.useRef("");

    React.useEffect(() => {
      const key = results.map((r) => `${r.id}:${r.status}`).join("|");
      if (lastKey.current === key) return;
      lastKey.current = key;
      onChangeRef.current?.(results, allMet);
    }, [allMet, results]);

    const iconFor = (status: PasswordRequirementStatus) => {
      if (status === "met") return metIcon ?? <SuccessIcon />;
      if (status === "pending") return pendingIcon ?? <PendingIcon />;
      return unmetIcon ?? <ErrorIcon />;
    };

    const density = variant === "compact" ? "compact" : "comfortable";
    const showDescriptions = variant === "detailed" || variant === "checklist";

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-password-requirements",
          `dk-password-requirements--${variant}`,
          allMet && "dk-password-requirements--complete",
          disabled && "dk-password-requirements--disabled",
          className
        )}
        data-variant={variant}
        data-complete={allMet || undefined}
        aria-disabled={disabled || undefined}
      >
        {!hideLabel ? (
          <div className="dk-password-requirements__label" id={headingId}>
            {label}
          </div>
        ) : (
          <span className="dk-password-requirements__sr-only" id={headingId}>
            {label}
          </span>
        )}

        <List
          density={density}
          selectionMode="none"
          interactive={!disabled}
          aria-labelledby={headingId}
          className="dk-password-requirements__list"
        >
          {results.map((result) => {
            if (renderItem) {
              return (
                <List.Item key={result.id} itemKey={result.id} className="dk-password-requirements__row">
                  {renderItem(result)}
                </List.Item>
              );
            }

            const statusLabel =
              result.status === "met"
                ? "Met"
                : result.status === "pending"
                  ? "Pending"
                  : "Not met";

            return (
              <List.Item
                key={result.id}
                itemKey={result.id}
                lines={showDescriptions && result.description ? "two" : "one"}
                className={cx(
                  "dk-password-requirements__row",
                  `dk-password-requirements__row--${result.status}`
                )}
              >
                <ListItem
                  density={density}
                  lines={showDescriptions && result.description ? "two" : "one"}
                  selected={result.met}
                  aria-label={`${result.label}: ${statusLabel}`}
                  className={cx(
                    "dk-password-requirements__item",
                    `dk-password-requirements__item--${result.status}`
                  )}
                >
                  <ListItem.Leading
                    className="dk-password-requirements__icon"
                    data-status={result.status}
                    aria-hidden="true"
                  >
                    {iconFor(result.status)}
                  </ListItem.Leading>
                  <ListItem.Primary>
                    <ListItem.Title as="span">{result.label}</ListItem.Title>
                    {showDescriptions && result.description ? (
                      <ListItem.Description>{result.description}</ListItem.Description>
                    ) : null}
                  </ListItem.Primary>
                </ListItem>
              </List.Item>
            );
          })}
        </List>

        <div className="dk-password-requirements__live" aria-live="polite">
          {allMet
            ? "All password requirements are met."
            : `${results.filter((r) => r.met).length} of ${results.length} requirements met.`}
        </div>
      </div>
    );
  }
);

PasswordRequirements.displayName = "PasswordRequirements";
export default PasswordRequirements;
