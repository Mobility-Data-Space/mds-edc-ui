import React from "react";


import { KeyValuePairInputList } from "@/components/molecules/key-value-pair-input-list";

import { T } from "@/i18n";
import { DataAddress } from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";

export interface DataAddressHttpHeadersProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: (formData: DataAddress) => void;
  errors: { [key: string]: string | boolean };
  required?: boolean;
}

export function DataAddressHttpHeaders({ translator, formData, onChange, errors }: DataAddressHttpHeadersProps): React.ReactElement {

  return (
    <div className="flex flex-col gap-y-5 items-start">
      <label
        htmlFor="data-address-http-headers"
        className="inline-block text-sm text-gray-800 mt-2.5"
      >
        <T string="assets.new.fieldDataAddressHttpHeaders" />
      </label>
      <KeyValuePairInputList
        label={translator("assets.new.fieldDataAddressHttpHeaders")}
        addText={translator("assets.new.fieldDataAddressHttpHeadersAddText")}
        keyPlaceholder={translator("assets.new.fieldDataAddressHttpHeaderNamePlaceholder")}
        valuePlaceholder={"..."}
        name="headers"
        id="data-address-http-headers"
        type="text"
        required
        error={!!errors.headers}
        value={formData.headers || []}
        onChange={(value) => onChange({ ...formData, headers: value })}
      />
    </div>
  );
}
