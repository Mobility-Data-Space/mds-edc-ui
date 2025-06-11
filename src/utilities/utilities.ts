import {DELIMITER} from "@/i18n";
import TimeAgo from "javascript-time-ago";
import {TIME_LOCALE} from "@/constants/time-locale.ts";
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export const truncate = (string: string, length: number = 10) => {
  if (! string) {
    return string;
  }
  return string.length > length ? string.substring(0, length) + "..." : string;
}

export const extractArrayValues = (array: any[]) => {
  if (! Array.isArray(array)) {
    return [array];
  }
  return array.map(item => {
    try {
      return item["https://w3id.org/edc/v0.0.1/ns/input"][0]["https://w3id.org/edc/v0.0.1/ns/value"][0]["@value"]
    } catch (e) {
      return "";
    }
  });
}

export const joinArrayValues = (array: any[]) => {
  return extractArrayValues(array).join(DELIMITER);
}

export const pascalCase = (string: string) => {
  return string.replace(
    /\w+/g,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).replaceAll(' ', '');
}

export const tryTranslatingWithTooltip = (value: string, prefix: string, translator: (key: string) => string) => {
  const tooltipTitleTranslationKey = `${prefix}.${value}Tooltip`;
  const tooltipTitleTranslation = translator(tooltipTitleTranslationKey);
  const tooltipTitle = tooltipTitleTranslation === tooltipTitleTranslationKey ? `"${value}"` : tooltipTitleTranslation;
  const valueTranslationKey = `${prefix}.${value}`;
  const valueTranslation = translator(valueTranslationKey);
  const computedValue = valueTranslation === valueTranslationKey ? value : valueTranslation;

  return [tooltipTitle, computedValue];
}

export interface FormatDateTimeOptions {
  showSeconds?: boolean,
  showDayOfWeek?: boolean,
}

export const formatDateTime = (melliSecondsTimestamp: number, { showDayOfWeek, showSeconds }: FormatDateTimeOptions = { showSeconds: false, showDayOfWeek: false }) => {
  const formatter = new Intl.DateTimeFormat(TIME_LOCALE, {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    ...(showSeconds ? { second: "numeric" } : {}),
    ...(showDayOfWeek ? { weekday: "long" } : {}),
  });

  return formatter.format(melliSecondsTimestamp);
}

export const formatDateTimeAgo = (melliSecondsTimestamp: number) => {
  const timeAgo = new TimeAgo(TIME_LOCALE);

  if (! melliSecondsTimestamp) {
    return "";
  }

  return timeAgo.format(new Date(melliSecondsTimestamp));
}
