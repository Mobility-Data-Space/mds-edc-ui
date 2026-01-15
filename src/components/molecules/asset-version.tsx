import React from "react";

import { Input } from "@/components/atoms/input";

import { T } from "@/i18n";
import { ASSET_VERSION } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetVersionProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  hideLabel?: boolean;
}

export function AssetVersion({ translator, formData, onChange, errors, hideLabel = false }: AssetVersionProps): React.ReactElement {

  return (
    <Input
      name={ASSET_VERSION}
      id="properties-version"
      type="text"
      label={hideLabel ? "" : <T string="assets.new.fieldVersion" />}
      placeholder={"1.0"}
      tooltip={translator("assets.new.fieldVersionTooltip")}
      value={formData[ASSET_VERSION]}
      error={errors[ASSET_VERSION]}
      onChange={(event) => onChange({ ...formData, [ASSET_VERSION]: event.target.value })}
    />
  );
}
