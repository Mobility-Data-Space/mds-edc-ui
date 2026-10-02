import { ENGLISH_SELECT_DATA } from "@/constants/languages";
import {
  ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
  ASSET_ADVANCED_INFO_DATA_CATEGORY,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_ID,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_DATA_SUBCATEGORY,
  ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  ASSET_ADVANCED_INFO_GEO_LOCATION,
  ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL,
  ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS,
  ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
  ASSET_ADVANCED_INFO_MOBILITY_THEME,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START,
  ASSET_ADVANCED_INFO_TRANSPORT_MODE,
  ASSET_CONTENT_TYPE,
  ASSET_DESCRIPTION,
  ASSET_ENDPOINT_DOCUMENTATION,
  ASSET_KEYWORDS,
  ASSET_LANGUAGE,
  ASSET_ORGANIZATION,
  ASSET_PUBLISHER,
  ASSET_STANDARD_LICENSE,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/jsonld/asset";
import { AssetInput } from "@think-it-labs/edc-connector-client";
import { defaultHttpSourceDataAddress } from "@/utilities/data-address";

export type KeyValueInput = {
  input: { key?: string; value: string };
  valid: boolean;
  id: string;
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
      [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: "",
    },

    [ASSET_ADVANCED_INFO_TRANSPORT_MODE]: "",
    [ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]: "",

    [ASSET_ADVANCED_INFO_DATA_MODEL]: {
      [ASSET_ADVANCED_INFO_DATA_MODEL_ID]: "",
      [ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA]: {
        [ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]: [],
        [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: "",
      },
    },
    [ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]: "",
    [ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]: "",
    [ASSET_ADVANCED_INFO_GEO_LOCATION]: {
      [ASSET_ADVANCED_INFO_GEO_LOCATION_LABEL]: "",
      [ASSET_ADVANCED_INFO_GEO_LOCATION_NUTS]: [] as KeyValueInput[],
    },

    [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: [] as KeyValueInput[],

    [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: {
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_START]: "",
      [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE_END]: "",
    },

    [ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]: "",
  },
  privateProperties: {},
  dataAddress: defaultHttpSourceDataAddress,
};

export type AssetProperties = typeof defaultCreateAssetFormData.properties;

export const generateId = (title?: string, version?: string) => {
  const transformedVersion = transformForId(version);
  return (
    transformForId(title) + (transformedVersion ? `-${transformedVersion}` : "")
  );
};

const transformForId = (str?: string) => {
  return (str ?? "")
    .trim()
    .replace(":", "-")
    .replaceAll(" ", "-")
    .toLowerCase();
};
