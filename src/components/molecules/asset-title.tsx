import React from "react";

import { Input } from "@/components/atoms/input";

import { T } from "@/i18n";
import { ASSET_TITLE } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetTitleProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
}

export function AssetTitle({ translator, formData, onChange, errors, hideLabel = false }: AssetTitleProps): React.ReactElement {

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
