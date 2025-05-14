import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {ASSET_ID, CreateAssetPropertiesFormData} from "@/schema/asset.ts";
import {theme} from "@/theme/ThemeProvider.tsx";

export interface AssetIdProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetId({ translator, formData, onChange, errors }: AssetIdProps): JSX.Element {

  return (
    <Input
      required
      name={ASSET_ID}
      id="properties-id"
      data-testid="properties-id"
      type="text"
      label={<T string="assets.new.fieldId" />}
      placeholder={translator("assets.new.fieldIdPlaceholder")}
      value={formData[ASSET_ID]}
      error={errors[ASSET_ID]}
      helperText={typeof errors[ASSET_ID] === "string" ? errors[ASSET_ID] : ""}
      classes={{ textField: {
        '& p':{ color: theme.palette.error.main },
      }} as any}
      onChange={(event) => onChange({ ...formData, [ASSET_ID]: event.target.value })}
    />
  );
}
