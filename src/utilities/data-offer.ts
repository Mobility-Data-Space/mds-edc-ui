import {CriterionInput} from "@think-it-labs/edc-connector-client";
import { operatorIn } from "./edc-operators";

const EDC_ID_FIELD = "https://w3id.org/edc/v0.0.1/ns/id"
export const idSelector = (id: string): CriterionInput[] => {
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: operatorIn.value,
      operandRight: id
    }
  ]
};

export const idMultipleSelector = (ids: string[]): CriterionInput[] => {
  return ids.map(id => ({
    operandLeft: EDC_ID_FIELD,
    operator: operatorIn.value,
    operandRight: id
  }));
};

export const idReader = (criteria: CriterionInput[]) => {
  return criteria[0]?.operandRight || "";
}

export const idMultipleReader = (criteria: CriterionInput[]) => {
  return criteria.map(value => value?.operandRight || "");
}
