import {removeEmptyFields} from "@/utilities/form.ts";
import {DATA_ADDRESS_TYPE_CUSTOM, DATA_ADDRESS_TYPE_HTTP, DATA_OFFER_TYPE_DATA_SOURCE, DATA_OFFER_TYPE_ON_REQUEST} from "@/constants/data-address-types.ts";
import {Asset, AssetInput, BaseDataAddress, DataAddress, HttpDataAddress} from "@think-it-labs/edc-connector-client";
import {AssetFieldShowProps} from "@/components/molecules/asset-field-show.tsx";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {ENGLISH_SELECT_DATA, LANGUAGES} from "@/constants/languages.ts";
import {DELIMITER} from "@/i18n";
import {extractArrayValues} from "@/utilities/utilities.ts";
import {ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE, ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY, ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY, ASSET_ADVANCED_INFO_GEO_LOCATION, ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD, ASSET_ADVANCED_INFO_NUTS_LOCATIONS, ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION, ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS, ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE, ASSET_ADVANCED_INFO_TRANSPORT_MODE, ASSET_CONTENT_TYPE, ASSET_DATA_ADDRESS_BASE_URL, ASSET_DATA_ADDRESS_DESCRIPTION, ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION, ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION, ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE, ASSET_DATA_ADDRESS_HTTP_HEADERS, ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD, ASSET_DATA_ADDRESS_HTTP_PROXY_PATH, ASSET_DATA_ADDRESS_METHOD, ASSET_DATA_ADDRESS_QUERY_PARAMS, ASSET_DATA_ADDRESS_TYPE, ASSET_DESCRIPTION, ASSET_ENDPOINT_DOCUMENTATION, ASSET_KEYWORDS, ASSET_LANGUAGE, ASSET_PUBLISHER, ASSET_STANDARD_LICENSE, ASSET_TITLE, ASSET_VERSION, DATA_OFFER_CONSTRAINTS, DATA_OFFER_CONTACT_EMAIL, DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT, DATA_OFFER_PUBLISH_MODE, DATA_OFFER_TYPE} from "@/schema/asset.ts";

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
}

export const computeRequiredDataOfferAddressProperties = (formData: DataAddress): (keyof DataAddress)[] => {
  const required: (keyof DataAddress)[] = [];
  if (formData[DATA_OFFER_TYPE] === DATA_OFFER_TYPE_DATA_SOURCE.value) {
    if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value) {
      required.push(ASSET_DATA_ADDRESS_BASE_URL);
    } else if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_CUSTOM.value) {
      required.push(ASSET_DATA_ADDRESS_DESCRIPTION);
    }
  } else if (formData[DATA_OFFER_TYPE] === DATA_OFFER_TYPE_ON_REQUEST.value) {
    required.push(DATA_OFFER_CONTACT_EMAIL, DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT);
  }

  return required;
};

export const computeRequiredDataAddressProperties = (formData: DataAddress): (keyof DataAddress)[] => {
  const required: (keyof DataAddress)[] = [];
  if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value) {
    required.push(ASSET_DATA_ADDRESS_BASE_URL);
  } else if (formData[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_CUSTOM.value) {
    required.push(ASSET_DATA_ADDRESS_DESCRIPTION);
  }

  return required;
};

export const fromAssetForm = (formData: AssetInput) => {
  console.log("Pre Clean")
  console.log(formData)
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log("Post Clean")
  console.log(cleanFormDataObject)
  
  return {
    "@type": "https://w3id.org/edc/v0.0.1/ns/Asset",
    "@id": cleanFormDataObject["@id"],
    properties: {
      [ASSET_ADVANCED_INFO_DATA_CATEGORY]: cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_CATEGORY]
    },
    privateProperties: cleanFormDataObject.privateProperties,
    dataAddress: cleanFormDataObject.dataAddress
  };
};

const httpDefault: HttpDataAddress = {
  type: "HttpData",
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
} ;

const customDefault: BaseDataAddress = {
  type: "",
  [DATA_OFFER_TYPE]: "",
  [DATA_OFFER_CONTACT_EMAIL]: "",
  [DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT]: "",
} ;

export const defaultCreateAssetFormData: AssetInput = {
  "@id": "",
  properties: {
    [ASSET_TITLE]: "",
    [ASSET_VERSION]: "",
    [ASSET_DESCRIPTION]: "",
    [ASSET_KEYWORDS]: [] as string[],
    [ASSET_LANGUAGE]: ENGLISH_SELECT_DATA.value,
    [ASSET_CONTENT_TYPE]: "",
    [ASSET_ENDPOINT_DOCUMENTATION]: "",
    [ASSET_PUBLISHER]: "",
    [ASSET_STANDARD_LICENSE]: "",
    [DATA_OFFER_PUBLISH_MODE]: "",
    [DATA_OFFER_CONSTRAINTS]: [] as any[],

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
  privateProperties: {},
  dataAddress: httpDefault,
};

export type AssetProperties = typeof defaultCreateAssetFormData.properties;
const assetGeneralFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): AssetFieldShowProps[] => {
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
      value: "",  // TODO creatorOrganizationName,
      icon: "account_circle"
    },
    {
      label: "assets.new.connectorEndpoint",
      value: connectorEndpoint,
      icon: "link"
    },
  ];
};

const assetAdvancedFieldsToShow = (asset: Asset): AssetFieldShowProps[] => {
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
  const temporalCoverage = readValue(asset.properties, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE);
  if (temporalCoverage) {
    advancedFields.push({
      icon: 'today',
      label: 'assets.new.fieldAdvancedInfoTemporalCoverage',
      value: temporalCoverageValue(temporalCoverage.map((date: { "@value": string }) => date["@value"])),
    });
  }

  return advancedFields;
};

const assetDataAddressFieldsToShow = (asset: Asset): AssetFieldShowProps[] => {
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

export const assetFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): AssetFieldShowProps[] => {
  return [
    ...assetGeneralFieldsToShow(asset, participantId, connectorEndpoint),
    ...assetDataAddressFieldsToShow(asset),
    ...assetAdvancedFieldsToShow(asset),
  ]
};

export const assetPrivateFieldsToShow = (asset: Asset): AssetFieldShowProps[] => {
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

export const assetCustomFieldsToShow = (asset: Asset): AssetFieldShowProps[] => {
  const dataAddressDescription = readValue(asset.dataAddress, ASSET_DATA_ADDRESS_DESCRIPTION)
  let customProperties = {};
  try {
    customProperties = JSON.parse(dataAddressDescription);
  } catch (error) {
    return [];
  }

  return Object.entries(customProperties)
  .map(([label, value]) => ({
    label,
    value: value as string,
    icon: "category"
  }))
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
