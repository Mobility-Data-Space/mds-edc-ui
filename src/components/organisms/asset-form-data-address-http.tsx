import React from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {RadioButton} from "@/components/atoms/radio-button";
import {DataAddressAuthHeaders} from "@/components/molecules/data-address-auth-headers.tsx";
import {DataAddressHttpHeaders} from "@/components/molecules/data-address-http-headers.tsx";

export interface AssetFormDataAddressHttpProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
  methodAlwaysShowing?: boolean,
  isPull?: boolean,
  isDestination?: boolean,
}

const sourceMethods = [ "GET", "POST" ].map((value) => ({ value }));
const destinationMethods = [ "POST", "PUT", "PATCH" ].map((value) => ({ value }));

export function AssetFormDataAddressHttp({ formData, errors, onChange, translator, methodAlwaysShowing = false, isPull = false, isDestination = false }: AssetFormDataAddressHttpProps): JSX.Element {
  if (isPull) {
    return <></>;
  }

  const methods = isDestination ? destinationMethods : sourceMethods;

  return (
    <>
      <div className="flex flex-col gap-y-5">
        <label
          htmlFor="data-address-method"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldDataAddressMethod"/>
        </label>
        <div>
          <div className="sm:col-span-1 flex flex-col gap-y-3">
            {formData.proxyMethod ? "" :
              <MuiSelect
                name="data-address-method"
                id="data-address-method"
                label={translator("assets.new.fieldDataAddressMethod")}
                options={methods}
                error={errors.method}
                value={formData.method}
                disabled={methodAlwaysShowing}
                onChange={(event) => onChange({ ...formData, method: event.target.value })}
              />
            }
            <div>
              <RadioButton
                id="data-address-http-proxy-method"
                labelTrue={translator("assets.new.fieldDataAddressHttpProxyMethodTrue")}
                labelFalse={translator("assets.new.fieldDataAddressHttpProxyMethodFalse")}
                value={formData.proxyMethod}
                onChange={(value) => onChange({...formData, proxyMethod: value})}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="sm:col-span-2 flex flex-col gap-y-5">
            {isDestination ? "" :
              <label
                htmlFor="data-address-base-url"
                className="inline-block text-sm font-medium text-gray-800 mt-2.5"
              >
                <T string="assets.new.fieldDataAddressUrl"/>
              </label>
            }
            <Input
              name="data-address-base-url"
              id="data-address-base-url"
              data-testid="data-address-base-url"
              type="url"
              required
              placeholder={"https://"}
              label={translator("assets.new.fieldDataAddressUrl")}
              error={errors.baseUrl}
              value={formData.baseUrl}
              onChange={(event) => onChange({...formData, baseUrl: event.target.value})}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="data-address-content-type"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldDataAddressContentType"/>
          </label>
          <div>
            <Input
              name="data-address-content-type"
              id="data-address-content-type"
              data-testid="data-address-content-type"
              placeholder="application/json"
              label={translator("assets.headingContentType")}
              error={errors.contentType}
              value={formData.contentType}
              onChange={(event) => onChange({...formData, contentType: event.target.value})}
            />
          </div>
          <div>
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyBodyTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyBodyFalse")}
              id="data-address-http-proxy-body"
              value={formData.proxyBody}
              onChange={(value) => onChange({...formData, proxyBody: value})}
            />
          </div>
        </div>
        
        <div>
          <label
            htmlFor="data-address-path"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldDataAddressPath"/>
          </label>
          <div>
            <Input
              name="data-address-path"
              id="data-address-path"
              data-testid="data-address-path"
              placeholder="/api/.."
              label={translator("assets.headingPath")}
              error={errors.path}
              value={formData.path}
              onChange={(event) => onChange({...formData, path: event.target.value})}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyPathTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyPathFalse")}
              id="data-address-http-proxy-path"
              value={formData.proxyPath}
              onChange={(value) => onChange({...formData, proxyPath: value})}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="data-address-queryParams"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldDataAddressQueryParams"/>
          </label>
          <div>
            <Input
              name="data-address-queryParams"
              id="data-address-queryParams"
              data-testid="data-address-queryParams"
              placeholder="/api/.."
              label={translator("assets.headingQueryParams")}
              error={errors.queryParams}
              value={formData.queryParams}
              onChange={(event) => onChange({...formData, queryParams: event.target.value})}
            />
          </div>
          <div>
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyQueryParamsTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyQueryParamsFalse")}
              id="data-address-http-proxy-query-params"
              value={formData.proxyQueryParams}
              onChange={(value) => onChange({...formData, proxyQueryParams: value})}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 items-start">
        <DataAddressAuthHeaders
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <DataAddressHttpHeaders
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>
    </>
  );
}
