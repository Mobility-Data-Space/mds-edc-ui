import { Asset, ContractDefinition, Dataset } from "@think-it-labs/edc-connector-client";

export const HAS_POLICY = "http://www.w3.org/ns/odrl/2/hasPolicy";

export const datasetToAsset = (dataset: Dataset): Asset => { // TODO: dataSet type
  return {
    // TODO: get only specific values for each field
    ["@id"]: dataset["@id"],
    properties: dataset.properties || { ...dataset },
    dataAddress: dataset.dataAddress || { ...dataset },
    privateProperties: dataset.privateProperties || {},
  } as Asset;
}

export const datasetToContractDefinitions = (dataset: Dataset): ContractDefinition[] => {
  return dataset[HAS_POLICY] || [];
};

export const removeJsonLdSchemaFromProperties = (originalJson: any): any => {
  if (Array.isArray(originalJson)) {
    return originalJson.map(item => removeJsonLdSchemaFromProperties(item));
  }

  if (typeof originalJson !== 'object' || !originalJson) {
    return originalJson;
  }

  const convertedObject: any = {};
  for (const key in originalJson) {
    if (originalJson.hasOwnProperty(key)) {
      const parts = key.split('/');
      const newKey = parts[parts.length - 1];

      if (newKey === 'operator' && typeof originalJson[key]['@id'] === 'string') {
        const operatorParts = originalJson[key]['@id'].split('/');
        convertedObject[newKey] = operatorParts[operatorParts.length - 1];
      } else {
        convertedObject[newKey] = removeJsonLdSchemaFromProperties(originalJson[key]);
      }
    }
  }

  return convertedObject;
}

export const convertOdrlToJsonHtml = (processedJson: any, valueDelimiter = " "): any => {
  if (Array.isArray(processedJson)) {
    return processedJson.map(item => convertOdrlToJsonHtml(item, valueDelimiter));
  }

  if (typeof processedJson !== 'object' || processedJson === null) {
    return processedJson;
  }

  if (
    !! processedJson.leftOperand &&
    !! processedJson.operator &&
    !! processedJson.rightOperand &&
    Object.keys(processedJson).length === 3
  ) {
    return [
      processedJson.leftOperand,
      processedJson.operator.toUpperCase(),
      processedJson.rightOperand,
    ].join(valueDelimiter);
  }

  const htmlObject: any = {};
  for (const key in processedJson) {
    if (processedJson.hasOwnProperty(key)) {
      htmlObject[key] = convertOdrlToJsonHtml(processedJson[key], valueDelimiter);
    }
  }
  return htmlObject;
};

