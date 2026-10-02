import { Tag } from "@/components/atoms/key-value-pair-input";
import {
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_DATA_SUBCATEGORY,
  ASSET_ADVANCED_INFO_GEO_LOCATION,
  ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS,
  ASSET_ADVANCED_INFO_MOBILITY_THEME,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START,
  ASSET_KEYWORDS,
  ASSET_ORGANIZATION,
  ASSET_QUERY_PARAMS,
  AUTH_HEADER_TYPE_VAULT_SECRET,
  resolveAuthHeaderType,
} from "@/jsonld/asset";
import { CONTEXT_EDC, contextWithNoPrefixToCompact } from "@/jsonld/context";
import { EDC_ID_FIELD } from "@/utilities/data-offer";
import { removeEmptyFields } from "@/utilities/form";
import { uid } from "@/utilities/utilities";
import {
  Asset,
  AssetInput,
  DataAddress,
} from "@think-it-labs/edc-connector-client";
import jsonld from "jsonld";
import { DataAddressTypes } from "@/utilities/data-address";
import { dateToISO, dateToString } from "@/utilities/date";
import {
  AssetProperties,
  defaultCreateAssetFormData,
} from "@/domain/asset/model";

export const fromAssetForm = (
  formData: AssetInput,
  organizationName: string,
) => {
  const properties = { ...formData.properties };
  delete properties["@id"];
  delete properties[EDC_ID_FIELD];
  delete properties[`${CONTEXT_EDC.value}additionalProperties`];

  const cleanFormDataObject = removeEmptyFields({
    ...formData,
    "@id": formData.properties["@id"],
    properties: {
      ...properties,
      [ASSET_ORGANIZATION]: organizationName,
    },
  });
  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
    ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
  ] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
      ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
    ] &&
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
      ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
    ].length > 0
      ? cleanFormDataObject.properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
          ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
        ].map(fromKeyValueInput)
      : [];

  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][
    ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
  ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][
      ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
    ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] &&
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][
      ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
    ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS].length > 0
      ? cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_MODEL][
          ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
        ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS].map(fromKeyValueInput)
      : [];
  cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] &&
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]
      .length > 0
      ? cleanFormDataObject.properties[
          ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS
        ].map(fromKeyValueInput)
      : [];

  if (
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_MOBILITY_THEME][
      ASSET_ADVANCED_INFO_DATA_SUBCATEGORY
    ] == "-"
  ) {
    delete cleanFormDataObject.properties[ASSET_ADVANCED_INFO_MOBILITY_THEME][
      ASSET_ADVANCED_INFO_DATA_SUBCATEGORY
    ];
  }

  if (
    cleanFormDataObject.dataAddress.type == DataAddressTypes.MDSOnRequestOffer
  ) {
    cleanFormDataObject.properties.additionalProperties = {
      ...cleanFormDataObject.properties.additionalProperties,
    };
    cleanFormDataObject.properties.additionalProperties.onrequest = "true";
    cleanFormDataObject.properties.additionalProperties.email =
      cleanFormDataObject.dataAddress.email;
    cleanFormDataObject.properties.additionalProperties.preferred_subject =
      cleanFormDataObject.dataAddress.preferred_subject;
  }

  const temporalCoverage =
    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE];
  if (temporalCoverage) {
    const startDate = temporalCoverage[
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START
    ] as string;
    const endDate = temporalCoverage[
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END
    ] as string;

    cleanFormDataObject.properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE] = {
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START]: dateToISO(startDate),
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END]: dateToISO(endDate),
    };
  }

  return {
    "@type": "https://w3id.org/edc/v0.0.1/ns/Asset",
    "@id": cleanFormDataObject["@id"],
    properties: cleanFormDataObject.properties,
    privateProperties: cleanFormDataObject.privateProperties,
    dataAddress: transformDataAddress(cleanFormDataObject.dataAddress),
  };
};

const toKeyValueInput = (value: string | { key: string; value: string }) => {
  return {
    input: typeof value === "string" ? { value } : value,
    valid: true,
    id: uid(),
  };
};

const fromKeyValueInput = (value: {
  input: Tag;
  valid: boolean;
  id: string;
}) => {
  try {
    return value?.input?.key ? value.input : value.input.value;
  } catch (error) {
    throw error;
  }
};

export const assetToAssetInput = async (asset: Asset) => {
  const removedJsonLd = await jsonld.compact(
    asset,
    contextWithNoPrefixToCompact,
  );
  // deep copy: the nested defaults are mutated below
  const defaults = structuredClone(defaultCreateAssetFormData);
  const properties: AssetProperties = {
    ...defaults.properties,
    ...(removedJsonLd[
      "https://w3id.org/edc/v0.0.1/ns/properties"
    ] as Partial<AssetProperties>),
  };
  const auxDataAddress: Record<string, unknown> = {
    ...defaults.dataAddress,
    ...(removedJsonLd["https://w3id.org/edc/v0.0.1/ns/dataAddress"] as Record<
      string,
      unknown
    >),
  };
  const dataAddress = {} as DataAddress;

  const regex = /^https?:\/\/.*[#\/]([^\/#]+)$/;
  for (const prop in auxDataAddress) {
    const match = prop.match(regex);
    if (!match) {
      dataAddress[prop] = auxDataAddress[prop];
      continue;
    }
    const firstMatch = match[1];
    dataAddress[firstMatch] = auxDataAddress[prop];
  }

  if (typeof auxDataAddress[ASSET_QUERY_PARAMS] === "string") {
    dataAddress.queryParams = (auxDataAddress[ASSET_QUERY_PARAMS] as string)
      .split("&")
      .map((queryParam: string) => {
        const [key, value] = queryParam.split("=");
        return { input: { key, value }, valid: true };
      });
  }

  if (typeof properties[ASSET_KEYWORDS] === "string") {
    properties[ASSET_KEYWORDS] = [properties[ASSET_KEYWORDS]];
  }

  let geoLocationNuts =
    properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
      ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
    ];
  if (geoLocationNuts && !Array.isArray(geoLocationNuts)) {
    geoLocationNuts = [geoLocationNuts];
  }
  if (geoLocationNuts) {
    properties[ASSET_ADVANCED_INFO_GEO_LOCATION][
      ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS
    ] = geoLocationNuts.map(toKeyValueInput);
  }

  let infoReferenceFileUrls =
    properties[ASSET_ADVANCED_INFO_DATA_MODEL][
      ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
    ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS];
  if (infoReferenceFileUrls && !Array.isArray(infoReferenceFileUrls)) {
    infoReferenceFileUrls = [infoReferenceFileUrls].map(toKeyValueInput);
  }
  if (infoReferenceFileUrls) {
    properties[ASSET_ADVANCED_INFO_DATA_MODEL][
      ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
    ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] =
      infoReferenceFileUrls.map(toKeyValueInput);
  }

  properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] =
    properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] &&
    Array.isArray(properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS])
      ? properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS].map(toKeyValueInput)
      : [properties[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]].map(toKeyValueInput);

  const currReferences = properties[ASSET_ADVANCED_INFO_DATA_MODEL]?.[
    ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
  ]?.[ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]?.map(
    (item: { input?: { input?: Partial<Tag>; value?: string } }) => {
      return item?.input?.input?.value || item.input?.value;
    },
  );

  const temporalCoverage = properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE];

  if (temporalCoverage) {
    const startDate = temporalCoverage[
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START
    ] as string;
    const endDate = temporalCoverage[
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END
    ] as string;
    properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE][
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START
    ] = dateToString(new Date(startDate));
    properties[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE][
      ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END
    ] = dateToString(new Date(endDate));
  }

  if (currReferences) {
    properties[ASSET_ADVANCED_INFO_DATA_MODEL][
      ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
    ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] =
      currReferences.map(toKeyValueInput);
  }
  return {
    "@id": removedJsonLd["@id"],
    properties: { ...properties, "@id": removedJsonLd["@id"] },
    dataAddress,
  } as AssetInput;
};

export const transformDataAddress = (formDataToTransform: DataAddress) => {
  if (formDataToTransform.type === DataAddressTypes.CustomJson) {
    try {
      return JSON.parse(formDataToTransform.dataAddress as string);
    } catch {
      return formDataToTransform;
    }
  }

  if (formDataToTransform.type === DataAddressTypes.HttpData) {
    const headersArray = Array.isArray(formDataToTransform.headers)
      ? formDataToTransform.headers
      : [];
    const headers = headersArray
      .filter(
        (value: { input: { key: string; value: string } }) =>
          value?.input?.key && value?.input?.value,
      )
      .reduce(
        (
          acc: Record<string, string>,
          value: { input: { key: string; value: string } },
        ) => {
          acc[`header:${value.input.key}`] = value.input.value;
          return acc;
        },
        {},
      );

    let queryParams: string;
    if (typeof formDataToTransform.queryParams === "string") {
      queryParams = formDataToTransform.queryParams;
    } else {
      const queryParamsArray = Array.isArray(formDataToTransform.queryParams)
        ? formDataToTransform.queryParams
        : [];
      queryParams = queryParamsArray
        .filter(
          (value: { input: { key: string; value: string } }) =>
            value?.input?.key && value?.input?.value,
        )
        .map(
          (value: { input: { key: string; value: string } }) =>
            `${value.input.key}=${value.input.value}`,
        )
        .join("&");
    }

    const isVaultSecret =
      resolveAuthHeaderType(formDataToTransform) ===
      AUTH_HEADER_TYPE_VAULT_SECRET;

    return removeEmptyFields({
      ...formDataToTransform,
      type: DataAddressTypes.HttpData,
      method: formDataToTransform?.method,
      name: formDataToTransform?.name,
      path: formDataToTransform?.path,
      baseUrl: formDataToTransform?.baseUrl,
      authKey: formDataToTransform?.authKey,
      // Only persist the field matching the selected header type.
      authCode: isVaultSecret ? undefined : formDataToTransform?.authCode,
      secretName: isVaultSecret ? formDataToTransform?.secretName : undefined,
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
      keyName: formDataToTransform.keyName,
      folderName: formDataToTransform?.folderName,
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
      keyName: formDataToTransform.keyName,
    });
  }

  if (formDataToTransform.type === DataAddressTypes.Kafka) {
    return removeEmptyFields({
      type: DataAddressTypes.Kafka,
      "kafka.sasl.mechanism": formDataToTransform["kafka.sasl.mechanism"],
      "kafka.security.protocol": formDataToTransform["kafka.security.protocol"],
      "kafka.bootstrap.servers": formDataToTransform["kafka.bootstrap.servers"],
      topic: formDataToTransform.topic,
      oidcRegisterClientTokenKey:
        formDataToTransform.oidcRegisterClientTokenKey,
      kafkaAdminPropertiesKey: formDataToTransform.kafkaAdminPropertiesKey,
      oidcDiscoveryUrl: formDataToTransform.oidcDiscoveryUrl,
      "kafka.sasl.oauthbearer.extensions":
        formDataToTransform["kafka.sasl.oauthbearer.extensions"],
    });
  }

  return formDataToTransform;
};
