import dayjs, {Dayjs} from "dayjs";

export const DATE_FORMAT = 'DD/MM/YYYY';

export type DateType = Dayjs | Date | null;

export const dateToString = (date?: DateType | string) => {
  if (typeof date === "string") {
    return date;
  }

  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(DATE_FORMAT) : "";
}
