import React from "react";
import { T } from "@/i18n";
import Typography from "@mui/material/Typography";
import {AssetFieldShowProps, AssetFieldShow} from "@/components/molecules/asset-field-show.tsx";

interface AssetFieldGridProps {
  fields: AssetFieldShowProps[];
  label?: string;
  className?: string;
}

export default function AssetFieldGrid({ fields, label, className = "" }: AssetFieldGridProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {fields.map((field, index) =>
          <AssetFieldShow {...field} key={index}/>
        )}
      </div>
    </div>
  );
}
