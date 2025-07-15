import React from "react";
import {FormHelperText} from "@mui/material";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {RadioButton} from "@/components/atoms/radio-button";
import {DataAddressProxyQueryParams} from "@/components/molecules/data-address-proxy-query-params.tsx";
import {DataAddressAuthHeaders} from "@/components/molecules/data-address-auth-headers.tsx";
import {DataAddressHttpHeaders} from "@/components/molecules/data-address-http-headers.tsx";
import {theme} from "@/theme/ThemeProvider.tsx";

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
const destinationMethods = [ "POST", "PUT", "PATCH", "DELETE" ].map((value) => ({ value }));
const proxyMethods = [ "", "GET", "POST", "PUT", "PATCH", "DELETE" ].map((value) => ({ value }));

export function AssetFormDataAddressHttp({ formData, errors, onChange, translator, methodAlwaysShowing = false, isPull = false, isDestination = false }: AssetFormDataAddressHttpProps): JSX.Element {
  if (isPull) {
    return <></>;
  }

  const methods = isDestination ? destinationMethods : sourceMethods;

  return (
    <>
      <div className="flex flex-col gap-y-5">
        {isDestination ? "" :
          <label
            htmlFor="data-address-method"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldDataAddressMethodAndContentType"/>
          </label>
        }
        <div className={isDestination ? 'sm:grid sm:grid-cols-3 gap-x-3' : ''}>
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
            {formData.proxyMethod &&
              <FormHelperText>
                <T string="assets.new.fieldDataAddressHttpProxyMethodHelper" />
              </FormHelperText>
            }
            {isDestination ? "" :
              <div>
                <RadioButton
                  id="data-address-http-proxy-method"
                  labelTrue={translator("assets.new.fieldDataAddressHttpProxyMethodTrue")}
                  labelFalse={translator("assets.new.fieldDataAddressHttpProxyMethodFalse")}
                  value={formData.proxyMethod}
                  onChange={(value) => onChange({...formData, proxyMethod: value})}
                />
              </div>
            }
          </div>
          <div className="sm:col-span-2 flex flex-col gap-y-5">
            {isDestination ? "" :
              <label
                htmlFor="data-address-base-url"
                className="inline-block text-sm font-medium text-gray-800 mt-2.5"
              >
                <T string="assets.new.fieldDataAddressUrl"/>
              </label>
            }
            {formData.baseUrl && !isDestination &&
              <FormHelperText>
                {translator("assets.new.fieldDataAddressHttpProxyPathHelper")}
              </FormHelperText>
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
      </div>

      {!isDestination ?
        <div className="flex flex-col gap-y-5 items-start">
          <DataAddressAuthHeaders
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
          <Input
            name="data-address-content-type"
            id="data-address-content-type"
            data-testid="data-address-content-type"
            required
            placeholder="application/json"
            label={translator("assets.headingContentType")}
            error={errors.contentType}
            value={formData.contentType}
            onChange={(event) => onChange({...formData, contentType: event.target.value})}
          />

          <DataAddressHttpHeaders
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
          <div className="flex flex-col items-start gap-3">
            <RadioButton
              labelTrue={translator("assets.new.fieldDataAddressHttpProxyPathTrue")}
              labelFalse={translator("assets.new.fieldDataAddressHttpProxyPathFalse")}
              id="data-address-http-proxy-path"
              value={formData.proxyPath}
              onChange={(value) => onChange({...formData, proxyPath: value})}
            />
            <div>
              <FormHelperText>
                {translator("assets.new.fieldEnableProxyBodyDescription")}
              </FormHelperText>
              <RadioButton
                labelTrue={translator("assets.new.fieldDataAddressHttpProxyBodyTrue")}
                labelFalse={translator("assets.new.fieldDataAddressHttpProxyBodyFalse")}
                id="data-address-http-proxy-body"
                value={formData.proxyBody}
                onChange={(value) => onChange({...formData, proxyBody: value})}
              />
            </div>
            <div>
              {formData.proxyQueryParams &&
                <FormHelperText>
                  {translator("assets.new.fieldDataAddressQueryParameterizationDescription")}
                </FormHelperText>
              }
              <RadioButton
                labelTrue={translator("assets.new.fieldDataAddressHttpProxyQueryParamsTrue")}
                labelFalse={translator("assets.new.fieldDataAddressHttpProxyQueryParamsFalse")}
                id="data-address-http-proxy-query-params"
                value={formData.proxyQueryParams}
                onChange={(value) => onChange({...formData, proxyQueryParams: value})}
              />
            </div>
          </div>
        </div> :

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

          <div className="sm:grid sm:grid-cols-3 gap-x-3 w-full">
            <div className="sm:col-span-1">
              <MuiSelect
                name="data-address-proxy-method"
                id="data-address-proxy-method"
                label={translator("assets.new.fieldDataAddressProxyMethod")}
                options={proxyMethods}
                error={errors.proxyMethod}
                value={formData.proxyMethod}
                onChange={(event) => onChange({...formData, proxyMethod: event.target.value})}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                name="data-address-proxy-path"
                id="data-address-proxy-path"
                data-testid="data-address-proxy-path"
                required
                placeholder="sub-path/endpoint"
                label={translator("assets.new.fieldDataAddressProxyPath")}
                error={errors.proxyPath}
                value={formData.proxyPath}
                onChange={(event) => onChange({...formData, proxyPath: event.target.value})}
              />
            </div>
          </div>

          <Input
            name="data-address-content-type"
            id="data-address-content-type"
            data-testid="data-address-content-type"
            required
            placeholder="application/json"
            label={translator("assets.new.fieldDataAddressContentType")}
            error={errors.contentType}
            value={formData.contentType}
            onChange={(event) => onChange({...formData, contentType: event.target.value})}
          />

          <Input
            name="data-address-proxy-body"
            id="data-address-proxy-body"
            key="data-address-proxy-body"
            multiline
            rows={3}
            label={translator("assets.new.fieldDataAddressProxyBody")}
            placeholder={'{"some": "request-body"}'}
            required
            classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
            error={errors.proxyBody}
            value={formData.proxyBody}
            onChange={(event) => onChange({...formData, proxyBody: event.target.value})}
          />
        </div>
      }

    </>
  );
}
