import React from "react";
import Typography from "@mui/material/Typography";
import {FieldShowProps, FieldShow} from "@/components/molecules/field-show";
import { T } from "@/i18n";

interface FieldGridProps {
  fields: FieldShowProps[];
  label?: string;
  className?: string;
  contentClassName?: string;
}

export default function FieldGrid({ fields, label, className = "", contentClassName = "" }: FieldGridProps) {
  if (fields.length === 0) {
    return "";
  }

  return (
    <div className={`flex flex-col gap-y-2.5 ${className}`}>
      {label &&
        <Typography className="text-lg font-normal uppercase">
          <T string={label} />
        </Typography>
      }
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 ${contentClassName}`}>
        {fields.map((field, index) =>
          <FieldShow {...field} key={index}/>
        )}
      </div>
    </div>
  );
}
