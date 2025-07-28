import React from "react";

import {Input} from "@/components/atoms/input";

import {T} from "@/i18n";
import { ASSET_ORGANIZATION } from "@/jsonld/asset";
import {AssetProperties} from "@/utilities/asset";

export interface AssetSovereignLegalNameProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetSovereignLegalName({ translator, formData, onChange, errors }: AssetSovereignLegalNameProps): JSX.Element {

  return (
    <Input
      name={ASSET_ORGANIZATION}
      id="advanced-sovereign-legal-name"
      type="text"
      label={<T string="assets.new.fieldAdvancedInfoSovereignLegalName"/>}
      placeholder={translator("assets.new.fieldAdvancedInfoSovereignLegalNamePlaceholder")}
      tooltip={translator("assets.new.fieldAdvancedInfoSovereignLegalNameTooltip")}
      value={formData[ASSET_ORGANIZATION]}
      error={errors[ASSET_ORGANIZATION]}
      onChange={(event) => onChange({...formData, [ASSET_ORGANIZATION]: event.target.value})}
    />
  );
}
