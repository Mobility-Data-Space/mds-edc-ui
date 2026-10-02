import React from "react";

import { MuiSelect } from "@/components/atoms/mui-select";

import { GEO_REFERENCE_DATA } from "@/constants/data-category";
import { ASSET_ADVANCED_INFO_TRANSPORT_MODE } from "@/jsonld/asset";
import type { AssetFieldProps } from "@/types/asset-field";

export function AssetTransportMode({ translator, formData, onChange, errors }: AssetFieldProps): React.ReactElement {

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
