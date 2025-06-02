import React from "react";
import {FormHelperText, Link} from "@mui/material";

import {Input} from "@/components/atoms/input";

import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE} from "@/schema/asset";
import {AssetProperties} from "@/utilities/asset";

export interface AssetConditionsForUseProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetConditionsForUse({ translator, formData, onChange, errors }: AssetConditionsForUseProps): JSX.Element {

  return (<>
    <Input
      name={ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE}
      id="advanced-info-conditions-for-use"
      label={<T string="assets.new.fieldAdvancedInfoConditionsForUse"/>}
      placeholder={translator("assets.new.fieldAdvancedInfoConditionsForUsePlaceholder")}
      multiline
      rows={6}
      value={formData[ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]}
      error={errors[ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]}
      onChange={(event) => onChange({
        ...formData,
        [ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]: event.target.value
      })}
    />
    <FormHelperText className="flex flex-row gap-x-1">
      <T string="assets.new.fieldAdvancedInfoConditionsForUseSupport"/>
      <Link href="https://www.markdownguide.org/basic-syntax" target="_blank" color="secondary" >
        Markdown syntax
      </Link>
    </FormHelperText>
  </>);
}
