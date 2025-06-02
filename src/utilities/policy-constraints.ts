import { AtomicConstraint, Constraint } from "@think-it-labs/edc-connector-client";

export const operatorEquals = {
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

export const operatorIn = {
  value: 'in',
  text: 'IN',
  tooltip: 'In',
};

export const operatorHasPart = {
  value: 'odrl:has_part',
  text: 'HAS PART',
  tooltip: 'Has Part',
};

export const operatorIsA = {
  value: 'odRl:is_a',
  text: 'IS A',
  tooltip: 'Is a',
};

export const operatorIsOneOf = {
  value: 'odrl:is_none_of',
  text: 'IS NONE OF',
  tooltip: 'Is none of',
};

export const operatorIsAnyOf = {
  value: 'odrl:is_any_of',
  text: 'IS ANY OF',
  tooltip: 'Is any of',
};

export const operatorIsAllOf = {
  value: 'odrl:is_all_of',
  text: 'IS ALL OF',
  tooltip: 'Is all of',
};

export const operators = [ operatorEquals, operatorNotEqual, operatorGreaterThanOrEqual, operatorGreaterThan, operatorLessThanOrEqual, operatorLessThan, operatorIn, operatorHasPart, operatorIsA, operatorIsOneOf, operatorIsAnyOf, operatorIsAllOf ];

export const consumerParticipantIdOperators = [operatorEquals, operatorIn];

export const timeRestrictionOperators = [ operatorGreaterThanOrEqual, operatorGreaterThan, operatorLessThanOrEqual, operatorLessThan]

export const consumerParticipantIdLeft = 'REFERRING_CONNECTOR';
export const timeRestrictionLeft = 'POLICY_EVALUATION_TIME';
export const andLeft = 'AND';
export const orLeft = 'OR';
export const xOneLeft = 'XONE';

export const multipleConstraints = [andLeft, orLeft, xOneLeft];

export const createParticipantIdConstraint = (): AtomicConstraint => ({
  leftOperand: consumerParticipantIdLeft,
  operator: operatorIn.value,
  rightOperand: "",
});

export const createTimeRestrictionConstraint = (rightOperand = "", operator = operatorLessThan.value): AtomicConstraint => ({
  leftOperand: timeRestrictionLeft,
  operator,
  rightOperand,
});

// Multi
export const createTimespanAndConstraint = ([startDate, endDate]: [string, string]): AndConstraint => ({
  and: [
    createTimeRestrictionConstraint(startDate, operatorGreaterThanOrEqual.value), 
    createTimeRestrictionConstraint(endDate, operatorLessThanOrEqual.value)
  ],
});

export interface OrConstraint extends Constraint {
  or: Constraint[]
}
export interface AndConstraint extends Constraint {
  and: Constraint[]
}
export interface XoneConstraint extends Constraint {
  xone: Constraint[]
}
export type MultiplicityConstraint = OrConstraint | AndConstraint | XoneConstraint ;