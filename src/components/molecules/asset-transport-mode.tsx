import React from "react";
import {ASSET_ADVANCED_INFO_TRANSPORT_MODE} from "@/schema/asset.ts";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {GEO_REFERENCE_DATA} from "@/constants/data-category.ts";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetTransportModeProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetTransportMode({ translator, formData, onChange, errors }: AssetTransportModeProps): JSX.Element {

  return (
    <MuiSelect
      name={ASSET_ADVANCED_INFO_TRANSPORT_MODE}
      id="advanced-info-transport-mode"
      options={GEO_REFERENCE_DATA}
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
