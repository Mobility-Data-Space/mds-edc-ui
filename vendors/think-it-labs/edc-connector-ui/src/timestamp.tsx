import React from "react";
import { useMemo } from "react";

export interface TimestampProps extends Intl.DateTimeFormatOptions {
  milliseconds?: number;
  seconds?: number;
  locales?: string | string[];
  placeholder?: string;
}

export function Timestamp({
  milliseconds,
  seconds,
  locales = "en-GB",
  timeZone = "Europe/Berlin",
  placeholder = "n.d.",
  ...rest
}: TimestampProps) {
  const fmt = useMemo(() =>
    new Intl.DateTimeFormat(locales, {
      ...rest,
      timeZone,
    }), [locales, timeZone, rest]);

  if (typeof milliseconds === "number") {
    return <>{fmt.format(milliseconds * 1000)}</>;
  }

  if (typeof seconds === "number") {
    return <>{fmt.format(seconds)}</>;
  }

  return <>{placeholder}</>;
}
