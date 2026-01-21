import React from "react";

import DateRangePicker from "@/components/molecules/date-range-picker";

import { T } from "@/i18n";
import {
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START,
} from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";
import { DATE_FORMAT, isoToDateString } from "@/utilities/date.ts";

export interface AssetTemporalCoverageProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetTemporalCoverage({
  formData,
  onChange,
  errors,
}: AssetTemporalCoverageProps): React.ReactElement {
  const startDate = formData[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE][
    ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START
  ] as string;
  const endDate = formData[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE][
    ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END
  ] as string;

  // Dates from Backend are ISO
  // Dates from users are in DD/MM/YYYY
  const displayStartDate = startDate?.includes("T")
    ? isoToDateString(startDate)
    : startDate;
  const displayEndDate = endDate?.includes("T")
    ? isoToDateString(endDate)
    : endDate;

  return (
    <DateRangePicker
      name={ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE}
      id="advanced-info-temporal-coverage"
      label={<T string="assets.new.fieldAdvancedInfoTemporalCoverage" />}
      helperText={`Start and/or end date when the dataset is available for consumption. ${DATE_FORMAT} (optional) – ${DATE_FORMAT} (optional)`}
      onChange={(value) =>
        onChange({
          ...formData,
          [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: {
            [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START]: value[0],
            [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END]: value[1],
          },
        })
      }
      error={errors[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]}
      value={[displayStartDate || "", displayEndDate || ""]}
    />
  );
}
