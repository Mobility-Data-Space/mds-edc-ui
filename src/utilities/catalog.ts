import {Asset, ContractDefinition, Dataset, JsonLdObject} from "@think-it-labs/edc-connector-client";
import {contextPrefixes} from "@/jsonld/context";
import {formatDateTime} from "@/utilities/date.ts";

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

  if (!! processedJson.action) {
    const action = processedJson.action[0] || processedJson.action;
    const value = action["@id"];
    return `Action${valueDelimiter}:${valueDelimiter}${value}`;
  }

  if (
    !! processedJson.leftOperand &&
    !! processedJson.operator &&
    !! processedJson.rightOperand &&
    Object.keys(processedJson).length === 3
  ) {
    return [
      extractValue(processedJson.leftOperand),
      extractValue(processedJson.operator).toUpperCase(),
      extractValue(processedJson.rightOperand),
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

function extractValue(value: any) {
  if (! Array.isArray(value)) {
    if (typeof value === "object") {
      return value["@id"] || value["@value"] || "";
    }
    return value || "";
  }

  const result = (value[0] && (value[0]["@id"] || value[0]["@value"])) || "";
  if (! result.startsWith("http")) {
    return result;
  }

  const regex = /[/#]?([^/#]+)$/;
  const match = regex.exec(result);
  if (match && match[1]) {
    return match[1];
  }

  return result;
}

export function replaceUrlPrefixes(jsonObject: JsonLdObject) {
  const transformKey = (key: string) => {
    for (const url in contextPrefixes) {
      if (key.startsWith(url)) {
        return key.replace(url, contextPrefixes[url]);
      }
    }
    return key;
  };

  const transformValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map(item => typeof item === 'object' && item !== null ? replaceUrlPrefixes(item) : item);
    }

    if (typeof value === 'object' && value !== null) {
      const newObj: { [key: string]: any } = {};
      for (const k in value) {
        newObj[transformKey(k)] = transformValue(value[k]);
      }
      return newObj;
    }
    return value;
  };

  const newObject: { [key: string]: any } = {};
  for (const key in jsonObject) {
    const newKey = transformKey(key);
    newObject[newKey] = transformValue(jsonObject[key]);
  }

  return newObject;
}
