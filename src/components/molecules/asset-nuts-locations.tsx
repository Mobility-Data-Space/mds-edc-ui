import React from "react";

import { InfoOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { KeyValuePairInputList } from "@/components/molecules/key-value-pair-input-list";

import { T } from "@/i18n";
import { ASSET_ADVANCED_INFO_GEO_LOCATION, ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS } from "@/jsonld/asset";
import type { AssetFieldProps } from "@/types/asset-field";

export function AssetNutsLocations({ translator, formData, onChange, errors }: AssetFieldProps): React.ReactElement {
  return (<>
    <label
      htmlFor="advanced-info-nuts-locations"
      className="inline-block text-sm text-black font-medium mb-2"
    >
      <T string="assets.new.fieldAdvancedInfoNutsLocation" />
      <Tooltip
        title={translator("assets.new.fieldAdvancedInfoNutsLocationTooltip")}><IconButton aria-label={translator("common.moreInfo")}><InfoOutlined /></IconButton></Tooltip>
    </label>

    <KeyValuePairInputList
      name={ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS}
      id="advanced-info-nuts-locations"
      type="text"
      label={translator("assets.new.fieldAdvancedInfoNutsLocation")}
      addText={translator("assets.new.fieldAdvancedInfoNutsLocationAddText")}
      valueLabel={translator("assets.new.fieldAdvancedInfoNutsLocationValueLabel")}
      valuePlaceholder="DE929"
      error={!!errors[ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS]}
      value={formData[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS] as []}
      valueOnly
      onChange={(value) => onChange({
        ...formData,
        [ASSET_ADVANCED_INFO_GEO_LOCATION]: {
          ...formData[ASSET_ADVANCED_INFO_GEO_LOCATION],
          [ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS]: value
        }
      })}
    />
  </>);
}
