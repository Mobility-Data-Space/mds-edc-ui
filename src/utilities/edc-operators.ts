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
  value: 'leq',
  text: '<=',
  tooltip: '<=',
};

export const operatorGreaterThan = {
  value: 'gt',
  text: '>',
  tooltip: '>',
};

export const operatorGreaterThanOrEqual = {
  value: 'gte',
  text: '>=',
  tooltip: '>=',
};

export const operatorHasPart = {
  value: 'hasPart',
  text: 'HAS PART',
  tooltip: 'Has Part',
};

export const operatorIsA = {
  value: 'isA',
  text: 'IS A',
  tooltip: 'Is a',
};

export const operatorIsAnyOf = {
  value: 'isAnyOf',
  text: 'IS ANY OF',
  tooltip: 'Is any of',
};

export const operatorIsAllOf = {
  value: 'isAllOf',
  text: 'IS ALL OF',
  tooltip: 'Is all of',
};

export const operatorIsNoneOf = {
  value: 'isNoneOf',
  text: 'IS NONE OF',
  tooltip: 'Is none of',
};