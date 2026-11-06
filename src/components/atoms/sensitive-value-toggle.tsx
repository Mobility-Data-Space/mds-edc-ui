import { useTranslator } from "@/i18n";
import { Icon, IconButton, InputAdornment } from "@mui/material";
import React from "react";

export function SensitiveValueToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}): React.ReactElement {
  const { translator } = useTranslator();

  return (
    <InputAdornment position="end">
      <IconButton
        aria-label={translator("common.showSensitiveValues")}
        aria-pressed={shown}
        onClick={onToggle}
      >
        <Icon>{shown ? "visibility_off" : "visibility"}</Icon>
      </IconButton>
    </InputAdornment>
  );
}
