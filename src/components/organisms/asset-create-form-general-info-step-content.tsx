import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {KeywordsInput} from "../atoms/keywords-input.tsx";
import {MuiSelect} from "../atoms/mui-select.tsx";
import {HIGHLIGHTED_LANGUAGE_SELECT_DATA, LANGUAGE_SELECT_DATA} from "@/constants/languages.ts";
import {
  ASSET_CONTENT_TYPE,
  ASSET_DESCRIPTION, ASSET_ENDPOINT_DOCUMENTATION,
  ASSET_ID,
  ASSET_KEYWORDS, ASSET_LANGUAGE, ASSET_PUBLISHER, ASSET_STANDARD_LICENSE,
  ASSET_TITLE,
  ASSET_VERSION
} from "@/schema/asset.ts";
import {FormHelperText, Link} from "@mui/material";

export interface AssetCreateFormGeneralInfoStepProps {
  translator: (key: string) => string;
  formData: any;// TODO define
  onChange: (formData: any) => void;
  errors: { [key: string]: boolean };
}

export function AssetCreateFormGeneralInfoStepContent({ translator, formData, onChange, errors }: AssetCreateFormGeneralInfoStepProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full prose">
        <Input
          required
          name={ASSET_TITLE}
          id="properties-title"
          data-testid="properties-title"
          type="text"
          label={<T string="assets.new.fieldTitle" />}
          placeholder={translator("assets.new.fieldTitlePlaceholder")}
          value={formData[ASSET_TITLE]}
          error={errors[ASSET_TITLE]}
          onChange={(event) => {
            const onChangeData = { ...formData, [ASSET_TITLE]: event.target.value };
            if (formData[ASSET_TITLE] === formData[ASSET_ID]) {
              onChangeData[ASSET_ID] = event.target.value;
            }
            onChange(onChangeData)
          }}
        />
        <Input
          name={ASSET_VERSION}
          id="properties-version"
          type="text"
          label={<T string="assets.new.fieldVersion" />}
          placeholder={"1.0"}
          tooltip={translator("assets.new.fieldVersionTooltip")}
          value={formData[ASSET_VERSION]}
          error={errors[ASSET_VERSION]}
          onChange={(event) => onChange({ ...formData, [ASSET_VERSION]: event.target.value })}
        />
      </div>

      <div>
        <Input
          required
          name={ASSET_ID}
          id="properties-id"
          data-testid="properties-id"
          type="text"
          label={<T string="assets.new.fieldId" />}
          placeholder={translator("assets.new.fieldIdPlaceholder")}
          value={formData[ASSET_ID]}
          error={errors[ASSET_ID]}
          onChange={(event) => onChange({ ...formData, [ASSET_ID]: event.target.value })}
        />
      </div>
      <div>
        <Input
          name={ASSET_DESCRIPTION}
          id="properties-description"
          placeholder={translator("assets.new.fieldDescriptionPlaceholder")}
          multiline
          rows={6}
          label={<T string="assets.new.fieldDescription" />}
          value={formData[ASSET_DESCRIPTION]}
          error={errors[ASSET_DESCRIPTION]}
          onChange={(event) => onChange({ ...formData, [ASSET_DESCRIPTION]: event.target.value })}
        />
        <FormHelperText className="flex flex-row gap-x-1">
          <T string="assets.new.fieldDescriptionSupport"/>
          <Link href="https://www.markdownguide.org/basic-syntax" target="_blank" >
            Markdown syntax
          </Link>
        </FormHelperText>
      </div>

      <div>
        <label
          htmlFor="properties-keywords"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldKeywords"/>
        </label>
        <KeywordsInput
          name={ASSET_KEYWORDS}
          id="properties-keywords"
          type="text"
          tooltip={translator("assets.new.fieldKeywordsTooltip")}
          placeholder={translator("assets.new.fieldKeywordsPlaceholder")}
          value={formData[ASSET_KEYWORDS]}
          error={errors[ASSET_KEYWORDS]}
          onChange={(value) => onChange({ ...formData, [ASSET_KEYWORDS]: value })}
        />
      </div>

      <div>
        <label
          htmlFor="properties-language"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldLanguage"/>
        </label>
        <MuiSelect
          name={ASSET_LANGUAGE}
          id="properties-language"
          key="properties-language"
          options={LANGUAGE_SELECT_DATA}
          highlights={HIGHLIGHTED_LANGUAGE_SELECT_DATA}
          value={formData[ASSET_LANGUAGE]}
          error={errors[ASSET_LANGUAGE]}
          onChange={(event) => onChange({ ...formData, [ASSET_LANGUAGE]: event.target.value })}
        />

      </div>

      <div>
        <Input
          name={ASSET_CONTENT_TYPE}
          id="properties-contenttype"
          label={<T string="assets.new.fieldContentType" />}
          placeholder="text/plain"
          value={formData[ASSET_CONTENT_TYPE]}
          error={errors[ASSET_CONTENT_TYPE]}
          onChange={(event) => onChange({ ...formData, [ASSET_CONTENT_TYPE]: event.target.value })}
        />
        <FormHelperText className="flex flex-row gap-x-1">
          <T string="assets.new.fieldContentTypeSupport"/>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types" target="_blank">
            common types
          </Link>
        </FormHelperText>
      </div>

      <div>
        <Input
          name={ASSET_ENDPOINT_DOCUMENTATION}
          id="properties-endpoint-documentation"
          type="url"
          label={<T string="assets.new.fieldEndpointDocumentation" />}
          placeholder={"https://"}
          tooltip={translator("assets.new.fieldEndpointDocumentationTooltip")}
          value={formData[ASSET_ENDPOINT_DOCUMENTATION]}
          error={errors[ASSET_ENDPOINT_DOCUMENTATION]}
          onChange={(event) => onChange({ ...formData, [ASSET_ENDPOINT_DOCUMENTATION]: event.target.value })}
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
        <Input
          name={ASSET_PUBLISHER}
          id="properties-publisher"
          type="text"
          label={<T string="assets.new.fieldPublisher" />}
          placeholder={"https://"}
          tooltip={translator("assets.new.fieldPublisherTooltip")}
          value={formData[ASSET_PUBLISHER]}
          error={errors[ASSET_PUBLISHER]}
          onChange={(event) => onChange({ ...formData, [ASSET_PUBLISHER]: event.target.value })}
        />

        <Input
          name={ASSET_STANDARD_LICENSE}
          id="properties-standard-license"
          type="text"
          label={<T string="assets.new.fieldStandardLicense" />}
          placeholder={"https://"}
          tooltip={translator("assets.new.fieldStandardLicenseTooltip")}
          value={formData[ASSET_STANDARD_LICENSE]}
          error={errors[ASSET_STANDARD_LICENSE]}
          onChange={(event) => onChange({ ...formData, [ASSET_STANDARD_LICENSE]: event.target.value })}
        />
      </div>

    </div>
  );
}
