import Typography from "@mui/material/Typography";
import React, { ReactNode } from "react";

export interface TitleWithIconProps {
  icon?: ReactNode;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
}

export function TitleWithIcon({ icon, title, subtitle = "" }: TitleWithIconProps): React.ReactElement {

  return (
    <div className="flex flex-row gap-x-4 items-center">
      {icon}
      <div className="flex flex-col">
        <Typography variant="h4">
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {subtitle}
        </Typography>
      </div>
    </div>
  );
}
