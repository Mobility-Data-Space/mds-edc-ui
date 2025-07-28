// EDC Operator Registry
// https://github.com/eclipse-edc/Connector/blob/main/spi/common/core-spi/src/main/java/org/eclipse/edc/spi/query/CriterionOperatorRegistry.java

export const operatorEqual = {
  value: 'eq',
  text: '=',
  tooltip: 'Equal to',
}

export const operatorNotEqual = {
  value: 'neq',
  text: '!=',
  tooltip: 'Not equal to',
}

export const operatorIn = {
  value: 'isPartOf',
  text: 'IN',
  tooltip: 'In',
};

export const operatorLessThan = {
  value: 'lt',
  text: '<',
  tooltip: '<',
};

export const operatorLessThanOrEqual = {
  value: 'lteq',
  text: '<=',
  tooltip: '<=',
};

export const operatorGreaterThan = {
  value: 'gt',
  text: '>',
  tooltip: '>',
};

export const operatorGreaterThanOrEqual = {
  value: 'gteq',
  text: '>=',
  tooltip: '>=',
};

export const operatorHasPart = {
  value: 'hasPart',
  text: 'Has Part',
  tooltip: 'Has Part',
};

export const operatorIsA = {
  value: 'isA',
  text: 'Is a',
  tooltip: 'Is a',
};

export const operatorIsAnyOf = {
  value: 'isAnyOf',
  text: 'Is any of',
  tooltip: 'Is any of',
};

export const operatorIsAllOf = {
  value: 'isAllOf',
  text: 'IS all of',
  tooltip: 'Is all of',
};

export const operatorIsNoneOf = {
  value: 'isNoneOf',
  text: 'IS none of',
  tooltip: 'Is none of',
};

export const consumerParticipantIdLeft = 'REFERRING_CONNECTOR';
export const consumerParticipantIdOperators = [operatorEqual, operatorIn];

export const timeRestrictionLeft = 'POLICY_EVALUATION_TIME';
export const timeRestrictionOperators = [ operatorGreaterThanOrEqual, operatorGreaterThan, operatorLessThanOrEqual, operatorLessThan]

export const operators = [ operatorEqual, operatorNotEqual, operatorIn, operatorGreaterThanOrEqual, operatorLessThan, operatorLessThanOrEqual, operatorGreaterThan, operatorHasPart, operatorIsA, operatorIsAnyOf, operatorIsAllOf, operatorIsNoneOf ];
