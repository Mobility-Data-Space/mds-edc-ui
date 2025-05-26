import React from "react";

import {Input} from "@/components/atoms/input";

import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_MODEL_ID} from "@/schema/asset";
import {AssetProperties} from "@/utilities/asset";

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
      value={formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_ID]}
      error={errors[ASSET_ADVANCED_INFO_DATA_MODEL]}
      onChange={(event) => onChange({
        ...formData, 
        [ASSET_ADVANCED_INFO_DATA_MODEL]: {
          ...formData[ASSET_ADVANCED_INFO_DATA_MODEL],
          [ASSET_ADVANCED_INFO_DATA_MODEL_ID]: event.target.value
        }
      })}
    />
  );
}
