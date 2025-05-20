import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION,
} from "@/schema/asset.ts";
import {FormHelperText, Link} from "@mui/material";
import {AssetTransportMode} from "@/components/molecules/asset-transport-mode.tsx";
import {AssetDataModel} from "@/components/molecules/asset-data-model.tsx";
import {AssetDataSamples} from "@/components/molecules/asset-data-samples.tsx";
import {AssetReferenceFileUrls} from "@/components/molecules/asset-reference-file-urls.tsx";
import {AssetDataUpdateFrequency} from "@/components/molecules/asset-data-update-frequency.tsx";
import {AssetGeoReferenceMethod} from "@/components/molecules/asset-geo-reference-method.tsx";
import {AssetGeoLocations} from "@/components/molecules/asset-geo-locations.tsx";
import {AssetNutsLocations} from "@/components/molecules/asset-nuts-locations.tsx";
import {AssetSovereignLegalName} from "@/components/molecules/asset-sovereign-legal-name.tsx";
import {AssetConditionsForUse} from "@/components/molecules/asset-conditions-for-use.tsx";
import {AssetDataCategoryAndSubcategory} from "@/components/molecules/asset-data-category-and-subcategory.tsx";
import {AssetTemporalCoverage} from "@/components/molecules/asset-temporal-coverage.tsx";
import {AssetProperties} from "@/utilities/asset.ts";

export interface AssetCreateFormAdvancedInfoStepProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: any) => void;
  errors: { [key: string]: boolean };
}

export function AssetCreateFormAdvancedInfoStepContent({ translator, formData, onChange, errors }: AssetCreateFormAdvancedInfoStepProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <AssetDataCategoryAndSubcategory
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <AssetDataModel
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div className="grid sm:grid-cols-16 gap-2 w-full">
        <div className="sm:col-span-9">
          <label
            htmlFor="advanced-info-geo-reference-method"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldAdvancedInfoTransportMode"/>
          </label>
          <AssetTransportMode
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="sm:col-span-7 content-end">
          <AssetGeoReferenceMethod
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      </div>

      <div>
        <AssetSovereignLegalName
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <AssetDataUpdateFrequency
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <AssetGeoLocations
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <AssetNutsLocations
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <AssetDataSamples
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <AssetReferenceFileUrls
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <Input
          name={ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION}
          id="advanced-info-description"
          label={<T string="assets.new.fieldAdvancedInfoReferenceFileDescription"/>}
          placeholder={"..."}
          multiline
          rows={6}
          value={formData[ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]}
          error={errors[ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]}
          onChange={(event) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: event.target.value
          })}
        />
        <FormHelperText className="flex flex-row gap-x-1">
          <T string="assets.new.fieldAdvancedInfoReferenceFileDescriptionSupport"/>
          <Link href="https://www.markdownguide.org/basic-syntax" target="_blank" color="secondary" >
            Markdown syntax
          </Link>
        </FormHelperText>
      </div>

      <div>
        <AssetTemporalCoverage
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div>
        <AssetConditionsForUse
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>
    </div>
  );
}
