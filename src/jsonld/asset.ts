import {CONTEXT_DCT, CONTEXT_DCAT, CONTEXT_OWL, CONTEXT_MOBILITYDCAT_AP, CONTEXT_MOBILITYDCAT_AP_THEME, CONTEXT_RDFS, CONTEXT_SKOS, CONTEXT_ADMS} from "@/jsonld/context";

// Asset Properties
export const ASSET_TITLE = `${CONTEXT_DCT.value}title`;
export const ASSET_PUBLISHER = `${CONTEXT_DCT.value}publisher`;
export const ASSET_DESCRIPTION = `${CONTEXT_DCT.value}description`;
export const ASSET_LANGUAGE = `${CONTEXT_DCT.value}language`;
export const ASSET_STANDARD_LICENSE = `${CONTEXT_DCT.value}license`;

export const ASSET_KEYWORDS = `${CONTEXT_DCAT.value}keywords`;
export const ASSET_ORGANIZATION = `${CONTEXT_DCAT.value}organization`;
export const ASSET_CONTENT_TYPE = `${CONTEXT_DCAT.value}mediaType`;
export const ASSET_ENDPOINT_DOCUMENTATION = `${CONTEXT_DCAT.value}landingPage`;

export const ASSET_VERSION = `${CONTEXT_OWL.value}versionInfo`;

export const ASSET_ADVANCED_INFO_MOBILITY_THEME = `${CONTEXT_MOBILITYDCAT_AP.value}mobilityTheme`;
export const ASSET_ADVANCED_INFO_DATA_CATEGORY = `${CONTEXT_MOBILITYDCAT_AP_THEME.value}data-content-category`;
export const ASSET_ADVANCED_INFO_DATA_SUBCATEGORY = `${CONTEXT_MOBILITYDCAT_AP_THEME.value}data-content-sub-category`;

export const ASSET_ADVANCED_INFO_TRANSPORT_MODE = `${CONTEXT_MOBILITYDCAT_AP.value}transportMode`;
export const ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD = `${CONTEXT_MOBILITYDCAT_AP.value}geoReferenceMethod`;
export const ASSET_ADVANCED_INFO_DATA_MODEL = `${CONTEXT_MOBILITYDCAT_AP.value}mobilityDataStandard`;
export const ASSET_ADVANCED_INFO_DATA_MODEL_ID = `@id`;
export const ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA = `${CONTEXT_MOBILITYDCAT_AP.value}schema`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS = `${CONTEXT_DCAT.value}downloadURL`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION = `${CONTEXT_RDFS.value}Literal`;

export const ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY = `${CONTEXT_DCT.value}accrualPeriodicity`;
export const ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE = `${CONTEXT_DCT.value}accessRights`;
export const ASSET_ADVANCED_INFO_GEO_LOCATION = `${CONTEXT_DCT.value}spatial`;
export const ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL = `${CONTEXT_SKOS.value}prefLabel`;
export const ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS = `${CONTEXT_DCT.value}identifier`;

export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE = `${CONTEXT_DCT.value}temporal`;
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START = `${CONTEXT_DCAT.value}start`;
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END = `${CONTEXT_DCAT.value}end`;

export const ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS = `${CONTEXT_ADMS.value}sample`;

// Replaced by DCAT Organization
const ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME = `${CONTEXT_DCT.value}rightsHolder`;


export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS = [
  { value: "Vault-Secret", text: "assets.new.fieldHttpAuthHeaderTypeWithVaultSecret" },
  { value: "Vault", text: "assets.new.fieldHttpAuthHeaderTypeWithValue" }
]
