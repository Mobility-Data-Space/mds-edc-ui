import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ID, ASSET_STANDARD_LICENSE,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";

export interface AssetStandardLicenseProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetStandardLicense({ translator, formData, onChange, errors }: AssetStandardLicenseProps): JSX.Element {

  return (
    <Input
      name={ASSET_STANDARD_LICENSE}
      id="properties-standard-license"
      type="text"
      label={<T string="assets.new.fieldStandardLicense" />}
      placeholder={"https://"}
      tooltip={translator("assets.new.fieldStandardLicenseTooltip")}
      value={formData[ASSET_STANDARD_LICENSE]}
      error={errors[ASSET_STANDARD_LICENSE]}
      onChange={(event) => onChange({ ...formData, [ASSET_STANDARD_LICENSE]: event.target.value })}
    />
  );
}
