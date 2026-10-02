import React from "react";

import { FormHelperText, Link } from "@mui/material";

import { Input } from "@/components/atoms/input";

import { AssetProperties } from "@/domain/asset/model";
import { T } from "@/i18n";
import {
  ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_ID,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  ASSET_ADVANCED_INFO_GEO_LOCATION,
  ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL,
  ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION,
  ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
  ASSET_CONTENT_TYPE,
  ASSET_DESCRIPTION,
  ASSET_ENDPOINT_DOCUMENTATION,
  ASSET_PUBLISHER,
  ASSET_STANDARD_LICENSE,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/jsonld/asset";
import type { AssetFieldProps } from "@/types/asset-field";

const MARKDOWN_GUIDE = { href: "https://www.markdownguide.org/basic-syntax", text: "Markdown syntax" };

interface AssetTextFieldConfig {
  id: string;
  // Form-data key; also the input name and the key its validation error is stored under.
  name: string;
  labelKey: string;
  placeholder?: string;
  placeholderKey?: string;
  tooltipKey?: string;
  type?: string;
  required?: boolean;
  testId?: string;
  multiline?: boolean;
  support?: { textKey: string; href: string; text: string };
  // Nested fields live inside an object property; top-level fields read and write `name` directly.
  get?: (formData: AssetProperties) => string;
  set?: (formData: AssetProperties, value: string) => AssetProperties;
}

export const ASSET_TEXT_FIELDS = {
  title: {
    id: "properties-title",
    name: ASSET_TITLE,
    labelKey: "assets.new.fieldTitle",
    placeholderKey: "assets.new.fieldTitlePlaceholder",
    type: "text",
    required: true,
    testId: "properties-title",
  },
  version: {
    id: "properties-version",
    name: ASSET_VERSION,
    labelKey: "assets.new.fieldVersion",
    placeholder: "1.0",
    tooltipKey: "assets.new.fieldVersionTooltip",
    type: "text",
  },
  description: {
    id: "properties-description",
    name: ASSET_DESCRIPTION,
    labelKey: "assets.new.fieldDescription",
    placeholderKey: "assets.new.fieldDescriptionPlaceholder",
    multiline: true,
    support: { textKey: "assets.new.fieldDescriptionSupport", ...MARKDOWN_GUIDE },
  },
  contentType: {
    id: "properties-contenttype",
    name: ASSET_CONTENT_TYPE,
    labelKey: "assets.new.fieldContentType",
    placeholder: "text/plain",
    support: {
      textKey: "assets.new.fieldContentTypeSupport",
      href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types",
      text: "common types",
    },
  },
  endpointDocumentation: {
    id: "properties-endpoint-documentation",
    name: ASSET_ENDPOINT_DOCUMENTATION,
    labelKey: "assets.new.fieldEndpointDocumentation",
    placeholder: "https://",
    tooltipKey: "assets.new.fieldEndpointDocumentationTooltip",
    type: "url",
  },
  publisher: {
    id: "properties-publisher",
    name: ASSET_PUBLISHER,
    labelKey: "assets.new.fieldPublisher",
    placeholder: "https://",
    tooltipKey: "assets.new.fieldPublisherTooltip",
    type: "text",
  },
  standardLicense: {
    id: "properties-standard-license",
    name: ASSET_STANDARD_LICENSE,
    labelKey: "assets.new.fieldStandardLicense",
    placeholder: "https://",
    tooltipKey: "assets.new.fieldStandardLicenseTooltip",
    type: "text",
  },
  sovereignLegalName: {
    id: "advanced-sovereign-legal-name",
    name: ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
    labelKey: "assets.new.fieldAdvancedInfoSovereignLegalName",
    placeholderKey: "assets.new.fieldAdvancedInfoSovereignLegalNamePlaceholder",
    tooltipKey: "assets.new.fieldAdvancedInfoSovereignLegalNameTooltip",
    type: "text",
  },
  dataUpdateFrequency: {
    id: "advanced-data-update-frequency",
    name: ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
    labelKey: "assets.new.fieldAdvancedDataUpdateFrequency",
    placeholderKey: "assets.new.fieldAdvancedDataUpdateFrequencyPlaceholder",
    tooltipKey: "assets.new.fieldAdvancedDataUpdateFrequencyTooltip",
    type: "text",
  },
  geoReferenceMethod: {
    id: "advanced-info-geo-reference-method",
    name: ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
    labelKey: "assets.new.fieldAdvancedInfoGeoReferenceMethod",
    placeholderKey: "assets.new.fieldAdvancedInfoGeoReferenceMethodPlaceholder",
    tooltipKey: "assets.new.fieldAdvancedInfoGeoReferenceMethodTooltip",
    type: "text",
  },
  conditionsForUse: {
    id: "advanced-info-conditions-for-use",
    name: ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
    labelKey: "assets.new.fieldAdvancedInfoConditionsForUse",
    placeholderKey: "assets.new.fieldAdvancedInfoConditionsForUsePlaceholder",
    multiline: true,
    support: { textKey: "assets.new.fieldAdvancedInfoConditionsForUseSupport", ...MARKDOWN_GUIDE },
  },
  geoLocation: {
    id: "advanced-geo-location",
    name: ASSET_ADVANCED_INFO_GEO_LOCATION,
    labelKey: "assets.new.fieldAdvancedGeoLocation",
    placeholder: "40.741895,-73.989308",
    tooltipKey: "assets.new.fieldAdvancedGeoLocationTooltip",
    type: "text",
    get: (formData) => formData[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL],
    set: (formData, value) => ({
      ...formData,
      [ASSET_ADVANCED_INFO_GEO_LOCATION]: {
        ...formData[ASSET_ADVANCED_INFO_GEO_LOCATION],
        [ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL]: value,
      },
    }),
  },
  dataModel: {
    id: "advanced-data-model",
    name: ASSET_ADVANCED_INFO_DATA_MODEL,
    labelKey: "assets.new.fieldAdvancedInfoDataModel",
    placeholderKey: "assets.new.fieldAdvancedInfoDataModelPlaceholder",
    tooltipKey: "assets.new.fieldAdvancedInfoDataModelTooltip",
    type: "text",
    get: (formData) => formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_ID],
    set: (formData, value) => ({
      ...formData,
      [ASSET_ADVANCED_INFO_DATA_MODEL]: {
        ...formData[ASSET_ADVANCED_INFO_DATA_MODEL],
        [ASSET_ADVANCED_INFO_DATA_MODEL_ID]: value,
      },
    }),
  },
  referenceFileDescription: {
    id: "advanced-info-description",
    name: ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION,
    labelKey: "assets.new.fieldAdvancedInfoReferenceFileDescription",
    placeholder: "...",
    multiline: true,
    support: { textKey: "assets.new.fieldAdvancedInfoReferenceFileDescriptionSupport", ...MARKDOWN_GUIDE },
    get: (formData) =>
      formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][
        ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION
      ],
    set: (formData, value) => ({
      ...formData,
      [ASSET_ADVANCED_INFO_DATA_MODEL]: {
        ...formData[ASSET_ADVANCED_INFO_DATA_MODEL],
        [ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA]: {
          ...formData[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA],
          [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: value,
        },
      },
    }),
  },
} satisfies Record<string, AssetTextFieldConfig>;

export type AssetTextFieldName = keyof typeof ASSET_TEXT_FIELDS;

interface AssetTextFieldProps extends AssetFieldProps {
  field: AssetTextFieldName;
  hideLabel?: boolean;
}

export function AssetTextField({ field, translator, formData, onChange, errors, hideLabel = false }: AssetTextFieldProps): React.ReactElement {
  const config: AssetTextFieldConfig = ASSET_TEXT_FIELDS[field];
  const value = config.get ? config.get(formData) : formData[config.name];

  const input = (
    <Input
      required={config.required}
      name={config.name}
      id={config.id}
      data-testid={config.testId}
      type={config.type}
      label={hideLabel ? "" : <T string={config.labelKey} />}
      placeholder={config.placeholderKey ? translator(config.placeholderKey) : config.placeholder}
      tooltip={config.tooltipKey ? translator(config.tooltipKey) : undefined}
      multiline={config.multiline}
      rows={config.multiline ? 6 : undefined}
      value={value}
      error={errors[config.name]}
      onChange={(event) =>
        onChange(config.set ? config.set(formData, event.target.value) : { ...formData, [config.name]: event.target.value })
      }
    />
  );

  if (!config.support) {
    return input;
  }

  return (
    <>
      {input}
      <FormHelperText className="flex flex-row gap-x-1">
        <T string={config.support.textKey} />
        <Link href={config.support.href} target="_blank" color="secondary">
          {config.support.text}
        </Link>
      </FormHelperText>
    </>
  );
}
