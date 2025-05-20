import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  ASSET_VERSION, AssetProperties
} from "@/schema/asset.ts";

export interface AssetDataUpdateFrequencyProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetDataUpdateFrequency({ translator, formData, onChange, errors }: AssetDataUpdateFrequencyProps): JSX.Element {

  return (
    <Input
      name={ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY}
      id="advanced-data-update-frequency"
      type="text"
      label={<T string="assets.new.fieldAdvancedDataUpdateFrequency"/>}
      placeholder={translator("assets.new.fieldAdvancedDataUpdateFrequencyPlaceholder")}
      tooltip={translator("assets.new.fieldAdvancedDataUpdateFrequencyTooltip")}
      value={formData[ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]}
      error={errors[ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]}
      onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]: event.target.value})}
    />
  );
}
