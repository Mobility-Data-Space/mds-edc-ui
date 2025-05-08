import React from "react";
import {T} from "@/i18n";
import {
  ASSET_KEYWORDS,
  CreateAssetPropertiesFormData,
} from "@/schema/asset.ts";
import {KeywordsInput} from "@/components/atoms/keywords-input.tsx";

export interface AssetKeywordsProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetKeywords({ translator, formData, onChange, errors }: AssetKeywordsProps): JSX.Element {

  return (
    <KeywordsInput
      name={ASSET_KEYWORDS}
      id="properties-keywords"
      type="text"
      tooltip={translator("assets.new.fieldKeywordsTooltip")}
      placeholder={translator("assets.new.fieldKeywordsPlaceholder")}
      value={formData[ASSET_KEYWORDS] as []}
      error={errors[ASSET_KEYWORDS]}
      onChange={(value) => onChange({...formData, [ASSET_KEYWORDS]: value})}
    />
  );
}
