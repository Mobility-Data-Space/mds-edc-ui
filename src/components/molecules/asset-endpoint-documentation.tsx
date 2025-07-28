import React from "react";

import {Input} from "@/components/atoms/input";

import {T} from "@/i18n";

import {ASSET_ENDPOINT_DOCUMENTATION} from "@/jsonld/asset";
import {AssetProperties} from "@/utilities/asset";

export interface AssetEndpointDocumentationProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetEndpointDocumentation({ translator, formData, onChange, errors }: AssetEndpointDocumentationProps): JSX.Element {

  return (
    <Input
      name={ASSET_ENDPOINT_DOCUMENTATION}
      id="properties-endpoint-documentation"
      type="url"
      label={<T string="assets.new.fieldEndpointDocumentation" />}
      placeholder={"https://"}
      tooltip={translator("assets.new.fieldEndpointDocumentationTooltip")}
      value={formData[ASSET_ENDPOINT_DOCUMENTATION]}
      error={errors[ASSET_ENDPOINT_DOCUMENTATION]}
      onChange={(event) => onChange({ ...formData, [ASSET_ENDPOINT_DOCUMENTATION]: event.target.value })}
    />
  );
}
