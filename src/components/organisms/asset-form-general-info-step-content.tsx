import React from "react";

import { AssetId } from "@/components/molecules/asset-id";
import { AssetKeywords } from "@/components/molecules/asset-keywords";
import { AssetLanguage } from "@/components/molecules/asset-language";
import { AssetTextField } from "@/components/molecules/asset-text-field";

import { T } from "@/i18n";
import type { AssetFieldProps } from "@/types/asset-field";

export function AssetFormGeneralInfoStepContent({ translator, formData, onChange, errors }: AssetFieldProps): React.ReactElement {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full">
        <AssetTextField
          field="title"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
        <AssetTextField
          field="version"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

      <div>
        <AssetId
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>
      <div>
        <AssetTextField
          field="description"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

      <div>
        <label
          htmlFor="properties-keywords"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldKeywords" />
        </label>
        <AssetKeywords
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

      <div>
        <label
          htmlFor="properties-language"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldLanguage" />
        </label>
        <AssetLanguage
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </div>

      <div>
        <AssetTextField
          field="contentType"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

      <div>
        <AssetTextField
          field="endpointDocumentation"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

      <div className="sm:col-span-3">
        <label
          htmlFor="properties-publisher"
          className="inline-block text-sm text-gray-800 mt-2.5"
        >
          <T string="assets.new.fieldPublisher" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <AssetTextField
          field="publisher"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />

        <AssetTextField
          field="standardLicense"
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

    </div>
  );
}
