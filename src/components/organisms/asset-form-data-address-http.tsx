import React from "react";
import {FormHelperText} from "@mui/material";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {RadioButton} from "@/components/atoms/radio-button";

export interface AssetFormDataAddressHttpProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
  methodAlwaysShowing?: boolean,
}


export function AssetFormDataAddressHttp({ formData, errors, onChange, translator, methodAlwaysShowing = false}: AssetFormDataAddressHttpProps): JSX.Element {
  return (
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
  );
}
