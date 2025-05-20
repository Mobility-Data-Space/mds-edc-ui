import React from "react";
import {ASSET_KEYWORDS} from "@/schema/asset.ts";
import {KeywordsInput} from "@/components/atoms/keywords-input.tsx";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetKeywordsProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
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
