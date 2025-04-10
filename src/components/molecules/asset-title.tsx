import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ID, ASSET_TITLE,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";

export interface AssetTitleProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetTitle({ translator, formData, onChange, errors }: AssetTitleProps): JSX.Element {

  return (
    <Input
      required
      name={ASSET_TITLE}
      id="properties-title"
      data-testid="properties-title"
      type="text"
      label={<T string="assets.new.fieldTitle" />}
      placeholder={translator("assets.new.fieldTitlePlaceholder")}
      value={formData[ASSET_TITLE]}
      error={errors[ASSET_TITLE]}
      onChange={(event) => {
        const onChangeData = { ...formData, [ASSET_TITLE]: event.target.value };
        if (formData[ASSET_TITLE] === formData[ASSET_ID]) {
          onChangeData[ASSET_ID] = event.target.value;
        }
        onChange(onChangeData)
      }}
    />
  );
}
