import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_VERSION, AssetProperties
} from "@/schema/asset.ts";

export interface AssetDataModelProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetDataModel({ translator, formData, onChange, errors }: AssetDataModelProps): JSX.Element {

  return (
    <Input
      name={ASSET_ADVANCED_INFO_DATA_MODEL}
      id="advanced-data-model"
      type="text"
      label={<T string="assets.new.fieldAdvancedInfoDataModel"/>}
      placeholder={translator("assets.new.fieldAdvancedInfoDataModelPlaceholder")}
      tooltip={translator("assets.new.fieldAdvancedInfoDataModelTooltip")}
      value={formData[ASSET_ADVANCED_INFO_DATA_MODEL]}
      error={errors[ASSET_ADVANCED_INFO_DATA_MODEL]}
      onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_MODEL]: event.target.value})}
    />
  );
}
