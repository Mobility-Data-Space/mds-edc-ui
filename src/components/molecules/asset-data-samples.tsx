import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_VERSION, CreateAssetAdvancedInfoFormData,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";
import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list.tsx";

export interface AssetDataSamplesProps {
  translator: (key: string) => string;
  formData: CreateAssetAdvancedInfoFormData;
  onChange: (formData: CreateAssetAdvancedInfoFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetDataSamples({ translator, formData, onChange, errors }: AssetDataSamplesProps): JSX.Element {

  return (<>
    <label
      htmlFor="advanced-info-data-sample-urls"
      className="inline-block text-sm text-black font-medium mb-2"
    >
      <T string="assets.new.fieldAdvancedInfoDataSampleUrl"/>
      <Tooltip
        title={translator("assets.new.fieldAdvancedInfoDataSampleUrlTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
    </label>

    <KeyValuePairInputList
      name={ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS}
      id="advanced-info-data-sample-urls"
      type="text"
      label={translator("assets.new.fieldAdvancedInfoDataSampleUrl")}
      addText={translator("assets.new.fieldAdvancedInfoDataSampleUrlAddText")}
      valueLabel={translator("assets.new.fieldAdvancedInfoDataSampleUrlValueLabel")}
      valuePlaceholder="https://my-org.com/my-data-offer"
      error={errors[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]}
      value={formData[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] as []}
      valueOnly
      onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: value})}
    />
  </>);
}
