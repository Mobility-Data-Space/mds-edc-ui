import {
  DATA_ADDRESS_TYPE_HTTP,
  DATA_OFFER_TYPE_DATA_SOURCE,
  DATA_OFFER_TYPE_ON_REQUEST
} from "@/constants/data-address-types.ts";
import {ENGLISH_SELECT_DATA, LANGUAGES} from "@/constants/languages.ts";
import {removeEmptyFields} from "@/utilities/form.ts";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {Asset} from "@think-it-labs/edc-connector-client";
import {DELIMITER} from "@/i18n";
import {extractArrayValues} from "@/utilities/utilities.ts";
import {AssetFieldProps} from "@/components/molecules/asset-field-show.tsx";

export const ASSET_PROPERTIES = "https://w3id.org/edc/v0.0.1/ns/properties";
export const ASSET_PRIVATE_PROPERTIES = "https://w3id.org/edc/v0.0.1/ns/privateProperties";
export const ASSET_TITLE = "http://purl.org/dc/terms/title";
export const ASSET_VERSION = "http://www.w3.org/ns/dcat#version";
export const ASSET_ID = "@id";
export const ASSET_DESCRIPTION = "http://www.w3.org/ns/dcat#description";
export const ASSET_KEYWORDS = "http://www.w3.org/ns/dcat#keyword";
export const ASSET_LANGUAGE = "http://www.w3.org/ns/dcat#language";
export const ASSET_CONTENT_TYPE = "['http://www.w3.org/ns/dcat#distribution'].['http://www.w3.org/ns/dcat#mediaType']";
export const ASSET_ENDPOINT_DOCUMENTATION = "http://www.w3.org/ns/dcat#endpointDocumentation";
export const ASSET_PUBLISHER = "http://www.w3.org/ns/dcat#publisher";
export const ASSET_STANDARD_LICENSE = "http://www.w3.org/ns/dcat#license";
export const DATA_OFFER_TYPE = "http://www.w3.org/ns/dcat#dataSourceAvailability";
export const DATA_OFFER_CONTACT_EMAIL = "http://www.w3.org/ns/dcat#contactEmail";
export const DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT = "http://www.w3.org/ns/dcat#contactPreferredEmailSubject";
export const DATA_OFFER_PUBLISH_MODE = "http://www.w3.org/ns/dcat#publishMode";
export const DATA_OFFER_CONSTRAINTS = "http://www.w3.org/ns/dcat#constraints";

export const ASSET_ADVANCED_INFO_DATA_CATEGORY = "http://www.w3.org/ns/dcat#dataCategory";
export const ASSET_ADVANCED_INFO_DATA_SUBCATEGORY = "http://www.w3.org/ns/dcat#dataSubcategory";
export const ASSET_ADVANCED_INFO_TRANSPORT_MODE = "http://www.w3.org/ns/dcat#transportMode";
export const ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD = "http://www.w3.org/ns/dcat#geoReferenceMethod";
export const ASSET_ADVANCED_INFO_DATA_MODEL = "http://www.w3.org/ns/dcat#dataModel";
export const ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME = "http://www.w3.org/ns/dcat#sovereignLegalName";
export const ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY = "http://www.w3.org/ns/dcat#dataUpdateFrequency";
export const ASSET_ADVANCED_INFO_GEO_LOCATION = "http://www.w3.org/ns/dcat#geoLocation";
export const ASSET_ADVANCED_INFO_NUTS_LOCATIONS = "http://www.w3.org/ns/dcat#nutsLocations";
export const ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS = "http://www.w3.org/ns/dcat#dataSampleUrls";
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS = "http://www.w3.org/ns/dcat#referenceFileUrls";
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION = "http://www.w3.org/ns/dcat#referenceFilesDescription";
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE = "http://www.w3.org/ns/dcat#temporalCoverage";
export const ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE = "http://www.w3.org/ns/dcat#conditionsForUse";

export const ASSET_DATA_ADDRESS_TYPE = "https://w3id.org/edc/v0.0.1/ns/type";
export const ASSET_DATA_ADDRESS_DESCRIPTION = "http://www.w3.org/ns/dcat#description";
export const ASSET_DATA_ADDRESS_METHOD = "method";
export const ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD = "http://www.w3.org/ns/dcat#httpProxyMethod";
export const ASSET_DATA_ADDRESS_BASE_URL = "http://www.w3.org/ns/dcat#baseUrl";
export const ASSET_DATA_ADDRESS_HTTP_PROXY_PATH = "httpProxyPath";
export const ASSET_DATA_ADDRESS_QUERY_PARAMS = "http://www.w3.org/ns/dcat#queryParams";
export const ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION = "http://www.w3.org/ns/dcat#enableQueryParameterization";
export const ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION = "http://www.w3.org/ns/dcat#enableBodyParameterization";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER = "http://www.w3.org/ns/dcat#httpAuthAddHeader";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE = "http://www.w3.org/ns/dcat#httpAuthHeaderType";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME = "http://www.w3.org/ns/dcat#httpAuthHeaderName";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE = "http://www.w3.org/ns/dcat#httpAuthHeaderValue";
export const ASSET_DATA_ADDRESS_HTTP_HEADERS = "http://www.w3.org/ns/dcat#httpHeaders";

export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE = "None";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET = "Vault-Secret";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE = "Value"

export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS = [
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET, text: "assets.new.fieldHttpAuthHeaderTypeWithVaultSecret" },
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE, text: "assets.new.fieldHttpAuthHeaderTypeWithValue" },
];

export const REQUIRED_PROPERTIES: (keyof CreateAssetPropertiesFormData)[] = [ASSET_TITLE, ASSET_ID];
export const REQUIRED_ADVANCED_INFO: (keyof CreateAssetAdvancedInfoFormData)[] = [ASSET_ADVANCED_INFO_DATA_CATEGORY];

export const defaultCreateAssetFormData = {
  "@type": "https://w3id.org/edc/v0.0.1/ns/Asset",
  [ASSET_ID]: "",
  properties: {
    [ASSET_TITLE]: "",
    [ASSET_VERSION]: "",
    [ASSET_ID]: "",
    [ASSET_DESCRIPTION]: "",
    [ASSET_KEYWORDS]: [] as string[],
    [ASSET_LANGUAGE]: ENGLISH_SELECT_DATA.value,
    [ASSET_CONTENT_TYPE]: "",
    [ASSET_ENDPOINT_DOCUMENTATION]: "",
    [ASSET_PUBLISHER]: "",
    [ASSET_STANDARD_LICENSE]: "",
    [DATA_OFFER_PUBLISH_MODE]: "",
    [DATA_OFFER_CONSTRAINTS]: [] as any[],
  },
  advancedInfo: {
    [ASSET_ADVANCED_INFO_DATA_CATEGORY]: "",
    [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: "",
    [ASSET_ADVANCED_INFO_TRANSPORT_MODE]: "",
    [ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]: "",
    [ASSET_ADVANCED_INFO_DATA_MODEL]: "",
    [ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]: "",
    [ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]: "",
    [ASSET_ADVANCED_INFO_GEO_LOCATION]: "",
    [ASSET_ADVANCED_INFO_NUTS_LOCATIONS]: [] as any[],
    [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: [] as any[],
    [ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]: [] as any[],
    [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: "",
    [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: ["", ""] satisfies [string, string],
    [ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]: "",
  },
  dataAddress: {
    [ASSET_DATA_ADDRESS_TYPE]: DATA_ADDRESS_TYPE_HTTP.value,
    [ASSET_DATA_ADDRESS_DESCRIPTION]: "",
    [ASSET_DATA_ADDRESS_METHOD]: "GET",
    [ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD]: false,
    [ASSET_DATA_ADDRESS_BASE_URL]: "",
    [ASSET_DATA_ADDRESS_HTTP_PROXY_PATH]: "",
    [ASSET_DATA_ADDRESS_QUERY_PARAMS]: [],
    [ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION]: false,
    [ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION]: false,
    [ASSET_DATA_ADDRESS_HTTP_HEADERS]: [],
    [ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER]: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE,
    [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE]: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET,
    [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME]: "",
    [ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE]: "",
    [DATA_OFFER_TYPE]: "",
    [DATA_OFFER_CONTACT_EMAIL]: "",
    [DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT]: "",
  },
};

export type CreateAssetFormData = typeof defaultCreateAssetFormData;
export type CreateAssetPropertiesFormData = typeof defaultCreateAssetFormData.properties;
export type CreateAssetAdvancedInfoFormData = typeof defaultCreateAssetFormData.advancedInfo;
export type CreateAssetDataAddressFormData = typeof defaultCreateAssetFormData.dataAddress;

export const computeRequiredDataOfferAddressProperties = (formData: CreateAssetDataAddressFormData): (keyof CreateAssetDataAddressFormData)[] => {
  const required: (keyof CreateAssetDataAddressFormData)[] = [];
  if (formData[DATA_OFFER_TYPE] === DATA_OFFER_TYPE_DATA_SOURCE.value) {
    if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value) {
      required.push(ASSET_DATA_ADDRESS_BASE_URL);
    }
  } else if (formData[DATA_OFFER_TYPE] === DATA_OFFER_TYPE_ON_REQUEST.value) {
    required.push(DATA_OFFER_CONTACT_EMAIL, DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT);
  }

  return required;
};

export const computeRequiredDataAddressProperties = (formData: CreateAssetDataAddressFormData): (keyof CreateAssetDataAddressFormData)[] => {
  const required: (keyof CreateAssetDataAddressFormData)[] = [];
  if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value) {
    required.push(ASSET_DATA_ADDRESS_BASE_URL);
  }

  return required;
};

export const assetFormDataToSubmitData = (formData: CreateAssetFormData) => {
  const cleanFormDataObject = removeEmptyFields(formData);
  return {
    [ASSET_ID]: cleanFormDataObject.properties[ASSET_ID],
    properties: { ...cleanFormDataObject.properties, ...cleanFormDataObject.advancedInfo },
    dataAddress: cleanFormDataObject.dataAddress
  };
}

const assetGeneralFieldsToShow = (asset: Asset) : AssetFieldProps[] => {
  const assetLanguage = readValue(asset.properties, ASSET_LANGUAGE);

  return [
    {
      label: "assets.new.fieldId",
      value: asset[ASSET_ID],
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
      value: "",  // TODO participantId,
      icon: "category"
    },
    {
      label: "assets.new.creatorOrganizationName",
      value: "",  // TODO creatorOrganizationName,
      icon: "account_circle"
    },
    {
      label: "assets.new.connectorEndpoint",
      value: "",  // TODO connectorEndpoint,
      icon: "link"
    },
  ];
};

const assetAdvancedFieldsToShow = (asset: Asset) : AssetFieldProps[] => {
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
  const dataModel = readValue(asset.properties, ASSET_ADVANCED_INFO_DATA_MODEL)
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
  const geoLocation = readValue(asset.properties, ASSET_ADVANCED_INFO_GEO_LOCATION)
  if (geoLocation) {
    advancedFields.push({
      icon: 'location_on',
      label: 'assets.new.fieldAdvancedGeoLocation',
      value: geoLocation,
    });
  }

  const nutsLocations = readValue(asset.properties, ASSET_ADVANCED_INFO_NUTS_LOCATIONS)
  if (nutsLocations?.length) {
    advancedFields.push({
      icon: 'location_on',
      label: 'assets.new.fieldAdvancedInfoNutsLocation',
      value: extractArrayValues(nutsLocations).join(DELIMITER),
    });
  }
  const sovereignLegalName = readValue(asset.properties, ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME)
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
  const temporalCoverage = asset.properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE];
  if (temporalCoverage) {
    advancedFields.push({
      icon: 'today',
      label: 'assets.new.fieldAdvancedInfoTemporalCoverage',
      value: temporalCoverage.map((date: { "@value": string }) => date["@value"]).join(" - "), // TODO: add start end prefixes when only start or end date is set
    });
  }

  return advancedFields;
};

const assetDataAddressFieldsToShow = (asset: Asset) : AssetFieldProps[] => {
  const dataAddressFieldsToMerge = [
    {
      label: "assets.new.httpProxyMethod",
      value: readValue(asset.dataAddress, ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD),
    },
    {
      label: "assets.new.httpProxyPath",
      value: readValue(asset.dataAddress, ASSET_DATA_ADDRESS_HTTP_PROXY_PATH),
    },
    {
      label: "assets.new.fieldDataAddressQueryParams",
      value: readValue(asset.dataAddress, ASSET_DATA_ADDRESS_QUERY_PARAMS),
    },
    {
      label: "assets.new.enableBodyParameterization",
      value: readValue(asset.dataAddress, ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION),
    },
  ];
  const dataSourceText = ! dataAddressFieldsToMerge.some((field) => field.value) ? 'Disabled' :
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

export const assetFieldsToShow = (asset: Asset) : AssetFieldProps[] => {
  return [
    ...assetGeneralFieldsToShow(asset),
    ...assetDataAddressFieldsToShow(asset),
    ...assetAdvancedFieldsToShow(asset),
  ]
}
