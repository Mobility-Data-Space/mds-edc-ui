import { CriterionInput } from "@think-it-labs/edc-connector-client";

export const EDC_ID_FIELD = "https://w3id.org/edc/v0.0.1/ns/id";

// QuerySpec criterion operators, distinct from the ODRL operators in policy-operators.ts.
export const criterionOperatorEqual = "=";
export const criterionOperatorIn = "in";

export const idSelector = (id: string): CriterionInput[] => {
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: criterionOperatorIn,
      operandRight: id,
    },
  ];
};

export const idMultipleSelector = (ids: string[]): CriterionInput[] => {
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: criterionOperatorIn,
      operandRight: transformIdsToString(ids),
    },
  ];
};

const transformIdsToString = (ids: string[]): string => {
  return ids.join(",");
};

export const idMultipleReader = (criteria: CriterionInput[]): string[] => {
  const values: string[] = criteria?.at(0)?.operandRight.split(",") || [];
  return values.filter((values) => !!values);
};
