import {
  DATA_ADDRESS_TYPE_HTTP,
  DATA_OFFER_TYPE_DATA_SOURCE,
  DATA_OFFER_TYPE_ON_REQUEST
} from "@/constants/data-address-types.ts";
import {ENGLISH_SELECT_DATA} from "@/constants/languages.ts";

export const ASSET_PROPERTIES = "https://w3id.org/edc/v0.0.1/ns/properties";
export const ASSET_TITLE = "http://purl.org/dc/terms/title";
export const ASSET_VERSION = "http://www.w3.org/ns/dcat#version";
export const ASSET_ID = "@id";
export const ASSET_DESCRIPTION = "http://purl.org/dc/terms/description";
export const ASSET_KEYWORDS = "http://www.w3.org/ns/dcat#keyword";
export const ASSET_LANGUAGE = "http://purl.org/dc/terms/language";
export const ASSET_CONTENT_TYPE = "['http://www.w3.org/ns/dcat#distribution'].['http://www.w3.org/ns/dcat#mediaType']";
export const ASSET_ENDPOINT_DOCUMENTATION = "endpointDocumentation";
export const ASSET_PUBLISHER = "publisher";
export const ASSET_STANDARD_LICENSE = "http://purl.org/dc/terms/license";
export const DATA_OFFER_TYPE = "dataSourceAvailability";
export const DATA_OFFER_CONTACT_EMAIL = "contactEmail";
export const DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT = "contactPreferredEmailSubject";
export const DATA_OFFER_PUBLISH_MODE = "publishMode";
export const DATA_OFFER_CONSTRAINTS = "constraints";

export const ASSET_ADVANCED_INFO_DATA_CATEGORY = "dataCategory";
export const ASSET_ADVANCED_INFO_DATA_SUBCATEGORY = "dataSubcategory";
export const ASSET_ADVANCED_INFO_TRANSPORT_MODE = "transportMode";
export const ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD = "geoReferenceMethod";
export const ASSET_ADVANCED_INFO_DATA_MODEL = "dataModel";
export const ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME = "sovereignLegalName";
export const ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY = "dataUpdateFrequency";
export const ASSET_ADVANCED_INFO_GEO_LOCATION = "geoLocation";
export const ASSET_ADVANCED_INFO_NUTS_LOCATIONS = "nutsLocations";
export const ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS = "dataSampleUrls";
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS = "referenceFileUrls";
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION = "referenceFilesDescription";
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE = "temporalCoverage";
export const ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE = "conditionsForUse";

export const ASSET_DATA_ADDRESS_TYPE = "https://w3id.org/edc/v0.0.1/ns/type";
export const ASSET_DATA_ADDRESS_DESCRIPTION = "http://purl.org/dc/terms/description";
export const ASSET_DATA_ADDRESS_METHOD = "method";
export const ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD = "https://w3id.org/edc/v0.0.1/ns/httpProxyMethod";
export const ASSET_DATA_ADDRESS_BASE_URL = "https://w3id.org/edc/v0.0.1/ns/baseUrl";
export const ASSET_DATA_ADDRESS_HTTP_PROXY_PATH = "httpProxyPath";
export const ASSET_DATA_ADDRESS_QUERY_PARAMS = "https://w3id.org/edc/v0.0.1/ns/queryParams";
export const ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION = "https://w3id.org/edc/v0.0.1/ns/enableQueryParameterization";
export const ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION = "https://w3id.org/edc/v0.0.1/ns/enableBodyParameterization";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER = "httpAuthAddHeader";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE = "httpAuthHeaderType";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME = "httpAuthHeaderName";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE = "httpAuthHeaderValue";
export const ASSET_DATA_ADDRESS_HTTP_HEADERS = "https://w3id.org/edc/v0.0.1/ns/httpHeaders";

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

export const removeEmptyFields = (object: { [key: string]: any }) => {
  const newFormData: { [key: string]: any } = {};
  for (const key in object) {
    if (typeof object[key] === "boolean") {
      newFormData[key] = "" + object[key];
      continue;
    }

    if ((Array.isArray(object[key]))) {
      if (object[key].length > 0) {
        newFormData[key] = object[key];
      }
      continue;
    }

    if (typeof object[key] === "object") {
      newFormData[key] = removeEmptyFields(object[key]);
      continue;
    }

    if (object[key]) {
      newFormData[key] = object[key];
      continue;
    }
  }
  return newFormData;
};

export const assetFormDataToSubmitData = (formData: CreateAssetFormData) => {
  const cleanFormDataObject = removeEmptyFields(formData);
  return {
    [ASSET_ID]: cleanFormDataObject.properties[ASSET_ID],
    properties: { ...cleanFormDataObject.properties, ...cleanFormDataObject.advancedInfo },
    dataAddress: cleanFormDataObject.dataAddress
  };
}
