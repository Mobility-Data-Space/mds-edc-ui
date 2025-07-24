import React from "react";

import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";

import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list";

import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS} from "@/jsonld/asset";
import {AssetProperties} from "@/utilities/asset";
import {DataAddress} from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";

export interface DataAddressProxyQueryParamsProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: (formData: DataAddress) => void;
  errors: { [key: string]: string | boolean };
  required?: boolean;
}

export function DataAddressProxyQueryParams({ translator, formData, onChange, errors }: DataAddressProxyQueryParamsProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5 items-start">
      <label
        htmlFor="data-address-query-params"
        className="inline-block text-sm text-gray-800 mt-2.5"
      >
        <T string="assets.new.fieldDataAddressQueryParams"/>
      </label>
      <KeyValuePairInputList
        name="proxyQueryParams"
        id="data-address-proxy-query-params"
        type="text"
        label={translator("assets.new.fieldDataAddressQueryParams")}
        addText={translator("assets.new.fieldDataAddressQueryParamsAddText")}
        keyLabel={translator("assets.new.fieldDataAddressQueryParamsKeyLabel")}
        keyPlaceholder={translator("assets.new.fieldDataAddressQueryParamsKeyPlaceholder")}
        valueLabel={translator("assets.new.fieldDataAddressQueryParamsValueLabel")}
        valuePlaceholder="..."
        helperText={formData.proxyQueryParams ? translator("assets.new.fieldDataAddressQueryParamsHelper") : ""}
        value={formData.proxyQueryParams || []}
        onChange={(value) => onChange({...formData, proxyQueryParams: value})}
      />
    </div>
  );
}
