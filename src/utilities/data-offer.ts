import {CriterionInput} from "@think-it-labs/edc-connector-client";
import {operatorIn} from "@/utilities/policy-constraints";

export const idSelector = (id: string): CriterionInput[] => {
  return [
    {
      operandLeft: "@id",
      operator: operatorIn.value,
      operandRight: id
    }
  ]
};

export const idReader = (criteria: CriterionInput[]) => {
  return criteria[0]?.operandRight || "";
}
