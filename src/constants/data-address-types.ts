export const DATA_ADDRESS_TYPE_HTTP = {
    value: 'Http',
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
