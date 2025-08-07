import {removeEmptyFields} from "@/utilities/form";
import {Asset, AssetInput, DataAddress} from "@think-it-labs/edc-connector-client";
import {FieldShowProps} from "@/components/molecules/field-show";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {ENGLISH_SELECT_DATA, LANGUAGES} from "@/constants/languages";
import {DELIMITER} from "@/i18n";
import {extractArrayValues, isEmail, isUrl, uid} from "@/utilities/utilities";
import {ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE, ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_DATA_MODEL, ASSET_ADVANCED_INFO_DATA_MODEL_ID, ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA, ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY, ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY, ASSET_ADVANCED_INFO_GEO_LOCATION, ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL, ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS, ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD, ASSET_ADVANCED_INFO_MOBILITY_THEME, ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION, ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS, ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END, ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START, ASSET_ADVANCED_INFO_TRANSPORT_MODE, ASSET_CONTENT_TYPE, ASSET_DESCRIPTION, ASSET_ENDPOINT_DOCUMENTATION, ASSET_KEYWORDS, ASSET_LANGUAGE, ASSET_ORGANIZATION, ASSET_PUBLISHER, ASSET_STANDARD_LICENSE, ASSET_TITLE, ASSET_VERSION} from "@/jsonld/asset";
import {AzureBlobDataAddress, DataAddressErrors, DataAddressTypes, defaultHttpSourceDataAddress, OnRequestDataAddress, AmazonS3DataAddress} from "./data-address";
import {CONTEXT_DCAT, contextWithNoPrefixToCompact} from "@/jsonld/context";
import {HttpDataAddress} from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";
import {dataCategoryValueToText, dataSubCategoryValueToText} from "@/utilities/data-category.ts";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import jsonld from "jsonld";
import {Tag} from "@/components/atoms/key-value-pair-input.tsx";
import {EDC_ID_FIELD} from "@/utilities/data-offer.ts";

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

export const fromAssetForm = (formData: AssetInput, organizationName: string) => {
  const properties = { ...formData.properties };
  delete properties["@id"];
  delete properties[EDC_ID_FIELD];
  
  const cleanFormDataObject = removeEmptyFields({
    ...formData,
    "@id": formData.properties["@id"],
    properties: {
      ...properties,
      [ASSET_ORGANIZATION]: organizationName
    }
  });
  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS] && cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS].length > 0 ? cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS].map(fromKeyValueInput) : [];

  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] && cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS].length > 0 ? cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS].map(fromKeyValueInput) : [];
  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] && cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS].length > 0 ? cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS].map(fromKeyValueInput) : [];

  if (cleanFormDataObject.properties[ASSET_ADVANCED_INFO_MOBILITY_THEME][ASSET_ADVANCED_INFO_DATA_SUBCATEGORY] == "-"){
    delete cleanFormDataObject.properties[ASSET_ADVANCED_INFO_MOBILITY_THEME][ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]
  }

  if(cleanFormDataObject.dataAddress.type == DataAddressTypes.MDSOnRequestOffer){
    cleanFormDataObject.properties.additionalProperties = {}
    cleanFormDataObject.properties.additionalProperties.onrequest = "true"
    cleanFormDataObject.properties.additionalProperties.email = cleanFormDataObject.dataAddress.email
    cleanFormDataObject.properties.additionalProperties.preferred_subject = cleanFormDataObject.dataAddress.preferred_subject
  }

  return {
    "@type": "https://w3id.org/edc/v0.0.1/ns/Asset",
    "@id": cleanFormDataObject["@id"],
    properties: cleanFormDataObject.properties,
    privateProperties: cleanFormDataObject.privateProperties,
    dataAddress: transformDataAddress(cleanFormDataObject.dataAddress),
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
    [ASSET_ORGANIZATION]: "",

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
    [ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]: "",
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
  dataAddress: defaultHttpSourceDataAddress,
};

export type AssetProperties = typeof defaultCreateAssetFormData.properties;

export const assetGeneralFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): FieldShowProps[] => {
  const assetLanguage = readValue(asset.properties, ASSET_LANGUAGE);
  const emptyValue = "-";

  const result = [
    {
      label: "assets.new.fieldId",
      value: asset["@id"],
      icon: "category"
    },
    {
      label: "assets.new.fieldVersion",
      value: readValue(asset.properties, ASSET_VERSION) || emptyValue,
      icon: "file_copy"
    },
    {
      label: "assets.new.fieldLanguage",
      value: LANGUAGES.find((language) => language.id === assetLanguage)?.label || emptyValue,
      icon: "language"
    },
    {
      label: "assets.new.fieldPublisher",
      value: readValue(asset.properties, ASSET_PUBLISHER) || emptyValue,
      icon: "apartment"
    },
    {
      label: "assets.new.fieldEndpointDocumentation",
      value: readValue(asset.properties, ASSET_ENDPOINT_DOCUMENTATION) || emptyValue,
      icon: "bookmarks"
    },
    {
      label: "assets.new.fieldStandardLicense",
      value: readValue(asset.properties, ASSET_STANDARD_LICENSE) || emptyValue,
      icon: "gavel"
    },
    {
      label: "assets.new.participantId",
      value: participantId || emptyValue,
      icon: "category"
    },
    {
      label: "assets.new.creatorOrganizationName",
      value: readValue(asset.properties, ASSET_ORGANIZATION) || emptyValue,
      icon: "account_circle",
      testDataId: "organizationName"
    },
    {
      label: "assets.new.connectorEndpoint",
      value: connectorEndpoint || emptyValue,
      icon: "link"
    },
  ];

  const contentType = readValue(asset.properties, ASSET_CONTENT_TYPE);
  if (contentType) {
    result.push({
      label: "assets.new.fieldContentType",
      value: readValue(asset.properties, ASSET_CONTENT_TYPE),
      icon: 'category',
    });
  }

  return result;
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

  const mobilityThemeArray = readValue(asset.properties, ASSET_ADVANCED_INFO_MOBILITY_THEME);
  const mobilityTheme = mobilityThemeArray && mobilityThemeArray[0];
  const dataCategory = readValue(mobilityTheme, ASSET_ADVANCED_INFO_DATA_CATEGORY)
  if (dataCategory) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoDataCategory',
      value: dataCategoryValueToText(dataCategory),
    });
  }
  const dataSubcategory = readValue(mobilityTheme, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY)
  if (dataSubcategory) {
    advancedFields.push({
      icon: 'commute',
      label: 'assets.new.fieldAdvancedInfoDataSubcategory',
      value: dataSubCategoryValueToText(dataCategory, dataSubcategory),
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
      value: temporalCoverageValue([readValue(temporalCoverage[0], `${CONTEXT_DCAT.value}startDate`), readValue(temporalCoverage[0], `${CONTEXT_DCAT.value}endDate`)]),
    });
  }

  return advancedFields;
};

export const assetFieldsToShow = (asset: Asset, participantId: string, connectorEndpoint: string): FieldShowProps[] => {
  return [
    ...assetGeneralFieldsToShow(asset, participantId, connectorEndpoint),
    ...assetAdvancedFieldsToShow(asset),
  ]
};

export const assetDataAddressFieldsTitle = (asset: Asset) => {
  const dataAddress = removeJsonLdSchemaFromProperties(asset.dataAddress);
  const type = readValue(dataAddress, "type");
  if (type === DataAddressTypes.MDSOnRequestOffer) {
    return "dataOffer.contactInformation";
  }

  return "";
}

export const assetDataAddressFieldsToShow = (asset: Asset): FieldShowProps[] => {
  const properties = removeJsonLdSchemaFromProperties(asset.properties);
  const additionalProperties = readValue(properties, "additionalProperties")?.[0] ;
  const onrequest = readValue(additionalProperties, "onrequest") == "true";

  if (onrequest) {
    return [
      {
        label: "dataOffer.contactEmailAddress",
        value: readValue(additionalProperties, "email"),
        icon: 'mail',
        copyTextIcon: true,
      },
      {
        label: "dataOffer.new.dataOfferContactPreferredEmailSubject",
        value: readValue(additionalProperties, "preferred_subject"),
        icon: 'subject',
        copyTextIcon: true,
      },
    ];
  }

  return [];
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

export const validateDataAddress = (formDataToValidate: DataAddress, translator: (str: string) => string, isDestination = false) => {
  if (formDataToValidate.type === DataAddressTypes.CustomJson) {
    if (! formDataToValidate.dataAddress) {
      return { dataAddress: true };
    }

    try {
      JSON.parse(formDataToValidate.dataAddress as string);
    } catch (e) {
      return { dataAddress: translator("assets.new.mustBeValidJson") };
    }
  }

  if (formDataToValidate.type === DataAddressTypes.HttpData) {
    const errors: DataAddressErrors<HttpDataAddress> = {};

    if (! formDataToValidate.baseUrl) {
      errors.baseUrl = true;
    } else if (! isUrl(formDataToValidate.baseUrl)) {
      errors.baseUrl = translator("assets.new.mustBeValidUrl");
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.MDSOnRequestOffer) {
    const errors: DataAddressErrors<OnRequestDataAddress> = {};

    if (! formDataToValidate.email) {
      errors.email = true;
    } else if (! isEmail(formDataToValidate.email)) {
      errors.email = translator("assets.new.mustBeValidEmail");
    }

    if (! formDataToValidate.preferred_subject) {
      errors.preferred_subject = true;
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.AmazonS3) {
    const requiredProperties = ["bucketName", "region"];
    const errors : DataAddressErrors<AmazonS3DataAddress> = {}
    requiredProperties.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        errors[propertyName] = true;
      }
    });

    if (! formDataToValidate.objectPrefix && ! formDataToValidate.objectName) {
      errors.objectName = true;
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.AzureStorage) {
    const requiredProperties = ["account", "container", "keyname"];
    const errors : DataAddressErrors<AzureBlobDataAddress> = {}
    requiredProperties.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        errors[propertyName] = true;
      }
    });

    return errors;
  }

  return {};
}

export const toKeyValueInput = (value: string | { key: string, value: string }) => {
  return {
    input: typeof value === "string" ? { value } : value,
    valid: true,
    id: uid(),
  }
}

export const fromKeyValueInput = (value: { input: Tag; valid: boolean; id: string }) => {
  try {
    return value?.input?.key ? value.input : value.input.value;
  } catch (error) {
    throw error
  }
}

export const assetToAssetInput = async (asset: Asset) => {
  const removedJsonLd = await jsonld.compact(asset, contextWithNoPrefixToCompact);
  const properties: any = { ...defaultCreateAssetFormData.properties, ...removedJsonLd["https://w3id.org/edc/v0.0.1/ns/properties"] as any };
  const auxDataAddress: any = { ...defaultCreateAssetFormData.dataAddress, ...removedJsonLd["https://w3id.org/edc/v0.0.1/ns/dataAddress"] as any };
  const dataAddress: any = {};

  const regex = /^https?:\/\/.*[#\/]([^\/#]+)$/;
  for (const prop in auxDataAddress) {
    const match = prop.match(regex);
    if (! match) {
      dataAddress[prop] = auxDataAddress[prop];
      continue;
    }
    const firstMatch = match[1];
    dataAddress[firstMatch] = auxDataAddress[prop];
  }

  if (typeof properties[ASSET_KEYWORDS] === "string") {
    properties[ASSET_KEYWORDS] = [properties[ASSET_KEYWORDS]];
  }


let geoLocationNuts = properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS];

if(geoLocationNuts && !Array.isArray(geoLocationNuts)) {
  geoLocationNuts = [geoLocationNuts]
 }
  
 if (geoLocationNuts) {
   properties[ASSET_ADVANCED_INFO_GEO_LOCATION][ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS] = geoLocationNuts.map(toKeyValueInput)
 }

  properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] =
    properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] && Array.isArray(properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]) ? properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS].map(toKeyValueInput) : [properties[ASSET_ADVANCED_INFO_DATA_MODEL][ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]].map(toKeyValueInput);

  properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] =
    properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] && Array.isArray(properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]) ? properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS].map(toKeyValueInput) : [properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]].map(toKeyValueInput);

  return {
    "@id": removedJsonLd["@id"],
    properties: { ...properties, "@id": removedJsonLd["@id"] },
    dataAddress,
  } as AssetInput;
}

export const transformDataAddress = (formDataToTransform: DataAddress) => {
  if (formDataToTransform.type === DataAddressTypes.CustomJson) {
    try {
      return JSON.parse(formDataToTransform.dataAddress as string);
    } catch (e) {
      return formDataToTransform;
    }
  }

  if (formDataToTransform.type === DataAddressTypes.HttpData) {
    const headers = (formDataToTransform.headers || [])
      .filter((value: { input: { key: string, value: string } }) => value?.input?.key && value?.input?.value)
      .reduce((acc: Record<string, string>, value: { input: { key: string, value: string } }) => {
          acc[`header:${value.input.key}`] = value.input.value;
          return acc;
        }, {}
    );

    const queryParams = (formDataToTransform.queryParams || [])
      .filter((value: { input: { key: string, value: string } }) => value?.input?.key && value?.input?.value)
      .map((value: { input: { key: string, value: string } }) => `${value.input.key}=${value.input.value}`)
      .join("&");

    return removeEmptyFields({
      type: DataAddressTypes.HttpData,
      method: formDataToTransform?.method,
      name: formDataToTransform?.name,
      path: formDataToTransform?.path,
      baseUrl: formDataToTransform?.baseUrl,
      authKey: formDataToTransform?.authKey,
      authCode: formDataToTransform?.authCode,
      secretName: formDataToTransform?.secretName,
      proxyBody: formDataToTransform?.proxyBody,
      proxyPath: formDataToTransform?.proxyPath,
      proxyQueryParams: formDataToTransform?.proxyQueryParams,
      proxyMethod: formDataToTransform?.proxyMethod,
      contentType: formDataToTransform?.contentType,
      queryParams: queryParams,
      ...headers,
    });
  }

  if (formDataToTransform.type === DataAddressTypes.MDSOnRequestOffer) {
    return {
      type: DataAddressTypes.MDSOnRequestOffer,
      email: formDataToTransform.email,
      preferred_subject: formDataToTransform.preferred_subject,
    };
  }

  if (formDataToTransform.type === DataAddressTypes.AmazonS3) {
    return {
      type: DataAddressTypes.AmazonS3,
      bucketName: formDataToTransform.bucketName,
      region: formDataToTransform.region,
      keyname: formDataToTransform.keyname,
      objectName: formDataToTransform?.objectName,
      objectPrefix: formDataToTransform?.objectPrefix,
    };
  }

  if (formDataToTransform.type === DataAddressTypes.AzureStorage) {
    return removeEmptyFields({
      type: DataAddressTypes.AzureStorage,
      container: formDataToTransform.container,
      account: formDataToTransform.account,
      folderName: formDataToTransform?.folderName,
      blobName: formDataToTransform?.blobName,
      blobPrefix: formDataToTransform?.blobPrefix,
      keyname: formDataToTransform.keyname,
    });
  }

  return formDataToTransform;
}
