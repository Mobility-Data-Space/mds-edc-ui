import type { FieldShowProps } from "@/types/field-show";
import { LANGUAGES } from "@/constants/languages";
import { DELIMITER } from "@/i18n";
import {
  ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
  ASSET_ADVANCED_INFO_DATA_CATEGORY,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_ID,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_DATA_SUBCATEGORY,
  ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  ASSET_ADVANCED_INFO_GEO_LOCATION,
  ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL,
  ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS,
  ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
  ASSET_ADVANCED_INFO_MOBILITY_THEME,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TRANSPORT_MODE,
  ASSET_CONTENT_TYPE,
  ASSET_ENDPOINT_DOCUMENTATION,
  ASSET_LANGUAGE,
  ASSET_ORGANIZATION,
  ASSET_PUBLISHER,
  ASSET_STANDARD_LICENSE,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/jsonld/asset";
import { CONTEXT_DCAT } from "@/jsonld/context";
import { removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import {
  dataCategoryValueToText,
  dataSubCategoryValueToText,
} from "@/utilities/data-category";
import { toTitleCase } from "@/utilities/utilities";
import { Asset } from "@think-it-labs/edc-connector-client";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { DataAddressTypes } from "@/utilities/data-address";
import { dateToString } from "@/utilities/date";
import { getId, getLiteral } from "@/jsonld/accessors";

const temporalCoverageValue = ([start, end]: [string, string]) => {
  if (!start && !end) {
    return "";
  }

  if (!end) {
    return `Start: ${start}`;
  }

  if (!start) {
    return `End: ${end}`;
  }

  return `${start} - ${end}`;
};

export const assetGeneralFieldsToShow = (
  asset: Asset,
  participantId: string,
  connectorEndpoint: string,
): FieldShowProps[] => {
  const assetLanguage = readValue(asset.properties, ASSET_LANGUAGE);

  const properties = removeJsonLdSchemaFromProperties(asset.properties);
  const additionalProperties = readValue(
    properties,
    "additionalProperties",
  )?.[0];

  const manualApproval = readValue(additionalProperties, "manual_approval");
  const emptyValue = "-";

  const result = [
    {
      label: "assets.new.fieldId",
      value: asset["@id"],
      icon: "category",
    },
    {
      label: "assets.new.fieldVersion",
      value: readValue(asset.properties, ASSET_VERSION) || emptyValue,
      icon: "file_copy",
    },
    {
      label: "assets.new.fieldLanguage",
      value:
        LANGUAGES.find((language) => language.id === assetLanguage)?.label ||
        emptyValue,
      icon: "language",
    },
    {
      label: "assets.new.fieldPublisher",
      value: readValue(asset.properties, ASSET_PUBLISHER) || emptyValue,
      icon: "apartment",
    },
    {
      label: "assets.new.fieldEndpointDocumentation",
      value:
        readValue(asset.properties, ASSET_ENDPOINT_DOCUMENTATION) || emptyValue,
      icon: "bookmarks",
    },
    {
      label: "assets.new.fieldStandardLicense",
      value: readValue(asset.properties, ASSET_STANDARD_LICENSE) || emptyValue,
      icon: "gavel",
    },
    {
      label: "assets.new.participantId",
      value: participantId || emptyValue,
      icon: "category",
    },
    {
      label: "assets.new.creatorOrganizationName",
      value: readValue(asset.properties, ASSET_ORGANIZATION) || emptyValue,
      icon: "account_circle",
      testDataId: "organizationName",
    },
    {
      label: "assets.new.connectorEndpoint",
      value: connectorEndpoint || emptyValue,
      icon: "link",
    },
  ];

  if (manualApproval) {
    result.push({
      label: "assets.new.fieldManualApproval",
      value: manualApproval === "true" ? "Yes" : "No",
      icon: "approval",
    });
  }

  const contentType = readValue(asset.properties, ASSET_CONTENT_TYPE);
  if (contentType) {
    result.push({
      label: "assets.new.fieldContentType",
      value: readValue(asset.properties, ASSET_CONTENT_TYPE),
      icon: "category",
    });
  }

  return result;
};

const assetAdvancedFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const advancedFields = [];
  const assetTitle = readValue(asset.properties, ASSET_TITLE) || "";

  const transportMode = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_TRANSPORT_MODE,
  );
  if (transportMode) {
    advancedFields.push({
      icon: "commute",
      label: "assets.new.fieldAdvancedInfoTransportMode",
      value: toTitleCase(transportMode.replace(/_/g, " ")),
    });
  }

  const mobilityThemeArray = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_MOBILITY_THEME,
  );
  const mobilityTheme = mobilityThemeArray && mobilityThemeArray[0];
  const dataCategory = readValue(
    mobilityTheme,
    ASSET_ADVANCED_INFO_DATA_CATEGORY,
  );
  if (dataCategory) {
    advancedFields.push({
      icon: "commute",
      label: "assets.new.fieldAdvancedInfoDataCategory",
      value: dataCategoryValueToText(dataCategory),
    });
  }
  const dataSubcategory = readValue(
    mobilityTheme,
    ASSET_ADVANCED_INFO_DATA_SUBCATEGORY,
  );
  if (dataSubcategory) {
    advancedFields.push({
      icon: "commute",
      label: "assets.new.fieldAdvancedInfoDataSubcategory",
      value: dataSubCategoryValueToText(dataCategory, dataSubcategory),
    });
  }
  const dataModel = readValue(
    asset.properties?.[ASSET_ADVANCED_INFO_DATA_MODEL]?.[0],
    ASSET_ADVANCED_INFO_DATA_MODEL_ID,
  );
  if (dataModel) {
    advancedFields.push({
      icon: "category",
      label: "assets.new.fieldAdvancedInfoDataModel",
      value: dataModel,
    });
  }
  const geoReferenceMethod = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
  );
  if (geoReferenceMethod) {
    advancedFields.push({
      icon: "commute",
      label: "assets.new.fieldAdvancedInfoGeoReferenceMethod",
      value: geoReferenceMethod,
    });
  }
  const geoLocationNode =
    asset.properties?.[ASSET_ADVANCED_INFO_GEO_LOCATION]?.[0];
  const geoLocation = readValue(
    geoLocationNode,
    ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL,
  );
  if (geoLocation) {
    advancedFields.push({
      icon: "location_on",
      label: "assets.new.fieldAdvancedGeoLocation",
      value: geoLocation,
    });
  }

  const nutsLocations = (
    geoLocationNode?.[ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS] || []
  ).map((nuts: { "@value": string }) => nuts["@value"]);
  if (nutsLocations.length) {
    advancedFields.push({
      icon: "location_on",
      label: "assets.new.fieldAdvancedInfoNutsLocation",
      value: nutsLocations.join(DELIMITER),
    });
  }
  const sovereignLegalName = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
  );
  if (sovereignLegalName) {
    advancedFields.push({
      icon: "account_balance",
      label: "assets.new.fieldAdvancedInfoSovereignLegalName",
      value: sovereignLegalName,
    });
  }
  const dataSampleUrls = (
    asset.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] || []
  ).map((dataSample: { "@value": string }) => dataSample["@value"]);

  if (dataSampleUrls?.length) {
    advancedFields.push({
      icon: "attachment",
      label: "assets.new.fieldAdvancedInfoDataSampleUrl",
      subLabel: assetTitle,
      openModalText: "assets.new.showDataSamples",
      value: dataSampleUrls.join("\n"),
      valueTitle: "assets.new.urls",
    });
  }

  const referenceFileUrls = asset.properties?.[
    ASSET_ADVANCED_INFO_DATA_MODEL
  ]?.[0]?.[ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA]?.[0]?.[
    ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS
  ]?.map((fileUrl: { "@value": string }) => fileUrl["@value"]);

  if (referenceFileUrls?.length) {
    advancedFields.push({
      icon: "receipt",
      label: "assets.new.fieldAdvancedInfoReferenceFileUrls",
      subLabel: assetTitle,
      openModalText: "assets.new.showReferenceFiles",
      value: referenceFileUrls.join("\n"),
      valueTitle: [
        "assets.new.fieldDescription",
        "assets.new.referenceFileImportant",
        "",
        "",
        "assets.new.urls",
      ].join("\n"),
    });
  }
  const conditionsForUse = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
  );
  if (conditionsForUse) {
    advancedFields.push({
      icon: "description",
      label: "assets.new.fieldAdvancedInfoConditionsForUse",
      subLabel: assetTitle,
      openModalText: "assets.new.showConditionsForUse",
      value: conditionsForUse,
    });
  }
  const dataUpdateFrequency = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  );
  if (dataUpdateFrequency) {
    advancedFields.push({
      icon: "timelapse",
      label: "assets.new.fieldAdvancedDataUpdateFrequency",
      value: dataUpdateFrequency,
    });
  }
  const temporalCoverage = readValue(
    asset.properties,
    ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  );

  const startDate = readValue(
    temporalCoverage?.[0],
    `${CONTEXT_DCAT.value}startDate`,
  );
  const endDate = readValue(
    temporalCoverage?.[0],
    `${CONTEXT_DCAT.value}endDate`,
  );

  if (temporalCoverage && startDate && endDate) {
    advancedFields.push({
      icon: "today",
      label: "assets.new.fieldAdvancedInfoTemporalCoverage",
      value: temporalCoverageValue([
        dateToString(new Date(startDate)),
        dateToString(new Date(endDate)),
      ]),
    });
  }

  return advancedFields;
};

export const assetFieldsToShow = (
  asset: Asset,
  participantId: string,
  connectorEndpoint: string,
): FieldShowProps[] => {
  return [
    ...assetGeneralFieldsToShow(asset, participantId, connectorEndpoint),
    ...assetAdvancedFieldsToShow(asset),
  ];
};

export const assetDataAddressFieldsTitle = (asset: Asset) => {
  const dataAddress = removeJsonLdSchemaFromProperties(asset.dataAddress);
  const type = readValue(dataAddress, "type");
  if (type === DataAddressTypes.MDSOnRequestOffer) {
    return "dataOffer.contactInformation";
  }

  return "";
};

export const assetDataAddressFieldsToShow = (
  asset: Asset,
): FieldShowProps[] => {
  const properties = removeJsonLdSchemaFromProperties(asset.properties);
  const additionalProperties = readValue(
    properties,
    "additionalProperties",
  )?.[0];
  const onrequest = readValue(additionalProperties, "onrequest") == "true";

  if (onrequest) {
    return [
      {
        label: "dataOffer.contactEmailAddress",
        value: readValue(additionalProperties, "email"),
        icon: "mail",
        copyTextIcon: true,
      },
      {
        label: "dataOffer.new.dataOfferContactPreferredEmailSubject",
        value: readValue(additionalProperties, "preferred_subject"),
        icon: "subject",
        copyTextIcon: true,
      },
    ];
  }

  return [];
};

export const assetPrivateFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const objectEntries = Object.entries(asset.privateProperties ?? {});
  if (objectEntries.length === 0) {
    return [];
  }

  return objectEntries.map(([key, value]) => ({
    label: key,
    value: getLiteral(value) ?? getId(value) ?? "",
    icon: "category",
  }));
};
