import React from "react";
import {
  ASSET_LANGUAGE,
  AssetProperties
} from "@/schema/asset.ts";
import {MuiSelect} from "@/components/atoms/mui-select.tsx";
import {HIGHLIGHTED_LANGUAGE_SELECT_DATA, LANGUAGE_SELECT_DATA} from "@/constants/languages.ts";

export interface AssetLanguageProps {
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
}

export function AssetLanguage({ formData, onChange, errors }: AssetLanguageProps): JSX.Element {

  return (
    <MuiSelect
      name={ASSET_LANGUAGE}
      id="properties-language"
      key="properties-language"
      options={LANGUAGE_SELECT_DATA}
      highlights={HIGHLIGHTED_LANGUAGE_SELECT_DATA}
      value={formData[ASSET_LANGUAGE]}
      error={errors[ASSET_LANGUAGE]}
      onChange={(event) => onChange({...formData, [ASSET_LANGUAGE]: event.target.value})}
    />
  );
}
