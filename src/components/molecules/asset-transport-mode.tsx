import React from "react";
import {
  ASSET_ADVANCED_INFO_TRANSPORT_MODE,
  CreateAssetAdvancedInfoFormData,
} from "@/schema/asset.ts";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {DATA_GEO_REFERENCE_DATA} from "@/constants/data-category.ts";

export interface AssetTransportModeProps {
  translator: (key: string) => string;
  formData: CreateAssetAdvancedInfoFormData;
  onChange: (formData: CreateAssetAdvancedInfoFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetTransportMode({ translator, formData, onChange, errors }: AssetTransportModeProps): JSX.Element {

  return (
    <MuiSelect
      name={ASSET_ADVANCED_INFO_TRANSPORT_MODE}
      id="advanced-info-transport-mode"
      options={DATA_GEO_REFERENCE_DATA}
      placeholder={translator("assets.new.fieldAdvancedInfoTransportModePlaceholder")}
      value={formData[ASSET_ADVANCED_INFO_TRANSPORT_MODE]}
      error={errors[ASSET_ADVANCED_INFO_TRANSPORT_MODE]}
      onChange={(event) => onChange({
        ...formData,
        [ASSET_ADVANCED_INFO_TRANSPORT_MODE]: event.target.value
      })}
    />
  );
}
