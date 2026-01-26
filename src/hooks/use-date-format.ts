import { browserDateFormat } from "@/utilities/date";
import { useState } from "react";

export const useDateFormat = () => {
  const [dateFormat] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return browserDateFormat();
    }
    return "DD/MM/YYYY";
  });

  return dateFormat;
};
