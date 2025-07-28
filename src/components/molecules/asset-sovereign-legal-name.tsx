import React from "react";

import {Input} from "@/components/atoms/input";

import {T} from "@/i18n";
import { ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME, ASSET_ORGANIZATION } from "@/jsonld/asset";
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
      name={ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME}
      id="advanced-sovereign-legal-name"
      type="text"
      label={<T string="assets.new.fieldAdvancedInfoSovereignLegalName"/>}
      placeholder={translator("assets.new.fieldAdvancedInfoSovereignLegalNamePlaceholder")}
      tooltip={translator("assets.new.fieldAdvancedInfoSovereignLegalNameTooltip")}
      value={formData[ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]}
      error={errors[ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]}
      onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]: event.target.value})}
    />
  );
}
