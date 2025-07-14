import dayjs, {Dayjs} from "dayjs";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import {TIME_LOCALE} from "@/constants/time-locale.ts";

export type DateType = Dayjs | Date | null;

export const browserLanguage = () => {
  return (typeof navigator !== 'undefined' && navigator.language) || TIME_LOCALE;
}

export interface FormatDateTimeOptions {
  showSeconds?: boolean,
  showDayOfWeek?: boolean
  showHour?: boolean
  showMinute?: boolean
}

export const formatDateTime = (milliSecondsTimestamp: number, {
  showDayOfWeek,
  showSeconds,
  showHour = true,
  showMinute = true,
}: FormatDateTimeOptions = {showSeconds: false, showDayOfWeek: false}) => {
  const formatter = new Intl.DateTimeFormat(browserLanguage(), {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(showHour ? {hour: "numeric"} : {}),
    ...(showMinute ? {minute: "numeric"} : {}),
    ...(showSeconds ? {second: "numeric"} : {}),
    ...(showDayOfWeek ? {weekday: "long"} : {}),
  });

  return formatter.format(milliSecondsTimestamp);
}

export const browserDateFormat = () => {
  const customDate = new Date(2025, 11, 18);
  const strDate = formatDateTime(customDate.getTime(), { showHour: false, showMinute: false });
  return strDate.replace("12", "MM")
  .replace("18", "DD")
  .replace("2025", "YYYY");
}

export const DATE_FORMAT = browserDateFormat();
export const DEFAULT_DATE_FORMAT = "DD-MM-YYYY";

export const dateToString = (date?: DateType | string) => {
  if (typeof date === "string") {
    return date;
  }

  const dayjsDate = dayjs(date, DATE_FORMAT);
  return dayjsDate.isValid() ? dayjsDate.format(DATE_FORMAT) : "";
}

export const formatDateTimeAgo = (milliSecondsTimestamp: number) => {
  const timeAgo = new TimeAgo(browserLanguage());

  if (! milliSecondsTimestamp) {
    return "";
  }

  return timeAgo.format(new Date(milliSecondsTimestamp));
}
