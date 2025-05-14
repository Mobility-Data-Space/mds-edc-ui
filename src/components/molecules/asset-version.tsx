import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_VERSION,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";

export interface AssetVersionProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
}

export function AssetVersion({ translator, formData, onChange, errors, hideLabel = false }: AssetVersionProps): JSX.Element {

  return (
    <Input
      name={ASSET_VERSION}
      id="properties-version"
      type="text"
      label={hideLabel ? "" : <T string="assets.new.fieldVersion" />}
      placeholder={"1.0"}
      tooltip={translator("assets.new.fieldVersionTooltip")}
      value={formData[ASSET_VERSION]}
      error={errors[ASSET_VERSION]}
      onChange={(event) => onChange({ ...formData, [ASSET_VERSION]: event.target.value })}
    />
  );
}
