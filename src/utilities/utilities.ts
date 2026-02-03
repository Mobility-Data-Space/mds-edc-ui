import { DELIMITER } from "@/i18n";

export const truncate = (string: string, length: number = 10) => {
  if (!string) {
    return string;
  }
  return string.length > length ? string.substring(0, length) + "..." : string;
};

/**
 * Converts a string to Title Case.
 *
 * Examples:
 *   "HELLO WORLD" → "Hello World"
 *   "RAIL WAY"    → "Rail Way"
 *
 * Trims extra spaces, lowercases the input, and capitalizes each word.
 *
 * @param str - The input string to transform.
 * @returns The title-cased string.
 */
export const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const extractArrayValues = (array: any[]) => {
  if (!Array.isArray(array)) {
    return [array];
  }
  return array.map((item) => {
    try {
      return item["https://w3id.org/edc/v0.0.1/ns/input"][0][
        "https://w3id.org/edc/v0.0.1/ns/value"
      ][0]["@value"];
    } catch (e) {
      return "";
    }
  });
};

export const joinArrayValues = (array: any[]) => {
  return extractArrayValues(array).join(DELIMITER);
};

export const pascalCase = (string: string) => {
  return string
    .replace(
      /\w+/g,
      (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .replaceAll(" ", "");
};

export const upperAndSnakeCase = (string: string) => {
  return string.replaceAll(" ", "_").toUpperCase();
};

export const tryTranslatingWithTooltip = (
  value: string,
  prefix: string,
  translator: (key: string) => string,
) => {
  const tooltipTitleTranslationKey = `${prefix}.${value}Tooltip`;
  const tooltipTitleTranslation = translator(tooltipTitleTranslationKey);
  const tooltipTitle =
    tooltipTitleTranslation === tooltipTitleTranslationKey
      ? `"${value}"`
      : tooltipTitleTranslation;
  const valueTranslationKey = `${prefix}.${value}`;
  const valueTranslation = translator(valueTranslationKey);
  const computedValue =
    valueTranslation === valueTranslationKey ? value : valueTranslation;

  return [tooltipTitle, computedValue];
};

export const isUrl = (value: string): boolean => {
  try {
    if (/\s/.test(value)) return false;

    // Ensure URLs contain :// separator after protocol (reject http:example.com)
    if (!/^https?:\/\//.test(value)) return false;

    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname;

    const hostNameStructureIsValid =
      !hostname ||
      hostname.length === 0 ||
      hostname.endsWith(".") ||
      hostname.includes("..");

    if (hostNameStructureIsValid) return false;

    // Require at least one dot for TLD (e.g., example.com)
    // Split by dot and ensure we have at least 2 parts with non-empty TLD
    const parts = hostname.split(".");
    if (parts.length < 2) {
      return false;
    }

    // Ensure TLD part is non-empty and contains valid characters
    const tld = parts[parts.length - 1];
    if (!tld || tld.length === 0 || !/^[a-zA-Z0-9-]+$/.test(tld)) {
      return false;
    }

    // Ensure no part is empty (rejects cases like "example..com" which we already check, but also "..example.com")
    if (parts.some((part) => part.length === 0)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const isEmail = (email: string) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export const isDate = (date: string) => {
  // Can match different formats like 12/31/2025 and 1-1-2025 || ISO8601
  return (
    /^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/.test(date) ||
    /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?)?)?$/.test(
      date,
    )
  );
};

export const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36);
};

export const PROTOCOL_PATH = "/2025-1";

export const upgradeCounterPartyAddressToNextVersion = (
  counterPartyAddress: string,
) => {
  if (!counterPartyAddress.endsWith(PROTOCOL_PATH)) {
    return counterPartyAddress.replace(/\/+$/, "") + PROTOCOL_PATH;
  }

  return counterPartyAddress;
};
