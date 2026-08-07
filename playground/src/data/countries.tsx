/**
 * Country catalog for playground demos (Select / Combobox / Multi-Select).
 *
 * Flags use SVG images (not regional-indicator emoji). Windows does not render
 * emoji flags — it shows letter pairs like "PK" — so icons must be images.
 */

import type { ReactNode } from "react";
import COUNTRY_NAMES from "./country-names.json";

export type Country = {
  /** ISO 3166-1 alpha-2 (lowercase). */
  code: string;
  name: string;
};

export const COUNTRIES: Country[] = (COUNTRY_NAMES as Array<[string, string]>).map(
  ([code, name]) => ({ code, name })
);

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code.toLowerCase());
}

/** Flag mark for Select / Combobox option `icon` and trigger leading slot. */
export function CountryFlag({ code }: { code: string }) {
  const cc = code.trim().toLowerCase();
  return (
    <img
      className="dk-country-flag"
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

/** Select / Combobox option shape with flag as `icon`. */
export function countrySelectOptions(): Array<{
  value: string;
  label: string;
  icon: ReactNode;
}> {
  return COUNTRIES.map((c) => ({
    value: c.code,
    label: c.name,
    icon: <CountryFlag code={c.code} />,
  }));
}
