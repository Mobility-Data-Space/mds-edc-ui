import React, {ReactNode} from "react";
import {TextField, Tooltip, IconButton, Icon} from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { InfoOutlined } from "@mui/icons-material";
import {AssetIcon} from "@/components/atoms/asset-icon.tsx";
import Typography from "@mui/material/Typography";

export interface TitleWithIconProps {
  icon?: ReactNode;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
}

export function TitleWithIcon({ icon, title, subtitle = "" }: TitleWithIconProps): JSX.Element {

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
