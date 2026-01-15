import React from "react";

import { Input } from "@/components/atoms/input";

import { T } from "@/i18n";
import { ASSET_STANDARD_LICENSE } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetStandardLicenseProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetStandardLicense({ translator, formData, onChange, errors }: AssetStandardLicenseProps): React.ReactElement {

  return (
    <Input
      name={ASSET_STANDARD_LICENSE}
      id="properties-standard-license"
      type="text"
      label={<T string="assets.new.fieldStandardLicense" />}
      placeholder={"https://"}
      tooltip={translator("assets.new.fieldStandardLicenseTooltip")}
      value={formData[ASSET_STANDARD_LICENSE]}
      error={errors[ASSET_STANDARD_LICENSE]}
      onChange={(event) => onChange({ ...formData, [ASSET_STANDARD_LICENSE]: event.target.value })}
    />
  );
}
