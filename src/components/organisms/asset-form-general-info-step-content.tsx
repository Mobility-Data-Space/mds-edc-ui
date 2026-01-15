import React from "react";

import { AssetContentType } from "@/components/molecules/asset-content-type";
import { AssetDescription } from "@/components/molecules/asset-description";
import { AssetEndpointDocumentation } from "@/components/molecules/asset-endpoint-documentation";
import { AssetId } from "@/components/molecules/asset-id";
import { AssetKeywords } from "@/components/molecules/asset-keywords";
import { AssetLanguage } from "@/components/molecules/asset-language";
import { AssetPublisher } from "@/components/molecules/asset-publisher";
import { AssetStandardLicense } from "@/components/molecules/asset-standard-license";
import { AssetTitle } from "@/components/molecules/asset-title";
import { AssetVersion } from "@/components/molecules/asset-version";

import { T } from "@/i18n";
import { AssetProperties } from "@/utilities/asset";

export interface AssetFormGeneralInfoStepProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
}

export function AssetFormGeneralInfoStepContent({ translator, formData, onChange, errors }: AssetFormGeneralInfoStepProps): React.ReactElement {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full">
        <AssetTitle
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
        <AssetVersion
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
        <AssetDescription
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
        <AssetContentType
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </div>

      <div>
        <AssetEndpointDocumentation
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
          <T string="fieldPublisher" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <AssetPublisher
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />

        <AssetStandardLicense
          formData={formData}
          errors={errors}
          onChange={onChange}
          translator={translator}
        />
      </div>

    </div>
  );
}
