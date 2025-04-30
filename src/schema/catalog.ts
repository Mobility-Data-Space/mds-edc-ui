import {ASSET_ID} from "@/schema/asset.ts";

export const CATALOG_DATASET = "http://www.w3.org/ns/dcat#dataset";
export const PARTICIPANT_ID = "https://w3id.org/dspace/v0.8/participantId";

export const dataSetToAsset = (dataset: any) => { // TODO: dataSet type

  return {
    // TODO: get only specific values for each field
    [ASSET_ID]: dataset[ASSET_ID],
    properties: dataset.properties || { ...dataset },
    dataAddress: dataset.dataAddress || { ...dataset },
    privateProperties: dataset.privateProperties || {},
  };
}
