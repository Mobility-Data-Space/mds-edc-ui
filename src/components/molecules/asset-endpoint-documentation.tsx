import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ENDPOINT_DOCUMENTATION,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";

export interface AssetEndpointDocumentationProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
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
