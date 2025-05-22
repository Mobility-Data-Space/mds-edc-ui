import {ENGLISH_SELECT_DATA} from "@/constants/languages.ts";
import { AssetInput, BaseDataAddress, HttpDataAddress } from "@think-it-labs/edc-connector-client";

export const CONTEXT_DCT = { prefix: "dct:", value: "http://purl.org/dc/terms/" };
export const CONTEXT_DCAT = { prefix: "dcat:", value: "http://www.w3.org/ns/dcat#" };
export const CONTEXT_MOBILITYDCAT_AP = { prefix: "mobilitydcatap:", value: "https://w3id.org/mobilitydcat-ap/" };
export const CONTEXT_ADMS = { prefix: "adms:", value: "http://www.w3.org/ns/adms#" };
export const CONTEXT_OWL = { prefix: "owl:", value: "http://www.w3.org/2002/07/owl#" };

export const CONTEXT_RDFS = { prefix: "rdfs:", value: "http://www.w3.org/2000/01/rdf-schema#" };
export const CONTEXT_XSD = { prefix: "xsd:", value: "http://www.w3.org/2001/XMLSchema#" };

export const ASSET_TITLE = `${CONTEXT_DCT.value}title`;
export const ASSET_PUBLISHER = `${CONTEXT_DCT.value}publisher`;
export const ASSET_DESCRIPTION = `${CONTEXT_DCT.value}description`;
export const ASSET_LANGUAGE = `${CONTEXT_DCT.value}language`;
export const ASSET_STANDARD_LICENSE = `${CONTEXT_DCT.value}license`;

export const ASSET_KEYWORDS = `${CONTEXT_DCAT.value}keywords`;
export const ASSET_CONTENT_TYPE = `${CONTEXT_DCAT.value}mediaType`;
export const ASSET_ENDPOINT_DOCUMENTATION = `${CONTEXT_DCAT.value}landingPage`;

export const ASSET_VERSION = `${CONTEXT_OWL.value}versionInfo`;

export const ASSET_ADVANCED_INFO_DATA_CATEGORY = `${CONTEXT_MOBILITYDCAT_AP.prefix}mobilityTheme`;
export const ASSET_ADVANCED_INFO_DATA_SUBCATEGORY = "additionalProperties" ; // `${CONTEXT_MOBILITYDCAT_AP.value}mobilityTheme`;
export const ASSET_ADVANCED_INFO_TRANSPORT_MODE = `${CONTEXT_MOBILITYDCAT_AP.prefix}transportMode`;
export const ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD = `${CONTEXT_MOBILITYDCAT_AP.prefix}geoReferenceMethod`;
export const ASSET_ADVANCED_INFO_DATA_MODEL = `${CONTEXT_MOBILITYDCAT_AP.prefix}mobilityDataStandard`;

export const ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY = `${CONTEXT_DCT.value}accrualPeriodicity`;
export const ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME = `${CONTEXT_DCT.value}rightsHolder`;
export const ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE = `${CONTEXT_DCT.value}accessRights`;
export const ASSET_ADVANCED_INFO_GEO_LOCATION = `${CONTEXT_DCAT.value}spatial`;
export const ASSET_ADVANCED_INFO_NUTS_LOCATIONS = `${CONTEXT_DCAT.value}spatial`;
export const ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE = `${CONTEXT_DCT.value}temporal`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS = `${CONTEXT_DCAT.value}referenceFileUrls`;
export const ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION = `${CONTEXT_DCT.value}isReferencedBy`;
export const ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS = `${CONTEXT_ADMS.value}dataSampleUrls`;

