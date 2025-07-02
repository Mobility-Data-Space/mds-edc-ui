import dayjs, {Dayjs} from "dayjs";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import {TIME_LOCALE} from "@/constants/time-locale.ts";

TimeAgo.addDefaultLocale(en);

export type DateType = Dayjs | Date | null;

export const browserFormat = () => {
  const customDate = new Date(2222, 11, 18);
  const strDate = customDate.toLocaleDateString();
  return strDate.replace("12", "MM")
  .replace("18", "DD")
  .replace("2222", "YYYY");
}

export const browserLanguage = () => {
  return (navigator && navigator.language) || TIME_LOCALE;
}

export const DATE_FORMAT = browserFormat();

export const dateToString = (date?: DateType | string) => {
  if (typeof date === "string") {
    return date;
  }

  const dayjsDate = dayjs(date, DATE_FORMAT);
  return dayjsDate.isValid() ? dayjsDate.format(DATE_FORMAT) : "";
}

export interface FormatDateTimeOptions {
  showSeconds?: boolean,
  showDayOfWeek?: boolean,
}

export const formatDateTime = (melliSecondsTimestamp: number, {
  showDayOfWeek,
  showSeconds
}: FormatDateTimeOptions = {showSeconds: false, showDayOfWeek: false}) => {
  const formatter = new Intl.DateTimeFormat(browserLanguage(), {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    ...(showSeconds ? {second: "numeric"} : {}),
    ...(showDayOfWeek ? {weekday: "long"} : {}),
  });

  return formatter.format(melliSecondsTimestamp);
}

export const formatDateTimeAgo = (melliSecondsTimestamp: number) => {
  const timeAgo = new TimeAgo(browserLanguage());

  if (! milliSecondsTimestamp) {
    return "";
  }

  return timeAgo.format(new Date(milliSecondsTimestamp));
}
