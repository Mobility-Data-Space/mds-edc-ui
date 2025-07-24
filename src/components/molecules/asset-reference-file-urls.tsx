import React from "react";

import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";

import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list";

import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA, ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS} from "@/jsonld/asset";

import {AssetProperties} from "@/utilities/asset";

export interface AssetReferenceFileUrlsProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetReferenceFileUrls({ translator, formData, onChange, errors }: AssetReferenceFileUrlsProps): JSX.Element {

  return (<>
    <label
      htmlFor="advanced-info-reference-file-urls"
      className="inline-block text-sm text-black font-medium mb-2"
    >
      <T string="assets.new.fieldAdvancedInfoReferenceFileUrls"/>
      <Tooltip
        title={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
    </label>

    <KeyValuePairInputList
      name={ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS}
      id="advanced-info-reference-file-urls"
      type="text"
      label={translator("assets.new.fieldAdvancedInfoReferenceFileUrls")}
      addText={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsAddText")}
      valueLabel={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsValueLabel")}
      valuePlaceholder="https://my-org.com/my-data-offer/documentation/api-reference"
      error={errors[ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]}
      value={formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] as []}
      valueOnly
      onChange={(value) => onChange(
        {
          ...formData, 
          [ASSET_ADVANCED_INFO_DATA_MODEL]:{
            ...formData[ASSET_ADVANCED_INFO_DATA_MODEL],
            [ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA]: {
              ...formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA],
              [ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]: value
            }
          }
        })}
    />
  </>);
}
