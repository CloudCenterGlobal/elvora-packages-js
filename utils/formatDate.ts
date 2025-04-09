// import date formatter from date-fns
import { format } from "date-fns/format";

const dateFormats = {
  dateTime24: "do MMM yyyy HH:mm",
  dateTime12: "do MMM yyyy hh:mm a",
  date: "do MMM yyyy",
  time: "HH:mm",
} as const;

type DateFormats = keyof typeof dateFormats;

const fDate = (date: Date | string, formatStr: DateFormats = "date") => {
  if (!date) return "-";
  return format(date, dateFormats[formatStr] ?? dateFormats.dateTime24);
};

const fDateTime = (date: Date | string, formatStr: DateFormats = "dateTime24") => {
  return fDate(date, formatStr);
};

const fShortDate = (date: Date | string) => {
  // if today, show time otherwise show date and time
  const today = new Date();
  const _date = new Date(date);

  if (today.getDate() === _date.getDate()) {
    return fDateTime(date, "time");
  }

  return fDateTime(date, "dateTime24");
};

export { dateFormats, fDate, fDateTime, fShortDate };
