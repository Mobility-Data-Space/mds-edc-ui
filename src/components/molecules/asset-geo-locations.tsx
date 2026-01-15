import { T } from "@/i18n";
import { ASSET_ADVANCED_INFO_GEO_LOCATION, ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";
import React from "react";
import { Input } from "../atoms/input";

export interface AssetGeoLocationsProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetGeoLocations({ translator, formData, onChange, errors }: AssetGeoLocationsProps): React.ReactElement {

  return (
    <Input
      name={ASSET_ADVANCED_INFO_GEO_LOCATION}
      id="advanced-geo-location"
      type="text"
      label={<T string="assets.new.fieldAdvancedGeoLocation" />}
      placeholder={"40.741895,-73.989308"}
      tooltip={translator("assets.new.fieldAdvancedGeoLocationTooltip")}
      value={formData[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL]}
      error={errors[ASSET_ADVANCED_INFO_GEO_LOCATION]}
      onChange={(event) => onChange({
        ...formData,
        [ASSET_ADVANCED_INFO_GEO_LOCATION]: {
          ...formData[ASSET_ADVANCED_INFO_GEO_LOCATION],
          [ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL]: event.target.value
        }
      })}
    />
  );
}
