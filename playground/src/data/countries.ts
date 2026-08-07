/**
 * Country catalog for playground demos (Select / Combobox / Multi-Select).
 * Flags use Unicode regional indicators — no external assets.
 */

export type Country = {
  /** ISO 3166-1 alpha-2 (lowercase). */
  code: string;
  name: string;
  /** Flag emoji (regional indicator pair). */
  flag: string;
};

function flagFromCode(code: string): string {
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2) return "";
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + (cc.charCodeAt(0) - 65),
    A + (cc.charCodeAt(1) - 65)
  );
}

const COUNTRY_NAMES: Array<[string, string]> = [
  ["pk", "Pakistan"],
  ["ae", "United Arab Emirates"],
  ["sa", "Saudi Arabia"],
  ["us", "United States"],
  ["gb", "United Kingdom"],
  ["de", "Germany"],
  ["jp", "Japan"],
  ["fr", "France"],
  ["ca", "Canada"],
  ["au", "Australia"],
  ["in", "India"],
  ["cn", "China"],
  ["br", "Brazil"],
  ["za", "South Africa"],
  ["tr", "Türkiye"],
  ["eg", "Egypt"],
  ["ng", "Nigeria"],
  ["kr", "South Korea"],
  ["sg", "Singapore"],
  ["my", "Malaysia"],
];

export const COUNTRIES: Country[] = COUNTRY_NAMES.map(([code, name]) => ({
  code,
  name,
  flag: flagFromCode(code),
}));

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code.toLowerCase());
}

/** Select / Combobox option shape with flag as `icon`. */
export function countrySelectOptions() {
  return COUNTRIES.map((c) => ({
    value: c.code,
    label: c.name,
    icon: c.flag,
  }));
}
