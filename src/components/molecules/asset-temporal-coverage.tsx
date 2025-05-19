import React from "react";
import {T} from "@/i18n";
import {ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE, CreateAssetAdvancedInfoFormData} from "@/schema/asset.ts";
import DateRangePicker from "@/components/molecules/date-range-picker.tsx";

export interface AssetTemporalCoverageProps {
  translator: (key: string) => string;
  formData: CreateAssetAdvancedInfoFormData;
  onChange: (formData: CreateAssetAdvancedInfoFormData) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetTemporalCoverage({ translator, formData, onChange, errors }: AssetTemporalCoverageProps): JSX.Element {

  return (
    <DateRangePicker
      name={ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE}
      id="advanced-info-temporal-coverage"
      label={<T string="assets.new.fieldAdvancedInfoTemporalCoverage"/>}
      helperText={translator('assets.new.fieldAdvancedInfoTemporalCoverageHelper')}
      onChange={(value) => onChange({
        ...formData,
        [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: value
      })}
      error={errors[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]}
      value={formData[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE] as [string, string]}
    />
  );
}
