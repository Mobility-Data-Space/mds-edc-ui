import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {ASSET_TITLE} from "@/schema/asset.ts";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetTitleProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
}

export function AssetTitle({ translator, formData, onChange, errors, hideLabel = false }: AssetTitleProps): JSX.Element {

  return (
    <Input
      required
      name={ASSET_TITLE}
      id="properties-title"
      data-testid="properties-title"
      type="text"
      label={hideLabel ? "" : <T string="assets.new.fieldTitle" />}
      placeholder={translator("assets.new.fieldTitlePlaceholder")}
      value={formData[ASSET_TITLE]}
      error={errors[ASSET_TITLE]}
      onChange={(event) => onChange({ ...formData, [ASSET_TITLE]: event.target.value })}
    />
  );
}
