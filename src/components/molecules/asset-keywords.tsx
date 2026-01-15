import React from "react";

import { KeywordsInput } from "@/components/atoms/keywords-input";

import { ASSET_KEYWORDS } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetKeywordsProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetKeywords({ translator, formData, onChange, errors }: AssetKeywordsProps): React.ReactElement {

  return (
    <KeywordsInput
      name={ASSET_KEYWORDS}
      id="properties-keywords"
      type="text"
      tooltip={translator("assets.new.fieldKeywordsTooltip")}
      placeholder={translator("assets.new.fieldKeywordsPlaceholder")}
      value={formData[ASSET_KEYWORDS] as []}
      error={errors[ASSET_KEYWORDS]}
      onChange={(value) => onChange({ ...formData, [ASSET_KEYWORDS]: value })}
    />
  );
}
