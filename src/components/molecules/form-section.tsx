import React, { PropsWithChildren } from "react";

import { Typography } from "@mui/material";

import { T } from "@/i18n";

interface FormSectionProps extends PropsWithChildren {
  titleKey: string;
  descriptionKey: string;
}

// A titled row of a long form: heading and description on the left, fields on the right.
export function FormSection({ titleKey, descriptionKey, children }: FormSectionProps): React.ReactElement {
  return (
    <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
      <div className="sm:col-span-1 mt-2.5">
        <Typography variant="h6">
          <T string={titleKey} />
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <T string={descriptionKey} />
        </Typography>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-6">{children}</div>
    </div>
  );
}

interface LabelledFieldProps extends PropsWithChildren {
  htmlFor: string;
  labelKey: string;
  required?: boolean;
}

export function LabelledField({ htmlFor, labelKey, required = false, children }: LabelledFieldProps): React.ReactElement {
  return (
    <div>
      <label htmlFor={htmlFor} className="inline-block text-sm text-black font-medium mb-2">
        <T string={labelKey} />
        {required && " *"}
      </label>
      {children}
    </div>
  );
}
