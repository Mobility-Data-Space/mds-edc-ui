import {CriterionInput, EdcConnectorClient} from "@think-it-labs/edc-connector-client";

export const EDC_ID_FIELD = "https://w3id.org/edc/v0.0.1/ns/id"

export const operatorEqual = {
  value: '=',
  text: 'Equal',
  tooltip: 'Equal',
};

export const operatorLike = {
  value: 'like',
  text: 'Like',
  tooltip: 'Like',
};

export const operatorIn = {
  value: 'in',
  text: 'In',
  tooltip: 'In',
};

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
  return [
    {
      operandLeft: EDC_ID_FIELD,
      operator: operatorIn.value,
      operandRight: transformIdsToString(ids)
    }
  ]
};

export const transformIdsToString = (ids: string[]): string => {
  return ids.join(",");
};

export const idMultipleReader = (criteria: CriterionInput[]): string[] => {
  return criteria?.at(0)?.operandRight.split(",") || [];
}

export const generateDataOfferId = (existingIds: string[] = []): string => {
  const prefix = "mds-data-offer-";
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const datePrefix = `${day}${month}${year}`;

  // Find existing IDs for today - only look at mds-data-offer IDs for the current date
  const todayIds = existingIds
    .filter(id => id.startsWith(`${prefix}${datePrefix}_`))
    .map(id => {
      const uidPart = id.substring(`${prefix}${datePrefix}_`.length);
      return parseInt(uidPart, 10);
    })
    .filter(uid => !isNaN(uid))
    .sort((a, b) => b - a); // Sort descending to get highest first
  
  const nextUid = todayIds.length > 0 ? todayIds[0] + 1 : 1;
  console.log("next uid is ", nextUid)
  return `${prefix}${datePrefix}_${nextUid}`;
};
