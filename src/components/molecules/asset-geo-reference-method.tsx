import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD} from "@/schema/asset.ts";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetGeoReferenceMethodProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetGeoReferenceMethod({ translator, formData, onChange, errors }: AssetGeoReferenceMethodProps): JSX.Element {

  return (
    <Input
      name={ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD}
      id="advanced-info-geo-reference-method"
      type="text"
      label={<T string="assets.new.fieldAdvancedInfoGeoReferenceMethod"/>}
      placeholder={translator("assets.new.fieldAdvancedInfoGeoReferenceMethodPlaceholder")}
      tooltip={translator("assets.new.fieldAdvancedInfoGeoReferenceMethodTooltip")}
      value={formData[ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]}
      error={errors[ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]}
      onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]: event.target.value})}
    />
  );
}
