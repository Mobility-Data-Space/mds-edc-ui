import {
  Asset,
  Dataset,
  JsonLdObject,
} from "@think-it-labs/edc-connector-client";
import { PROTOCOL_PATH } from "@/constants/catalog";

// A JSON-LD value node, or (in expanded form) an array of them.
type ValueNode = {
  "@id"?: string;
  "@value"?: string;
  [index: number]: ValueNode | undefined;
};

type OdrlNode = Record<string, unknown> & { action?: ValueNode };

export const HAS_POLICY = "http://www.w3.org/ns/odrl/2/hasPolicy";

export const datasetToAsset = (dataset: Dataset): Asset => {
  // TODO: dataSet type
  return {
    ["@id"]: dataset["@id"],
    properties: dataset.properties || { ...dataset },
    dataAddress: dataset.dataAddress || {},
    privateProperties: dataset.privateProperties || {},
  } as Asset;
};

export const removeJsonLdSchemaFromProperties = <T = JsonLdObject>(
  json: unknown,
  keepKeys = false,
): T => {
  if (Array.isArray(json)) {
    return json.map((item) => removeJsonLdSchemaFromProperties(item)) as T;
  }

  if (typeof json !== "object" || !json) {
    return json as T;
  }

  const originalJson = json as Record<string, unknown>;
  const convertedObject: Record<string, unknown> = {};
  for (const key in originalJson) {
    if (originalJson.hasOwnProperty(key)) {
      const parts = key.split("/");
      const newKey = parts[parts.length - 1];

      const operatorId =
        newKey === "operator"
          ? (originalJson[key] as { "@id"?: unknown })["@id"]
          : undefined;
      if (typeof operatorId === "string") {
        const operatorParts = operatorId.split("/");
        convertedObject[keepKeys ? key : newKey] =
          operatorParts[operatorParts.length - 1];
      } else {
        convertedObject[keepKeys ? key : newKey] =
          removeJsonLdSchemaFromProperties(originalJson[key]);
      }
    }
  }

  return convertedObject as T;
};

export const convertOdrlToJsonHtml = (
  json: unknown,
  valueDelimiter = " ",
): unknown => {
  if (Array.isArray(json)) {
    return json.map((item) =>
      convertOdrlToJsonHtml(item, valueDelimiter),
    );
  }

  if (typeof json !== "object" || json === null) {
    return json;
  }

  const processedJson = json as OdrlNode;

  if (!!processedJson.action) {
    const action = processedJson.action[0] || processedJson.action;
    const value = action["@id"];
    return `Action${valueDelimiter}:${valueDelimiter}${value}`;
  }

  if (
    !!processedJson.leftOperand &&
    !!processedJson.operator &&
    !!processedJson.rightOperand &&
    Object.keys(processedJson).length === 3
  ) {
    return [
      extractValue(processedJson.leftOperand),
      extractValue(processedJson.operator).toUpperCase(),
      extractValue(processedJson.rightOperand),
    ].join(valueDelimiter);
  }

  const htmlObject: Record<string, unknown> = {};
  for (const key in processedJson) {
    if (processedJson.hasOwnProperty(key)) {
      htmlObject[key] = convertOdrlToJsonHtml(
        processedJson[key],
        valueDelimiter,
      );
    }
  }
  return htmlObject;
};

function extractValue(value: unknown): string {
  if (!Array.isArray(value)) {
    if (typeof value === "object") {
      const node = value as ValueNode;
      return node["@id"] || node["@value"] || "";
    }
    return (value as string) || "";
  }

  const first = (value as ValueNode[])[0];
  const result = (first && (first["@id"] || first["@value"])) || "";
  if (!result.startsWith("http")) {
    return result;
  }

  const regex = /[/#]?([^/#]+)$/;
  const match = regex.exec(result);
  if (match && match[1]) {
    return match[1];
  }

  return result;
}

export const counterPartyAddressWithDsp2025_1 = (
  counterPartyAddress: string,
) => {
  if (!counterPartyAddress.endsWith(PROTOCOL_PATH)) {
    return counterPartyAddress.replace(/\/+$/, "") + PROTOCOL_PATH;
  }

  return counterPartyAddress;
};
