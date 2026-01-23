import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TimeAgo from "javascript-time-ago";
import { TIME_LOCALE } from "@/constants/time-locale.ts";

export type DateType = Dayjs | Date | null;

export const defaultTimeLocale = () => {
  return TIME_LOCALE;
};

export interface FormatDateTimeOptions {
  showSeconds?: boolean;
  showDayOfWeek?: boolean;
  showHour?: boolean;
  showMinute?: boolean;
}

export const formatDateTime = (
  milliSecondsTimestamp: number,
  {
    showDayOfWeek,
    showSeconds,
    showHour = true,
    showMinute = true,
  }: FormatDateTimeOptions = { showSeconds: false, showDayOfWeek: false },
) => {
  const formatter = new Intl.DateTimeFormat(defaultTimeLocale(), {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(showHour ? { hour: "numeric" } : {}),
    ...(showMinute ? { minute: "numeric" } : {}),
    ...(showSeconds ? { second: "numeric" } : {}),
    ...(showDayOfWeek ? { weekday: "long" } : {}),
  });

  return formatter.format(milliSecondsTimestamp);
};

export const browserDateFormat = () => {
  const customDate = new Date(2025, 11, 18);
  const strDate = formatDateTime(customDate.getTime(), {
    showHour: false,
    showMinute: false,
  });
  return strDate
    .replace("12", "MM")
    .replace("18", "DD")
    .replace("2025", "YYYY");
};

export const DATE_FORMAT = browserDateFormat();

export const dateToString = (date?: DateType | string) => {
  dayjs.extend(customParseFormat);

  // date is string or DateType
  const formattedDate =
    typeof date == "string" ? dayjs(date, DATE_FORMAT) : dayjs(date);

  return formattedDate.isValid() ? formattedDate.format(DATE_FORMAT) : "";
};

export const formatDateTimeAgo = (milliSecondsTimestamp: number) => {
  const timeAgo = new TimeAgo(defaultTimeLocale());

  if (!milliSecondsTimestamp) {
    return "";
  }

  return timeAgo.format(new Date(milliSecondsTimestamp));
};

export const dateToISO = (date?: string) => {
  if (!date) return "";

  dayjs.extend(customParseFormat);
  const parsedDate = dayjs(date, DATE_FORMAT);

  return parsedDate.isValid() ? parsedDate.toISOString() : "";
};

export const isoToDateString = (isoDate?: string) => {
  if (!isoDate) return "";

  const parsedDate = dayjs(isoDate);

  return parsedDate.isValid() ? parsedDate.format(DATE_FORMAT) : "";
};

export const isValidDate = (date?: string) => {
  if (!date) return true;

  dayjs.extend(customParseFormat);
  const parsedDate = dayjs(date, DATE_FORMAT, true);

  return parsedDate.isValid();
};
