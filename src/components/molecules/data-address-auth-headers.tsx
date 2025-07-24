import React from "react";

import {IconButton, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";

import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list";

import {T} from "@/i18n";
import {
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS
} from "@/jsonld/asset";
import {AssetProperties} from "@/utilities/asset";
import {DataAddress} from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {Input} from "@/components/atoms/input.tsx";
import {RadioButton} from "@/components/atoms/radio-button.tsx";

export interface AssetDataSamplesProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: (formData: DataAddress) => void;
  errors: { [key: string]: string | boolean };
  required?: boolean;
}

export function DataAddressAuthHeaders({ translator, formData, onChange, errors }: AssetDataSamplesProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5 items-start w-full">
      <label
        htmlFor="data-address-base-url"
        className="inline-block text-sm text-gray-800 mt-2.5"
      >
        <T string="assets.new.fieldDataAddressHeaderAuth"/>
      </label>
      {!formData.addAuthHeaders ? "" : <>
        <MuiSelect
          name="authHeaderType"
          label={translator("assets.new.fieldDataAddressType")}
          options={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS.map(option => ({
            value: option.value,
            text: translator(option.text)
          }))}
          defaultValue="Vault"
          error={errors.authHeaderType}
          value={formData.authHeaderType || "Vault-Secret"}
          onChange={(event) => onChange({...formData, authHeaderType: event.target.value})}
        />

        <div className="grid sm:grid-cols-3 gap-2 w-full">
          <Input
            className="sm:col-span-1"
            name="authKey"
            id="data-address-auth-key"
            type="text"
            label={<T string="assets.new.fieldDataAddressAuthHeaderName"/>}
            placeholder={translator("assets.new.fieldDataAddressAuthHeaderNamePlaceholder")}
            value={formData.authKey}
            error={errors.authKey}
            onChange={(event) => onChange({...formData, authKey: event.target.value})}
          />

          <Input
            className="sm:col-span-2"
            name="authCode"
            id="data-address-auth-code"
            type="text"
            label={<T
              string={`assets.new.fieldDataAddressAuthHeader${formData.authHeaderType === "Vault-Secret" ? "Vault" : ""}Value`}/>}
            placeholder={formData.authHeaderType === "Vault-Secret" ? "Mysecret123" : "Bearer ..."}
            value={formData.authCode}
            error={errors.authCode}
            onChange={(event) => onChange({...formData, authCode: event.target.value})}
          />
        </div>
      </>}

      <RadioButton
        id="data-address-enable-body-parameterization"
        labelTrue={translator("assets.new.fieldDataAddressHeaderTypeTrue")}
        labelFalse={translator("assets.new.fieldDataAddressHeaderTypeFalse")}
        value={formData.addAuthHeaders}
        onChange={(value) => onChange({...formData, addAuthHeaders: value})}
      />
    </div>
  );
}
