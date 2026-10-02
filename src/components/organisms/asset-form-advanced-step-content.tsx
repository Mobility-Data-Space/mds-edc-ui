import React from "react";

import { AssetDataCategoryAndSubcategory } from "@/components/molecules/asset-data-category-and-subcategory";
import { AssetDataSamples } from "@/components/molecules/asset-data-samples";
import { AssetNutsLocations } from "@/components/molecules/asset-nuts-locations";
import { AssetReferenceFileUrls } from "@/components/molecules/asset-reference-file-urls";
import { AssetTemporalCoverage } from "@/components/molecules/asset-temporal-coverage";
import { AssetTextField } from "@/components/molecules/asset-text-field";
import { AssetTransportMode } from "@/components/molecules/asset-transport-mode";

import { T } from "@/i18n";
import type { AssetFieldProps } from "@/types/asset-field";

export function AssetFormAdvancedInfoStepContent({ translator, formData, onChange, errors }: AssetFieldProps): React.ReactElement {

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
        <AssetTextField
          field="dataModel"
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
            <T string="assets.new.fieldAdvancedInfoTransportMode" />
          </label>
          <AssetTransportMode
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="sm:col-span-7 content-end">
          <AssetTextField
            field="geoReferenceMethod"
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      </div>

      <div>
        <AssetTextField
          field="sovereignLegalName"
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <AssetTextField
          field="dataUpdateFrequency"
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <AssetTextField
          field="geoLocation"
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
        <AssetTextField
          field="referenceFileDescription"
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
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
        <AssetTextField
          field="conditionsForUse"
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      </div>
    </div>
  );
}
