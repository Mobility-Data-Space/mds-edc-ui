import { Input } from "@/components/atoms/input";
import { T } from "@/i18n";
import { theme } from "@/theme/ThemeProvider";
import { AssetProperties } from "@/utilities/asset";
import { CircularProgress, InputAdornment } from "@mui/material";
import React from "react";

export interface AssetIdProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export function AssetId({ translator, formData, onChange, errors, hideLabel = false, disabled = false, loading = false }: AssetIdProps): React.ReactElement {

  return (
    <Input
      required
      disabled={disabled}
      name="@id"
      id="properties-id"
      data-testid="properties-id"
      type="text"
      label={hideLabel ? "" : <T string="assets.new.fieldId" />}
      placeholder={translator("assets.new.fieldIdPlaceholder")}
      value={formData["@id"]}
      error={errors["@id"]}
      helperText={typeof errors["@id"] === "string" ? errors["@id"] : ""}
      classes={{
        textField: {
          '& p': { color: theme.palette.error.main },
        }
      } as any}
      slotProps={{
        input: {
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} color="secondary" />
            </InputAdornment>
          ) : null,
        },
      }}
      onChange={(event) => onChange({ ...formData, ["@id"]: event.target.value })}
    />
  );
}
