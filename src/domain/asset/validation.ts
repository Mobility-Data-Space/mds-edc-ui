import {
  ASSET_ADVANCED_INFO_DATA_CATEGORY,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_MOBILITY_THEME,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START,
} from "@/jsonld/asset";
import { isEmail, isUrl } from "@/utilities/utilities";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import { HttpDataAddress } from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";
import {
  AmazonS3DataAddress,
  AzureBlobDataAddress,
  DataAddressErrors,
  DataAddressTypes,
  OnRequestDataAddress,
} from "@/utilities/data-address";
import { isValidDate } from "@/utilities/date";
import { AssetProperties, KeyValueInput } from "@/domain/asset/model";

export const validateDataAddress = (
  formDataToValidate: DataAddress,
  translator: (str: string) => string,
) => {
  if (formDataToValidate.type === DataAddressTypes.CustomJson) {
    if (!formDataToValidate.dataAddress) {
      return { dataAddress: true };
    }

    try {
      JSON.parse(formDataToValidate.dataAddress as string);
    } catch {
      return { dataAddress: translator("assets.new.mustBeValidJson") };
    }
  }

  if (formDataToValidate.type === DataAddressTypes.HttpData) {
    const errors: DataAddressErrors<HttpDataAddress> = {};

    if (!formDataToValidate.baseUrl) {
      errors.baseUrl = true;
    } else if (!isUrl(formDataToValidate.baseUrl)) {
      errors.baseUrl = translator("assets.new.mustBeValidUrl");
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.MDSOnRequestOffer) {
    const errors: DataAddressErrors<OnRequestDataAddress> = {};

    if (!formDataToValidate.email) {
      errors.email = true;
    } else if (!isEmail(formDataToValidate.email)) {
      errors.email = translator("assets.new.mustBeValidEmail");
    }

    if (!formDataToValidate.preferred_subject) {
      errors.preferred_subject = true;
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.AmazonS3) {
    const requiredProperties = ["bucketName", "region"];
    const errors: DataAddressErrors<AmazonS3DataAddress> = {};
    requiredProperties.forEach((propertyName) => {
      if (!formDataToValidate[propertyName]) {
        errors[propertyName] = true;
      }
    });

    if (!formDataToValidate.objectPrefix && !formDataToValidate.objectName) {
      errors.objectName = true;
    }

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.AzureStorage) {
    const requiredProperties = ["account", "container", "keyName"];
    const errors: DataAddressErrors<AzureBlobDataAddress> = {};
    requiredProperties.forEach((propertyName) => {
      if (!formDataToValidate[propertyName]) {
        errors[propertyName] = true;
      }
    });

    return errors;
  }

  if (formDataToValidate.type === DataAddressTypes.Kafka) {
    const errors: { oidcDiscoveryUrl?: string } = {};
    if (!isUrl(formDataToValidate.oidcDiscoveryUrl)) {
      errors.oidcDiscoveryUrl = translator("This must be a valid URL");
    }
    return errors;
  }

  return {};
};

export const validateAdvancedInfo = (formDataToValidate: AssetProperties) => {
  const newErrors: { [key: string]: boolean } = {};
  const requiredProperties = [ASSET_ADVANCED_INFO_DATA_CATEGORY];
  requiredProperties.forEach((propertyName) => {
    if (!formDataToValidate[ASSET_ADVANCED_INFO_MOBILITY_THEME][propertyName]) {
      newErrors[propertyName] = true;
    }
  });
  const referencesData = formDataToValidate[ASSET_ADVANCED_INFO_DATA_MODEL][
    ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA
  ][ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] as [];

  const dataSampleData =
    formDataToValidate[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS];

  const allSamplesAreValid = dataSampleData.every((tagInput: KeyValueInput) =>
    isUrl(tagInput.input.value),
  );

  const allReferencesAreValid = referencesData.every(
    (tagInput: KeyValueInput) => isUrl(tagInput.input.value),
  );

  if (!allSamplesAreValid) {
    newErrors[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS] = true;
  }

  if (!allReferencesAreValid) {
    newErrors[ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS] = true;
  }

  const temporalCoverage =
    formDataToValidate[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE];
  const startDate = temporalCoverage[
    ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START
  ] as string;
  const endDate = temporalCoverage[
    ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END
  ] as string;

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    newErrors[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE] = true;
  }

  return newErrors;
};
