import React from "react";
import {T} from "@/i18n";
import {
  CreateAssetPropertiesFormData
} from "@/schema/asset.ts";
import {AssetId} from "@/components/molecules/asset-id.tsx";
import {AssetVersion} from "@/components/molecules/asset-version.tsx";
import {AssetTitle} from "@/components/molecules/asset-title.tsx";
import {AssetDescription} from "@/components/molecules/asset-description.tsx";
import {AssetKeywords} from "@/components/molecules/asset-keywords.tsx";
import {AssetLanguage} from "@/components/molecules/asset-language.tsx";
import {AssetEndpointDocumentation} from "@/components/molecules/asset-endpoint-documentation.tsx";
import {AssetContentType} from "@/components/molecules/asset-content-type.tsx";
import {AssetPublisher} from "@/components/molecules/asset-publisher.tsx";
import {AssetStandardLicense} from "@/components/molecules/asset-standard-license.tsx";

export interface AssetCreateFormGeneralInfoStepProps {
  translator: (key: string) => string;
  formData: CreateAssetPropertiesFormData;
  onChange: (formData: CreateAssetPropertiesFormData) => void;
  errors: { [key: string]: boolean };
}

export function AssetCreateFormGeneralInfoStepContent({ translator, formData, onChange, errors }: AssetCreateFormGeneralInfoStepProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full prose">
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
          <T string="assets.new.fieldKeywords"/>
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
          <T string="assets.new.fieldLanguage"/>
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
          <T string="fieldPublisher"/>
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
