import React from "react";
import {FormHelperText} from "@mui/material";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {RadioButton} from "@/components/atoms/radio-button";

import {DATA_ADDRESS_SELECT_DATA} from "@/constants/data-address-types";
import {theme} from "@/theme/ThemeProvider";
import { DataAddressTypes } from "@/utilities/data-address";

export interface AssetDataAddressFormStepProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean },
  methodAlwaysShowing?: boolean,
  customDataSourceConfigRows?: number,
}

export function AssetFormDataAddressStep({ formData, errors, onChange, translator, methodAlwaysShowing = false, customDataSourceConfigRows = 2 }: AssetDataAddressFormStepProps): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-5 items-start">
        <label
          htmlFor="data-address-type"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldDataAddressType"/>
        </label>
        <MuiSelect
          name="data-address-type"
          id="data-address-type"
          label={translator("assets.new.fieldDataAddressType")}
          options={DATA_ADDRESS_SELECT_DATA}
          error={errors.type}
          value={formData.type}
          onChange={(event) => onChange({ ...formData, type: event.target.value })}
        />
      </div>

      {formData.type === DataAddressTypes.MDSOnRequestOffer &&
        <Input
          name="data-address-description"
          id="data-address-description"
          key="data-address-description"
          multiline
          rows={customDataSourceConfigRows}
          label={translator("assets.new.fieldCustomDatasourceConfig")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          required
          helperText={typeof errors["ASSET_DATA_ADDRESS_DESCRIPTION"] === "string" ? errors["ASSET_DATA_ADDRESS_DESCRIPTION"] : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors["ASSET_DATA_ADDRESS_DESCRIPTION"]}
          value={formData.description}
          onChange={(event) => onChange({ ...formData, description: event.target.value })}
        />
      }
      {formData.type === DataAddressTypes.AzureBlob &&
        <Input
          name="data-address-description"
          id="data-address-description"
          key="data-address-description"
          multiline
          rows={customDataSourceConfigRows}
          label={translator("assets.new.fieldCustomDatasourceConfig")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          required
          helperText={typeof errors["ASSET_DATA_ADDRESS_DESCRIPTION"] === "string" ? errors["ASSET_DATA_ADDRESS_DESCRIPTION"] : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors["ASSET_DATA_ADDRESS_DESCRIPTION"]}
          value={formData.description}
          onChange={(event) => onChange({ ...formData, description: event.target.value })}
        />
      }
      {formData.type === DataAddressTypes.AmazonS3 &&
        <Input
          name="data-address-description"
          id="data-address-description"
          key="data-address-description"
          multiline
          rows={customDataSourceConfigRows}
          label={translator("assets.new.fieldCustomDatasourceConfig")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          required
          helperText={typeof errors["ASSET_DATA_ADDRESS_DESCRIPTION"] === "string" ? errors["ASSET_DATA_ADDRESS_DESCRIPTION"] : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors["ASSET_DATA_ADDRESS_DESCRIPTION"]}
          value={formData.description}
          onChange={(event) => onChange({ ...formData, description: event.target.value })}
        />
      }
      {formData.type === DataAddressTypes.CustomJson &&
        <Input
          name="data-address-description"
          id="data-address-description"
          key="data-address-description"
          multiline
          rows={customDataSourceConfigRows}
          label={translator("assets.new.fieldCustomDatasourceConfig")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          required
          helperText={typeof errors["ASSET_DATA_ADDRESS_DESCRIPTION"] === "string" ? errors["ASSET_DATA_ADDRESS_DESCRIPTION"] : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors["ASSET_DATA_ADDRESS_DESCRIPTION"]}
          value={formData.description}
          onChange={(event) => onChange({ ...formData, description: event.target.value })}
        />
      }
      {formData.type === DataAddressTypes.HttpData &&
        <>
          <div className="flex flex-col gap-y-5">
            <label
              htmlFor="data-address-method"
              className="inline-block text-sm text-black font-medium mb-2"
            >
              <T string="assets.new.fieldDataAddressMethodAndContentType"/>
            </label>
            <div>
              {methodAlwaysShowing || !JSON.parse(formData.proxyMethod || "false") ?
                <MuiSelect
                  name="data-address-method"
                  id="data-address-method"
                  label={translator("assets.new.fieldDataAddressMethod")}
                  options={[
                    {value: "GET"},
                    {value: "POST"},
                  ]}
                  error={errors.method}
                  value={formData.method}
                  disabled={methodAlwaysShowing && !! JSON.parse(formData.proxyMethod || "false")}
                  onChange={(event) => onChange({ ...formData, method: event.target.value })}
                />
                : ""
              }
              {methodAlwaysShowing || JSON.parse(formData.proxyMethod || "false") ?
                <FormHelperText>
                  <T string="assets.new.fieldDataAddressHttpProxyMethodHelper" />
                </FormHelperText>
                : ""
              }
            </div>

            <div>
              <RadioButton
                id="data-address-http-proxy-method"
                labelTrue={translator("assets.new.fieldDataAddressHttpProxyMethodTrue")}
                labelFalse={translator("assets.new.fieldDataAddressHttpProxyMethodFalse")}
                value={formData.proxyMethod}
                onChange={(value) => onChange({ ...formData, proxyMethod: value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-base-url"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              <T string="assets.new.fieldDataAddressUrl"/>
            </label>
            {formData.baseUrl && <FormHelperText>{translator("assets.new.fieldDataAddressHttpProxyPathHelper")}</FormHelperText>}

            <Input
              name="data-address-base-url"
              id="data-address-base-url"
              data-testid="data-address-base-url"
              type="url"
              required
              placeholder={"https://"}
              label={translator("assets.new.fieldDataAddressUrl")}
              error={errors["ASSET_DATA_ADDRESS_BASE_URL"]}
              value={formData.baseUrl}
              onChange={(event) => onChange({ ...formData, baseUrl: event.target.value })}
            />
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyPathTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyPathFalse")}
              id="data-address-http-proxy-path"
              value={formData.proxyPath}
              onChange={(value) => onChange({ ...formData, proxyPath: value })}
            />
          </div>
        </>
      }
    </div>
  );
}
