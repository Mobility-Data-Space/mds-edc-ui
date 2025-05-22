import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {theme} from "@/theme/ThemeProvider.tsx";
import {AssetProperties} from "@/utilities/asset.ts";
import { AssetInput } from "@think-it-labs/edc-connector-client";

export interface AssetIdProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
}

export function AssetId({ translator, formData, onChange, errors, hideLabel = false }: AssetIdProps): JSX.Element {
  return (
    <Input
      required
      name="@id"
      id="properties-id"
      data-testid="properties-id"
      type="text"
      label={hideLabel ? "" : <T string="assets.new.fieldId" />}
      placeholder={translator("assets.new.fieldIdPlaceholder")}
      value={formData["@id"]}
      error={errors["@id"]}
      helperText={typeof errors["@id"] === "string" ? errors["@id"] : ""}
      classes={{ textField: {
        '& p':{ color: theme.palette.error.main },
      }} as any}
      onChange={(event) => onChange({ ...formData, ["@id"]: event.target.value })}
    />
  );
}
