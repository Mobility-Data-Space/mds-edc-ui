import {removeEmptyFields} from "@/utilities/form.ts";
import {Asset, AssetInput, DataAddress} from "@think-it-labs/edc-connector-client";
import {FieldShowProps} from "@/components/molecules/field-show.tsx";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {ENGLISH_SELECT_DATA, LANGUAGES} from "@/constants/languages";
import {DELIMITER} from "@/i18n";
import {extractArrayValues} from "@/utilities/utilities";
import {ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE, ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_MODEL_ID, ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA, ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY, ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY, ASSET_ADVANCED_INFO_GEO_LOCATION, ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL, ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS, ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD, ASSET_ADVANCED_INFO_MOBILITY_THEME, ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION, ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START, ASSET_ADVANCED_INFO_TRANSPORT_MODE, ASSET_CONTENT_TYPE, ASSET_DESCRIPTION, ASSET_ENDPOINT_DOCUMENTATION, ASSET_KEYWORDS, ASSET_LANGUAGE, ASSET_ORGANIZATION, ASSET_PUBLISHER, ASSET_STANDARD_LICENSE, ASSET_TITLE, ASSET_VERSION} from "@/schema/asset";
import { defaultHttpDataAddress } from "./data-address.ts";

const temporalCoverageValue = ([start, end]: [string, string]) => {
  console.log(start, end)
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
}

export const fromAssetForm = (formData: AssetInput) => {
  console.log("Pre Clean")
  console.log(formData)

  formData["@id"] = formData.properties["@id"];
  formData.properties["@id"] = "" ;

  const cleanFormDataObject = removeEmptyFields(formData);
  console.log("Post Clean")
  console.log(cleanFormDataObject)

  return {
    "@type": "https://w3id.org/edc/v0.0.1/ns/Asset",
    "@id": cleanFormDataObject["@id"],
    properties: cleanFormDataObject.properties,
    privateProperties: cleanFormDataObject.privateProperties,
    dataAddress: cleanFormDataObject.dataAddress
  };
};

export const defaultCreateAssetFormData: AssetInput = {
  "@id": "",
  properties: {
    "@id": "",
    [ASSET_TITLE]: "",
    [ASSET_VERSION]: "",
    [ASSET_DESCRIPTION]: "",
    [ASSET_KEYWORDS]: [] as string[],
    [ASSET_LANGUAGE]: ENGLISH_SELECT_DATA.value,
    [ASSET_CONTENT_TYPE]: "",
    [ASSET_ENDPOINT_DOCUMENTATION]: "",
    [ASSET_PUBLISHER]: "",
    [ASSET_STANDARD_LICENSE]: "",

    [ASSET_ADVANCED_INFO_MOBILITY_THEME]: {
      [ASSET_ADVANCED_INFO_DATA_CATEGORY]: "",
      [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: ""
    },


    [ASSET_ADVANCED_INFO_TRANSPORT_MODE]: "",
    [ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]: "",

    [ASSET_ADVANCED_INFO_DATA_MODEL]: {
      [ASSET_ADVANCED_INFO_DATA_MODEL_ID]: "",
      [ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA]: {
        [ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]: [],
        [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: ""
      }
    },
    [ASSET_ORGANIZATION]: "",
    [ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]: "",
    [ASSET_ADVANCED_INFO_GEO_LOCATION]: {
      [ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL]: "",
      [ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS]: [] as any[],
    },

    [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: [] as any,

    [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: {
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START]: "",
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END]: ""
    },

    [ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]: "",
  },
  privateProperties: {},
  dataAddress: defaultHttpDataAddress,
};

export type AssetProperties = typeof defaultCreateAssetFormData.properties;

export const assetGeneralFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): FieldShowProps[] => {
  const assetLanguage = readValue(asset.properties, ASSET_LANGUAGE);

  return [
    {
      label: "assets.new.fieldId",
      value: asset["@id"],
      icon: "category"
    },
    {
      label: "assets.new.fieldVersion",
      value: readValue(asset.properties, ASSET_VERSION),
      icon: "file_copy"
    },
    {
      label: "assets.new.fieldLanguage",
      value: LANGUAGES.find((language) => language.id === assetLanguage)?.label,
      icon: "language"
    },
    {
      label: "assets.new.fieldPublisher",
      value: readValue(asset.properties, ASSET_PUBLISHER),
      icon: "apartment"
    },
    {
      label: "assets.new.fieldEndpointDocumentation",
      value: readValue(asset.properties, ASSET_ENDPOINT_DOCUMENTATION),
      icon: "bookmarks"
    },
    {
      label: "assets.new.fieldStandardLicense",
      value: readValue(asset.properties, ASSET_STANDARD_LICENSE),
      icon: "gavel"
    },
    {
      label: "assets.new.participantId",
      value: participantId,
      icon: "category"
    },
    {
      label: "assets.new.creatorOrganizationName",
      value: readValue(asset.properties, ASSET_ORGANIZATION),
      icon: "account_circle"
    },
    {
      label: "assets.new.connectorEndpoint",
      value: connectorEndpoint,
      icon: "link"
    },
  ];
};

const assetAdvancedFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const advancedFields = [];
  const assetTitle = readValue(asset.properties, ASSET_TITLE) || "";

  const transportMode = readValue(asset.properties, ASSET_ADVANCED_INFO_TRANSPORT_MODE);
  if (transportMode) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoTransportMode',
      value: transportMode,
    });
  }
  const dataCategory = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_CATEGORY)
  if (dataCategory) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoDataCategory',
      value: dataCategory,
    });
  }
  const dataSubcategory = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY)
  if (dataSubcategory) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoDataSubcategory',
      value: dataSubcategory,
    });
  }
  const dataModel = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_MODEL_ID)
  if (dataModel) {
    advancedFields.push({
      icon: 'category',
      label: 'assets.new.fieldAdvancedInfoDataModel',
      value: dataModel,
    });
  }
  const geoReferenceMethod = readValue(asset.properties, ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD)
  if (geoReferenceMethod) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoGeoReferenceMethod',
      value: geoReferenceMethod,
    });
  }
  const geoLocation = readValue(asset.properties, ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL)
  if (geoLocation) {
    advancedFields.push({
      icon: 'location_on',
      label: 'assets.new.fieldAdvancedGeoLocation',
      value: geoLocation,
    });
  }

  const nutsLocations = readValue(asset.properties, ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS)
  if (nutsLocations?.length) {
    advancedFields.push({
      icon: 'location_on',
      label: 'assets.new.fieldAdvancedInfoNutsLocation',
      value: extractArrayValues(nutsLocations).join(DELIMITER),
    });
  }
  const sovereignLegalName = readValue(asset.properties, ASSET_ORGANIZATION)
  if (sovereignLegalName) {
    advancedFields.push({
      icon: 'account_balance',
      label: 'assets.new.fieldAdvancedInfoSovereignLegalName',
      value: sovereignLegalName,
    });
  }
  const dataSampleUrls = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS)
  if (dataSampleUrls?.length) {
    advancedFields.push({
      icon: 'attachment',
      label: 'assets.new.fieldAdvancedInfoDataSampleUrl',
      subLabel: assetTitle,
      openModalText: 'assets.new.showDataSamples',
      value: extractArrayValues(dataSampleUrls).join("\n"),
      valueTitle: 'assets.new.urls',
    });
  }
  const referenceFileUrls = readValue(asset.properties, ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS);
  if (referenceFileUrls?.length) {
    advancedFields.push({
      icon: 'receipt',
      label: 'assets.new.fieldAdvancedInfoReferenceFileUrls',
      subLabel: assetTitle,
      openModalText: 'assets.new.showReferenceFiles',
      value: extractArrayValues(referenceFileUrls).join("\n"),
      valueTitle: ['assets.new.fieldDescription', 'assets.new.referenceFileImportant', '', '', 'assets.new.urls'].join("\n"),
    });
  }
  const conditionsForUse = readValue(asset.properties, ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE);
  if (conditionsForUse) {
    advancedFields.push({
      icon: 'description',
      label: 'assets.new.fieldAdvancedInfoConditionsForUse',
      subLabel: assetTitle,
      openModalText: 'assets.new.showConditionsForUse',
      value: conditionsForUse,
    });
  }
  const dataUpdateFrequency = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY);
  if (dataUpdateFrequency) {
    advancedFields.push({
      icon: 'timelapse',
      label: 'assets.new.fieldAdvancedDataUpdateFrequency',
      value: dataUpdateFrequency,
    });
  }
  const temporalCoverage = readValue(asset.properties, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE);
  if (temporalCoverage) {
    console.log(typeof temporalCoverage)
    advancedFields.push({
      icon: 'today',
      label: 'assets.new.fieldAdvancedInfoTemporalCoverage',
      value: temporalCoverageValue([temporalCoverage, temporalCoverage]),
    });
  }

  return advancedFields;
};

const assetDataAddressFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const dataAddressFieldsToMerge = [
    {
      label: "assets.new.httpProxyMethod",
      value: readValue(asset.dataAddress, "proxyMethod"),
    },
    {
      label: "assets.new.httpProxyPath",
      value: readValue(asset.dataAddress, "proxyPath"),
    },
    {
      label: "assets.new.fieldDataAddressQueryParams",
      value: readValue(asset.dataAddress, "proxyQueryParams"),
    }
  ];

  const dataSourceText = !dataAddressFieldsToMerge.some((field) => field.value) ? 'Disabled' :
    dataAddressFieldsToMerge
    .filter((field) => field.value)
    .map((field) => field.label)
    .join(DELIMITER);

  const dataSourceFields = [
    {
      label: "assets.new.httpDataSourceParameterization",
      value: dataSourceText,
      icon: 'api',
    },
  ];

  const contentType = readValue(asset.properties, ASSET_CONTENT_TYPE);
  if (contentType) {
    dataSourceFields.push({
      label: "assets.new.fieldContentType",
      value: contentType,
      icon: 'category',
    });
  }

  return dataSourceFields;
};

export const assetFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): FieldShowProps[] => {
  return [
    ...assetGeneralFieldsToShow(asset, participantId, connectorEndpoint),
    ...assetDataAddressFieldsToShow(asset),
    ...assetAdvancedFieldsToShow(asset),
  ]
};

export const assetPrivateFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const objectEntries = Object.entries(asset.privateProperties);
  if (objectEntries.length === 0) {
    return [];
  }

  return objectEntries.map(([key, value]) => ({
    label: key,
    value: value[0]["@value"],
    icon: "category"
  }));
};

export const generateId = (title?: string, version?: string) => {
  const transformedVersion = transformForId(version);
  return transformForId(title) + (transformedVersion ? `-${transformedVersion}` : "")
};

export const transformForId = (str?: string) => {
  return (str ?? '')
    .trim()
    .replace(':', '-')
    .replaceAll(' ', '-')
    .toLowerCase();
};
