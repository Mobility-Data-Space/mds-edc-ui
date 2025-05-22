import { DataAddress } from "@think-it-labs/edc-connector-client";

export const DATA_ADDRESS_TYPE_HTTP = {
    value: "HttpData",
    text: 'REST-API Endpoint',
};
export const DATA_ADDRESS_TYPE_DATASINK = {
    value: 'Custom-Datasink-Json',
    text: `Custom Datasink Config (JSON)`,
};

export const DATA_ADDRESS_TYPE_TRANSFER_PROCESS = {
    value: 'Custom-Data-Transfer-Process-Json',
    text: `Custom Transfer Process Request (JSON)`,
};

export const DATA_ADDRESS_TYPE_CUSTOM = {
    value: 'Custom-Data-Address-Json',
    text: `Custom Datasource-create Config (JSON)`,
};

export const DATA_ADDRESS_SELECT_DATA = [ DATA_ADDRESS_TYPE_HTTP, DATA_ADDRESS_TYPE_CUSTOM ];

export const DATA_TRANSFER_TYPE = [ DATA_ADDRESS_TYPE_HTTP, DATA_ADDRESS_TYPE_DATASINK, DATA_ADDRESS_TYPE_TRANSFER_PROCESS ]

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

export const ASSET_DATA_ADDRESS_BASE_URL = "baseUrl"
export const ASSET_DATA_ADDRESS_DESCRIPTION = "description"
export const ASSET_DATA_ADDRESS_QUERY_PARAMS: string = "queryParams"

export const DATA_OFFER_CONTACT_EMAIL = "email"
export const DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT = "preferredEmailSubject"

export const ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION: string = "enableQueryParameterization"
export const ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION = "enableBodyParameterization"

export const ASSET_DATA_ADDRESS_HTTP_HEADERS = "headers"
export const ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD = "proxyMethod"
export const ASSET_DATA_ADDRESS_HTTP_PROXY_PATH = "proxyPath"

export const ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER: string = ""
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE = "authType"
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE = "Value"
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE = ""
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET: string = ""
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME = "authKey"
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE  = "authCode"

export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS = [
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET, text: "assets.new.fieldHttpAuthHeaderTypeWithVaultSecret" },
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE, text: "assets.new.fieldHttpAuthHeaderTypeWithValue" },
];
