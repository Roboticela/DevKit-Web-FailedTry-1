/**
 * World geo catalog for playground address demos.
 * Data: `country-state-city` (all countries, states/provinces, cities).
 * Flags: SVG images via CountryFlag (Windows-safe).
 */

import type { ReactNode } from "react";
import { City, Country, State } from "country-state-city";
import { CountryFlag } from "./countries";

export type GeoOption = {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.75c1.8 1.9 2.9 4.4 2.9 7.25S11.8 15.35 10 17.25M10 2.75C8.2 4.65 7.1 7.15 7.1 10S8.2 15.35 10 17.25M3.1 10h13.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RegionIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.25 5.5 10 3.25l5.75 2.25v5.1c0 3.15-2.35 5.85-5.75 6.9-3.4-1.05-5.75-3.75-5.75-6.9V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.25v4.5M8 10.5h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CountyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 16.25h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 16.25V8.5l5-3.75 5 3.75v7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.25 16.25v-4h3.5v4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CityIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.75 16.25V7.5L9 4.75l3.25 1.75V6.5h4v9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 9.25h1.5M6.25 12h1.5M10.75 9.25h1.5M10.75 12h1.5M14 9.25h1.25M14 12h1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 17.25s5.25-4.1 5.25-8.1A5.25 5.25 0 0 0 4.75 9.15c0 4 5.25 8.1 5.25 8.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="9" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function AddressIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 5.25h12M4 10h12M4 14.75h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PostalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="3.25"
        y="5.25"
        width="13.5"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.75 7.25 10 11l6.25-3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** All countries (250) with flag icons. */
export function geoCountryOptions(): GeoOption[] {
  return Country.getAllCountries()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      value: c.isoCode,
      label: c.name,
      description: c.isoCode,
      icon: <CountryFlag code={c.isoCode} />,
    }));
}

/** All states / provinces / regions for a country (e.g. GB counties, US states). */
export function geoStateOptions(countryCode: string | null | undefined): GeoOption[] {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode.toUpperCase()).map((s) => ({
    value: s.isoCode,
    label: s.name,
    description: s.isoCode,
    icon: <RegionIcon />,
  }));
}

/**
 * County / district options.
 * `country-state-city` has no separate worldwide county layer.
 * Admin-1 (state/province) already covers GB/IE counties via the region Select.
 * This Combobox stays open for a custom typed county/district everywhere.
 */
export function geoCountyOptions(
  _countryCode: string | null | undefined,
  _stateCode?: string | null
): GeoOption[] {
  return [];
}

/** All cities for a state, or all cities in the country when no state. */
export function geoCityOptions(
  countryCode: string | null | undefined,
  stateCode?: string | null
): GeoOption[] {
  if (!countryCode) return [];
  const cc = countryCode.toUpperCase();
  const cities = stateCode
    ? City.getCitiesOfState(cc, stateCode.toUpperCase())
    : City.getCitiesOfCountry(cc);

  return cities.map((c) => ({
    value: `${c.countryCode}:${c.stateCode}:${c.name}`,
    label: c.name,
    description: c.stateCode || cc,
    icon: <CityIcon />,
  }));
}

export function stateFieldLabel(countryCode: string | null | undefined): string {
  const cc = (countryCode ?? "").toUpperCase();
  if (cc === "US") return "State";
  if (cc === "CA") return "Province / territory";
  if (cc === "GB" || cc === "IE") return "County / region";
  if (cc === "AU") return "State / territory";
  if (cc === "DE" || cc === "AT" || cc === "CH") return "State / canton";
  if (cc === "IN" || cc === "PK" || cc === "BD") return "Province / state";
  return "State / province / region";
}

export function countyFieldLabel(countryCode: string | null | undefined): string {
  const cc = (countryCode ?? "").toUpperCase();
  if (cc === "US") return "County";
  if (cc === "GB") return "District / borough";
  return "County / district";
}
