import React from "react";
import { FormHelperText } from "@mui/material";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {MuiSelect} from "../atoms/mui-select.tsx";
import {
  DATA_ADDRESS_SELECT_DATA,
  DATA_ADDRESS_TYPE_CUSTOM,
  DATA_ADDRESS_TYPE_HTTP
} from "@/constants/data-address-types.ts";
import {RadioButton} from "@/components/atoms/radio-button.tsx";
import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list.tsx";
import {
  ASSET_DATA_ADDRESS_BASE_URL,
  ASSET_DATA_ADDRESS_DESCRIPTION,
  ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION,
  ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION,
  ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET,
  ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE,
  ASSET_DATA_ADDRESS_HTTP_HEADERS,
  ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD,
  ASSET_DATA_ADDRESS_HTTP_PROXY_PATH,
  ASSET_DATA_ADDRESS_METHOD,
  ASSET_DATA_ADDRESS_QUERY_PARAMS,
  ASSET_DATA_ADDRESS_TYPE, CreateAssetDataAddressFormData,
} from "@/schema/asset.ts";

export interface AssetCreateDataAddressFormStepProps {
  translator: (key: string) => string,
  formData: CreateAssetDataAddressFormData,
  onChange: any,
  errors: { [key: string]: boolean },
}

export function AssetCreateFormDataAddressStep({ formData, errors, onChange, translator }: AssetCreateDataAddressFormStepProps): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-5 items-start">
        <label
          htmlFor="data-address-type"
          className="block text-sm text-gray-800 mb-1"
        >
          <T string="assets.new.fieldDataAddressType"/>
        </label>
        <MuiSelect
          name={ASSET_DATA_ADDRESS_TYPE}
          id="data-address-type"
          label={translator("assets.new.fieldDataAddressType")}
          options={DATA_ADDRESS_SELECT_DATA}
          error={errors[ASSET_DATA_ADDRESS_TYPE]}
          value={formData[ASSET_DATA_ADDRESS_TYPE]}
          onChange={(event) => onChange({ ...formData, [ASSET_DATA_ADDRESS_TYPE]: event.target.value })}
        />
      </div>

      {formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_CUSTOM.value &&
        <Input
          name={ASSET_DATA_ADDRESS_DESCRIPTION}
          id="properties-description"
          key="properties-description"
          multiline
          rows={6}
          label={translator("assets.new.fieldDescription")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          error={errors[ASSET_DATA_ADDRESS_DESCRIPTION]}
          value={formData[ASSET_DATA_ADDRESS_DESCRIPTION]}
          onChange={(event) => onChange({ ...formData, [ASSET_DATA_ADDRESS_DESCRIPTION]: event.target.value })}
        />
      }
      {formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value &&
        <>
          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-method"
              className="block text-sm text-gray-800 mb-1"
            >
              <T string="assets.new.fieldDataAddressMethodAndContentType"/>
            </label>
            {formData[ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD] ?
              <FormHelperText>
                <T string="assets.new.fieldDataAddressHttpProxyMethodHelper" />
              </FormHelperText> :
              <MuiSelect
                name={ASSET_DATA_ADDRESS_METHOD}
                id="data-address-method"
                label={translator("assets.new.fieldDataAddressMethod")}
                options={[
                  {value: "GET"},
                  {value: "POST"},
                ]}
                error={errors[ASSET_DATA_ADDRESS_METHOD]}
                value={formData[ASSET_DATA_ADDRESS_METHOD]}
                onChange={(event) => onChange({ ...formData, [ASSET_DATA_ADDRESS_TYPE]: event.target.value })}
              />
            }
            <RadioButton
              id="data-address-http-proxy-method"
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyMethodTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyMethodFalse")}
              value={formData[ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD]}
              onChange={(value) => onChange({ ...formData, [ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD]: value })}
            />
          </div>

          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-base-url"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string="assets.new.fieldDataAddressUrl"/>
            </label>
            {formData[ASSET_DATA_ADDRESS_HTTP_PROXY_PATH] && <FormHelperText>{translator("assets.new.fieldDataAddressHttpProxyPathHelper")}</FormHelperText>}

            <Input
              name={ASSET_DATA_ADDRESS_BASE_URL}
              id="data-address-base-url"
              type="url"
              required
              placeholder={"https://"}
              label={translator("assets.new.fieldDataAddressUrl")}
              error={errors[ASSET_DATA_ADDRESS_BASE_URL]}
              value={formData[ASSET_DATA_ADDRESS_BASE_URL]}
              onChange={(event) => onChange({ ...formData, [ASSET_DATA_ADDRESS_BASE_URL]: event.target.value })}
            />
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyPathTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyPathFalse")}
              id="data-address-http-proxy-path"
              value={formData[ASSET_DATA_ADDRESS_HTTP_PROXY_PATH]}
              onChange={(value) => onChange({ ...formData, [ASSET_DATA_ADDRESS_HTTP_PROXY_PATH]: value })}
            />
          </div>

          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-query-params"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string={formData[ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION] ? "assets.new.fieldDataAddressDefaultQueryParams" : "assets.new.fieldDataAddressQueryParams"}/>
            </label>
            <KeyValuePairInputList
              name={ASSET_DATA_ADDRESS_QUERY_PARAMS}
              id="data-address-query-params"
              type="text"
              label={translator("assets.new.fieldDataAddressQueryParams")}
              addText={translator("assets.new.fieldDataAddressQueryParamsAddText")}
              keyLabel={translator("assets.new.fieldDataAddressQueryParamsKeyLabel")}
              keyPlaceholder={translator("assets.new.fieldDataAddressQueryParamsKeyPlaceholder")}
              valueLabel={translator("assets.new.fieldDataAddressQueryParamsValueLabel")}
              valuePlaceholder="..."
              helperText={formData[ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION] ? translator("assets.new.fieldDataAddressQueryParamsHelper") : ""}
              error={errors[ASSET_DATA_ADDRESS_QUERY_PARAMS]}
              value={formData[ASSET_DATA_ADDRESS_QUERY_PARAMS]}
              onChange={(value) => onChange({ ...formData, [ASSET_DATA_ADDRESS_QUERY_PARAMS]: value })}
              additionalActions={[
                <RadioButton
                  key="enableQueryParameterization"
                  id="data-address-enable-query-parameterization"
                  labelTrue={translator("assets.new.fieldDataAddressQueryParameterizationTrue")}
                  labelFalse={translator("assets.new.fieldDataAddressQueryParameterizationFalse")}
                  value={formData[ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION]}
                  onChange={(value) => onChange({ ...formData, [ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION]: value })}
                />
              ]}
            />
          </div>

          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-base-url"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string="assets.new.fieldDataAddressEnableBodyParameterization"/>
            </label>

            {formData[ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION] && <FormHelperText>{translator("assets.new.fieldDataAddressEnableBodyParameterizationHelper")}</FormHelperText>}

            <RadioButton
              id="data-address-enable-body-parameterization"
              labelTrue={translator("assets.new.fieldDataAddressEnableBodyParameterizationTrue")}
              labelFalse={translator("assets.new.fieldDataAddressEnableBodyParameterizationFalse")}
              value={formData[ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION]}
              onChange={(value) => onChange({ ...formData, [ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION]: value })}
            />
          </div>

          {/* TODO: authentication */}
          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-base-url"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string="assets.new.fieldDataAddressHeaderAuth"/>
            </label>
            {formData[ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER] !== ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET ? "" : <>
              <MuiSelect
                name={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE}
                label={translator("assets.new.fieldDataAddressType")}
                options={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS.map(option => ({ value: option.value, text: translator(option.text) }))}
                error={errors[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE]}
                value={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE]}
                onChange={(event) => onChange({...formData, [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE]: event.target.value})}
              />

              <div className="grid sm:grid-cols-3 gap-2 w-full">
                <Input
                  className="sm:col-span-1"
                  name={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME}
                  id="properties-publisher"
                  type="text"
                  label={<T string="assets.new.fieldDataAddressAuthHeaderName"/>}
                  placeholder={translator("assets.new.fieldDataAddressAuthHeaderNamePlaceholder")}
                  value={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME]}
                  error={errors[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME]}
                  onChange={(event) => onChange({...formData, [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME]: event.target.value})}
                />

                <Input
                  className="sm:col-span-2"
                  name={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE}
                  id="properties-standard-license"
                  type="text"
                  label={<T string={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE] === ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET ? "assets.new.fieldDataAddressAuthHeaderVaultValue" : "assets.new.fieldDataAddressAuthHeaderValue"}/>}
                  placeholder={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE] === ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET ? "Mysecret123" : "Bearer ..."}
                  value={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE]}
                  error={errors[ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE]}
                  onChange={(event) => onChange({...formData, [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE]: event.target.value})}
                />
              </div>
            </>}

            <RadioButton
              id="data-address-enable-body-parameterization"
              trueValue={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET}
              falseValue={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE}
              labelTrue={translator("assets.new.fieldDataAddressHeaderTypeTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHeaderTypeFalse")}
              value={formData[ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER]}
              onChange={(value) => onChange({...formData, [ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER]: value})}
            />
          </div>

          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-query-params"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string="assets.new.fieldDataAddressHttpHeaders"/>
            </label>
            <KeyValuePairInputList
              label={translator("assets.new.fieldDataAddressHttpHeaders")}
              addText={translator("assets.new.fieldDataAddressHttpHeadersAddText")}
              keyLabel={translator("assets.new.fieldDataAddressHttpHeaderName")}
              keyPlaceholder={translator("assets.new.fieldDataAddressHttpHeaderNamePlaceholder")}
              valueLabel={translator("assets.new.fieldDataAddressHttpHeaderValue")}
              valuePlaceholder={"..."}
              name={ASSET_DATA_ADDRESS_HTTP_HEADERS}
              id="data-address-http-headers"
              type="text"
              required
              error={errors[ASSET_DATA_ADDRESS_HTTP_HEADERS]}
              value={formData[ASSET_DATA_ADDRESS_HTTP_HEADERS]}
              onChange={(value) => onChange({...formData, [ASSET_DATA_ADDRESS_HTTP_HEADERS]: value})}
            />
          </div>
        </>
      }
    </div>
  );
}
