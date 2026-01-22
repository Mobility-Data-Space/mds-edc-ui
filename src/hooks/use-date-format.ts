"use client";

import { useEffect, useState } from "react";
import { browserDateFormat } from "@/utilities/date";

// Hook to get date format on client side
export const useDateFormat = () => {
  const [dateFormat, setDateFormat] = useState<string>("DD/MM/YYYY");
  
  useEffect(() => {
    setDateFormat(browserDateFormat());
  }, []);
  
  return dateFormat;
};
