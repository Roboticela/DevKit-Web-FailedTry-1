/**
 * Country catalog for playground demos (Select / Combobox / Multi-Select / Phone).
 *
 * Flags use SVG images (not regional-indicator emoji). Windows does not render
 * emoji flags — it shows letter pairs like "PK" — so icons must be images.
 */

import type { ReactNode } from "react";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import COUNTRY_NAMES from "./country-names.json";

export type Country = {
  /** ISO 3166-1 alpha-2 (lowercase). */
  code: string;
  name: string;
};

export type DialCountry = Country & {
  /** International calling code digits (no leading +). */
  dial: string;
};

export const COUNTRIES: Country[] = (COUNTRY_NAMES as Array<[string, string]>).map(
  ([code, name]) => ({ code, name })
);

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code.toLowerCase());
}

export function getDialCode(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  try {
    return getCountryCallingCode(code.toUpperCase() as CountryCode);
  } catch {
    return undefined;
  }
}

/** Countries that have a libphonenumber calling code. */
export const DIAL_COUNTRIES: DialCountry[] = COUNTRIES.flatMap((c) => {
  const dial = getDialCode(c.code);
  return dial ? [{ ...c, dial }] : [];
});

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

/**
 * Dial-code Select options — label is `+92`, description is the country name,
 * searchable by both.
 */
export function countryDialOptions(): Array<{
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
}> {
  return DIAL_COUNTRIES.map((c) => ({
    value: c.code,
    label: `+${c.dial}`,
    description: c.name,
    icon: <CountryFlag code={c.code} />,
  }));
}
