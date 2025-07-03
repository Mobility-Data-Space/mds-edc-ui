import { 
  operatorIn as edcOperatorIn, 
  operatorEqual as edcOperatorEqual,
  operatorGreaterThanOrEqual as edcOperatorGreaterThanOrEqual, 
  operatorGreaterThan as edcOperatorGreaterThan, 
  operatorLessThanOrEqual as edcOperatorLessThanOrEqual, 
  operatorLessThan as edcOperatorLessThan } from "./edc-operators";

export const operatorEqual = {
  value: 'odrl:eq',
  text: '=',
  tooltip: 'Equal to',
}

export const operatorNotEqual = {
  value: 'odrl:neq',
  text: '≠',
  tooltip: 'Not equal to',
}

export const operatorGreaterThanOrEqual = {
  value: 'odrl:gteq',
  text: '≥',
  tooltip: 'Greater than or equal to',
};

export const operatorGreaterThan = {
  value: 'odrl:gt',
  text: '>',
  tooltip: 'Greater than',
};

export const operatorLessThanOrEqual =   {
  value: 'odrl:lteq',
  text: '≤',
  tooltip: 'Less than or equal to',
};

export const operatorLessThan = {
  value: 'odrl:lt',
  text: '<',
  tooltip: 'Less than',
};

export const operatorHasPart = {
  value: 'odrl:hasPart',
  text: 'HAS PART',
  tooltip: 'Has Part',
};

export const operatorIsA = {
  value: 'odrl:isA',
  text: 'IS A',
  tooltip: 'Is a',
};

export const operatorIsPartOf = {
  value: 'odrl:isPartOf',
  text: 'IS PART OF',
  tooltip: 'Is part of',
};

export const operatorIsAnyOf = {
  value: 'odrl:isAnyOf',
  text: 'IS ANY OF',
  tooltip: 'Is any of',
};

export const operatorIsAllOf = {
  value: 'odrl:isAllOf',
  text: 'IS ALL OF',
  tooltip: 'Is all of',
};

export const andSequenceLeft = 'odrl:andSequence'; // Not used

export const consumerParticipantIdLeft = 'REFERRING_CONNECTOR';
export const consumerParticipantIdOperators = [edcOperatorEqual, edcOperatorIn];

export const timeRestrictionLeft = 'POLICY_EVALUATION_TIME';
export const timeRestrictionOperators = [ edcOperatorGreaterThanOrEqual, edcOperatorGreaterThan, edcOperatorLessThanOrEqual, edcOperatorLessThan]

export const operators = [ operatorEqual, operatorNotEqual, operatorGreaterThanOrEqual, operatorGreaterThan, operatorLessThanOrEqual, operatorLessThan, operatorHasPart, operatorIsA, operatorIsAnyOf, operatorIsAllOf ];
