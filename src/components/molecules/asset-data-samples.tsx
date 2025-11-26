import React from "react";

import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";

import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list";

import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS} from "@/jsonld/asset";
import {AssetProperties} from "@/utilities/asset";

export interface AssetDataSamplesProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
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
      errorText="This field must be a link"
      ensureValueIsALink
      onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: value})}
    />
  </>);
}
