/**
 * Phone helpers for playground demos — powered by `libphonenumber-js`
 * (Google's libphonenumber port): as-you-type national formatting + validation.
 */

import {
  AsYouType,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

export type PhoneValidationState = "empty" | "incomplete" | "invalid" | "valid";

export function toCountryCode(code: string): CountryCode {
  return code.trim().toUpperCase() as CountryCode;
}

/** Format national digits/punctuation as the user types (brackets, spaces, dashes). */
export function formatNationalAsYouType(country: string, input: string): string {
  const cc = toCountryCode(country);
  return new AsYouType(cc).input(input);
}

export function exampleNationalNumber(country: string): string {
  const phone = getExampleNumber(toCountryCode(country), examples);
  return phone?.formatNational() ?? "";
}

export function evaluatePhone(country: string, national: string): {
  state: PhoneValidationState;
  e164: string | null;
  nationalFormatted: string | null;
  message: string | null;
} {
  const trimmed = national.trim();
  if (!trimmed) {
    return { state: "empty", e164: null, nationalFormatted: null, message: null };
  }

  const phone = parsePhoneNumberFromString(trimmed, toCountryCode(country));
  if (!phone) {
    return {
      state: "incomplete",
      e164: null,
      nationalFormatted: null,
      message: "Keep typing your number",
    };
  }

  if (phone.isValid()) {
    return {
      state: "valid",
      e164: phone.format("E.164"),
      nationalFormatted: phone.formatNational(),
      message: `Valid · ${phone.format("E.164")}`,
    };
  }

  if (phone.isPossible()) {
    return {
      state: "incomplete",
      e164: null,
      nationalFormatted: phone.formatNational(),
      message: "Number looks incomplete",
    };
  }

  return {
    state: "invalid",
    e164: null,
    nationalFormatted: null,
    message: "Enter a valid phone number for this country",
  };
}
