import {
  CriterionInput,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";

export const EDC_ID_FIELD = "https://w3id.org/edc/v0.0.1/ns/id";

export const operatorEqual = {
  value: "=",
  text: "Equal",
  tooltip: "Equal",
};

export const operatorLike = {
  value: "like",
  text: "Like",
  tooltip: "Like",
};

export const operatorIn = {
  value: "in",
  text: "In",
  tooltip: "In",
};

export const idSelector = (id: string): CriterionInput[] => {
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: operatorIn.value,
      operandRight: id,
    },
  ];
};

export const idMultipleSelector = (ids: string[]): CriterionInput[] => {
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: operatorIn.value,
      operandRight: transformIdsToString(ids),
    },
  ];
};

export const transformIdsToString = (ids: string[]): string => {
  return ids.join(",");
};

export const idMultipleReader = (criteria: CriterionInput[]): string[] => {
  const values: string[] = criteria?.at(0)?.operandRight.split(",") || [];
  return values.filter((values) => !!values);
};
