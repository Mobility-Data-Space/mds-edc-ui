import { DataAddressTypes } from "@/utilities/data-address";

export const DATA_ADDRESS_TYPE_HTTP = {
  value: DataAddressTypes.HttpData,
  text: 'REST-API Endpoint',
};

export const DATA_ADDRESS_TYPE_S3 = {
  value: DataAddressTypes.AmazonS3,
  text: 'Amazon S3',
};

export const DATA_ADDRESS_TYPE_AZURE = {
  value: DataAddressTypes.AzureBlob,
  text: 'Azure Blob Storage',
};

export const DATA_ADDRESS_TYPE_ON_REQUEST = {
  value: DataAddressTypes.MDSOnRequestOffer,
  text: 'On Request',
};

export const DATA_ADDRESS_TYPE_CUSTOM_JSON = {
  value: DataAddressTypes.CustomJson,
  text: `Custom Json Data Address (JSON)`,
};

export const DATA_ADDRESS_SELECT_DATA = [
  DATA_ADDRESS_TYPE_HTTP,
  DATA_ADDRESS_TYPE_CUSTOM_JSON,
  DATA_ADDRESS_TYPE_S3,
  DATA_ADDRESS_TYPE_AZURE,
  DATA_ADDRESS_TYPE_ON_REQUEST
];

export const DATA_OFFER_TYPE_DATA_SOURCE = {
  text: 'Available (with data source)',
  value: 'Datasource',
};

export const DATA_OFFER_TYPE_ON_REQUEST = {
  text: 'On Request (without data source)',
  value: 'On-Request',
};

export const DATA_OFFER_TYPE_LIVE = {
  text: 'LIVE',
  value: 'LIVE',
};

export const DATA_OFFER_TYPES = [DATA_OFFER_TYPE_DATA_SOURCE, DATA_OFFER_TYPE_ON_REQUEST];

export const PUBLISH_MODE_PUBLISH_UNRESTRICTED = {
  text: "Publish unrestricted",
  value: "PUBLISH_UNRESTRICTED",
  tooltip: "Your data offer is published and can be accessed by everyone.",
};

export const PUBLISH_MODE_PUBLISH_RESTRICTED = {
  text: "Publish restricted",
  value: "PUBLISH_RESTRICTED",
  tooltip: "Your data offer is published with restrictions of your choice.",
};

export const PUBLISH_MODE_DO_NOT_PUBLISH = {
  text: "Create asset only (without data offer)",
  value: "DO_NOT_PUBLISH",
  tooltip: "Create the asset but do not publish your data offer. You can do it later.",
};

export const PUBLISH_MODES = [PUBLISH_MODE_PUBLISH_UNRESTRICTED, PUBLISH_MODE_PUBLISH_RESTRICTED, PUBLISH_MODE_DO_NOT_PUBLISH];
