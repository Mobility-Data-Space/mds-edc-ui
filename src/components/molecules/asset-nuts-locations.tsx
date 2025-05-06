import React from "react";
import {T} from "@/i18n";
import {
  ASSET_ADVANCED_INFO_NUTS_LOCATIONS,
  CreateAssetAdvancedInfoFormData,
} from "@/schema/asset.ts";
import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list.tsx";

export interface AssetNutsLocationsProps {
  translator: (key: string) => string;
  formData: CreateAssetAdvancedInfoFormData;
  onChange: (formData: CreateAssetAdvancedInfoFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetNutsLocations({ translator, formData, onChange, errors }: AssetNutsLocationsProps): JSX.Element {

  return (<>
    <label
      htmlFor="advanced-info-nuts-locations"
      className="inline-block text-sm text-black font-medium mb-2"
    >
      <T string="assets.new.fieldAdvancedInfoNutsLocation"/>
      <Tooltip
        title={translator("assets.new.fieldAdvancedInfoNutsLocationTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
    </label>

    <KeyValuePairInputList
      name={ASSET_ADVANCED_INFO_NUTS_LOCATIONS}
      id="advanced-info-nuts-locations"
      type="text"
      label={translator("assets.new.fieldAdvancedInfoNutsLocation")}
      addText={translator("assets.new.fieldAdvancedInfoNutsLocationAddText")}
      valueLabel={translator("assets.new.fieldAdvancedInfoNutsLocationValueLabel")}
      valuePlaceholder="DE929"
      error={errors[ASSET_ADVANCED_INFO_NUTS_LOCATIONS]}
      value={formData[ASSET_ADVANCED_INFO_NUTS_LOCATIONS] as []}
      valueOnly
      onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_NUTS_LOCATIONS]: value})}
    />
  </>);
}
