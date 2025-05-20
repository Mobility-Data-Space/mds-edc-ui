import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {ASSET_ADVANCED_INFO_GEO_LOCATION} from "@/schema/asset.ts";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetGeoLocationsProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetGeoLocations({ translator, formData, onChange, errors }: AssetGeoLocationsProps): JSX.Element {

  return (
    <Input
      name={ASSET_ADVANCED_INFO_GEO_LOCATION}
      id="advanced-geo-location"
      type="text"
      label={<T string="assets.new.fieldAdvancedGeoLocation"/>}
      placeholder={"40.741895,-73.989308"}
      tooltip={translator("assets.new.fieldAdvancedGeoLocationTooltip")}
      value={formData[ASSET_ADVANCED_INFO_GEO_LOCATION]}
      error={errors[ASSET_ADVANCED_INFO_GEO_LOCATION]}
      onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_GEO_LOCATION]: event.target.value})}
    />
  );
}
