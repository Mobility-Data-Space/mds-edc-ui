import {ASSET_ID} from "@/schema/asset.ts";

export const HAS_POLICY = "http://www.w3.org/ns/odrl/2/hasPolicy";

export const dataSetToAsset = (dataset: any) => { // TODO: dataSet type

  return {
    // TODO: get only specific values for each field
    [ASSET_ID]: dataset[ASSET_ID],
    properties: dataset.properties || { ...dataset },
    dataAddress: dataset.dataAddress || { ...dataset },
    privateProperties: dataset.privateProperties || {},
  };
}

export const dataSetToContractDefinitions = (dataset: any) => {
  return dataset[HAS_POLICY] || [];
};
