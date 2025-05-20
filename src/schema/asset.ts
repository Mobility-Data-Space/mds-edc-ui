import {ENGLISH_SELECT_DATA} from "@/constants/languages.ts";
import { AssetInput, BaseDataAddress, HttpDataAddress } from "@think-it-labs/edc-connector-client";

export const CONTEXT_DCT = { prefix: "dct", value: "http://purl.org/dc/terms/" };
export const CONTEXT_DCAT = { prefix: "dcat", value: "http://www.w3.org/ns/dcat#" };
export const CONTEXT_IDS = { prefix: "ids", value: "https://w3id.org/idsa/core/" };
export const CONTEXT_IDSM = { prefix: "idsm", value: "https://w3id.org/idsa/metamodel/" };
export const CONTEXT_OWL = { prefix: "owl", value: "http://www.w3.org/2002/07/owl#" };
export const CONTEXT_RDF = { prefix: "rdf", value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" };
export const CONTEXT_RDFS = { prefix: "rdfs", value: "http://www.w3.org/2000/01/rdf-schema#" };
export const CONTEXT_XSD = { prefix: "xsd", value: "http://www.w3.org/2001/XMLSchema#" };
export const CONTEXT_DBPEDIA = { prefix: "dbpedia", value: "http://dbpedia.org/ontology/" };

export const CONTEXT_MDS = { prefix: "mds", value: "http://w3id.org/mds#" };

export const ASSET_TITLE = `${CONTEXT_DCT.value}title`;
export const ASSET_VERSION = `${CONTEXT_DCAT.value}version`;

export const ASSET_DESCRIPTION = `${CONTEXT_DCAT.value}description`;
export const ASSET_KEYWORDS = `${CONTEXT_DCAT.value}keyword`;
export const ASSET_LANGUAGE = `${CONTEXT_DCAT.value}language`;
export const ASSET_CONTENT_TYPE = `${CONTEXT_DCAT.value}mediaType`;
export const ASSET_ENDPOINT_DOCUMENTATION = `${CONTEXT_DCAT.value}endpointDocumentation`;
export const ASSET_PUBLISHER = `${CONTEXT_DCAT.value}publisher`;
export const ASSET_STANDARD_LICENSE = `${CONTEXT_DCAT.value}license`;

export const DATA_OFFER_TYPE = `${CONTEXT_DCAT.value}dataSourceAvailability`;
export const DATA_OFFER_CONTACT_EMAIL = `${CONTEXT_DCAT.value}contactEmail`;
export const DATA_OFFER_CONTACT_PREFERRED_EMAIL_SUBJECT = `${CONTEXT_DCAT.value}contactPreferredEmailSubject`;
export const DATA_OFFER_PUBLISH_MODE = `${CONTEXT_DCAT.value}publishMode`;
export const DATA_OFFER_CONSTRAINTS = `${CONTEXT_DCAT.value}constraints`;

export const ASSET_ADVANCED_INFO_DATA_CATEGORY = `${CONTEXT_MDS.value}dataCategory`;
export const ASSET_ADVANCED_INFO_DATA_SUBCATEGORY = `${CONTEXT_MDS.value}dataSubcategory`;
export const ASSET_ADVANCED_INFO_TRANSPORT_MODE = `${CONTEXT_MDS.value}transportMode`;
export const ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD = `${CONTEXT_MDS.value}geoReferenceMethod`;
export const ASSET_ADVANCED_INFO_DATA_MODEL = `${CONTEXT_MDS.value}dataModel`;
export const ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME = `${CONTEXT_DCAT.value}sovereignLegalName`;
export const ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY = `${CONTEXT_DCAT.value}dataUpdateFrequency`;
export const ASSET_ADVANCED_INFO_GEO_LOCATION = `${CONTEXT_DCAT.value}geoLocation`;
export const ASSET_ADVANCED_INFO_NUTS_LOCATIONS = `${CONTEXT_DCAT.value}nutsLocations`;
export const ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS = `${CONTEXT_DCAT.value}dataSampleUrls`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS = `${CONTEXT_DCAT.value}referenceFileUrls`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION = `${CONTEXT_DCAT.value}referenceFilesDescription`;
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE = `${CONTEXT_DCAT.value}temporalCoverage`;
export const ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE = `${CONTEXT_DCAT.value}conditionsForUse`;

export const ASSET_DATA_ADDRESS_TYPE = "type";
export const ASSET_DATA_ADDRESS_METHOD = "method";
export const ASSET_DATA_ADDRESS_HTTP_PROXY_PATH = "httpProxyPath";

export const ASSET_DATA_ADDRESS_DESCRIPTION = `${CONTEXT_DCAT.value}description`;
export const ASSET_DATA_ADDRESS_HTTP_PROXY_METHOD = `${CONTEXT_DCAT.value}httpProxyMethod`;
export const ASSET_DATA_ADDRESS_BASE_URL = `${CONTEXT_DCAT.value}baseUrl`;
export const ASSET_DATA_ADDRESS_QUERY_PARAMS = `${CONTEXT_DCAT.value}queryParams`;
export const ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION = `${CONTEXT_DCAT.value}enableQueryParameterization`;
export const ASSET_DATA_ADDRESS_ENABLE_BODY_PARAMETERIZATION = `${CONTEXT_DCAT.value}enableBodyParameterization`;

export const ASSET_DATA_ADDRESS_HTTP_HEADERS = `${CONTEXT_DCAT.value}httpHeaders`;
export const ASSET_DATA_ADDRESS_HTTP_AUTH_ADD_HEADER = `${CONTEXT_DCAT.value}httpAuthAddHeader`;
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE = `${CONTEXT_DCAT.value}httpAuthHeaderType`;
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_NAME = `${CONTEXT_DCAT.value}httpAuthHeaderName`;
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_VALUE = `${CONTEXT_DCAT.value}httpAuthHeaderValue`;
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_NONE = "None";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET = "Vault-Secret";
export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE = "Value"

export const ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS = [
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET, text: "assets.new.fieldHttpAuthHeaderTypeWithVaultSecret" },
  { value: ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VALUE, text: "assets.new.fieldHttpAuthHeaderTypeWithValue" },
];
