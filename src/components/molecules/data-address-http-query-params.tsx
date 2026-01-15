import React from "react";


import { KeyValuePairInputList } from "@/components/molecules/key-value-pair-input-list";

import { T } from "@/i18n";
import { DataAddress } from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";
import { RadioButton } from "../atoms/radio-button";

export interface DataAddressHttpQueryParamsProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: (formData: DataAddress) => void;
  errors: { [key: string]: string | boolean };
  required?: boolean;
  isDestination: boolean;
}

export function DataAddressHttpQueryParams({ translator, formData, onChange, errors, isDestination = false }: DataAddressHttpQueryParamsProps): React.ReactElement {

  return (
    <div className="flex flex-col gap-y-5 items-start">
      <label
        htmlFor="data-address-query-params"
        className="inline-block text-sm font-medium text-gray-800 mt-2.5"
      >
        <T string="assets.new.fieldDataAddressQueryParams" />
      </label>
      {JSON.parse(formData.proxyQueryParams || "false") ? "" :
        <KeyValuePairInputList
          name="queryParams"
          id="data-address-query-params"
          type="text"
          label={translator("assets.new.fieldDataAddressQueryParams")}
          addText={translator("assets.new.fieldDataAddressQueryParamsAddText")}
          keyLabel={translator("assets.new.fieldDataAddressQueryParamsKeyLabel")}
          keyPlaceholder={translator("assets.new.fieldDataAddressQueryParamsKeyPlaceholder")}
          valueLabel={translator("assets.new.fieldDataAddressQueryParamsValueLabel")}
          valuePlaceholder="..."
          value={formData.queryParams || []}
          onChange={(value) => onChange({ ...formData, queryParams: value })}
        />
      }
      {isDestination ? "" :
        <RadioButton
          labelTrue={translator("assets.new.fieldDataAddressHttpProxyQueryParamsTrue")}
          labelFalse={translator("assets.new.fieldDataAddressHttpProxyQueryParamsFalse")}
          id="data-address-http-proxy-query-params"
          value={formData.proxyQueryParams}
          onChange={(value) => onChange({ ...formData, proxyQueryParams: value })}
        />
      }
    </div>
  );
}
