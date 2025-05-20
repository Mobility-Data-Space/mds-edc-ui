import { AtomicConstraint, Constraint } from "@think-it-labs/edc-connector-client";

export const operatorEquals = {
  value: 'EQ',
  text: '=',
  tooltip: 'Equal to',
}

export const operatorNotEqual = {
  value: 'NEQ',
  text: '≠',
  tooltip: 'Not equal to',
}

export const operatorGreaterThanOrEqual = {
  value: 'GEQ',
  text: '≥',
  tooltip: 'Greater than or equal to',
};

export const operatorGreaterThanOrEqual2 = {
  value: 'GTEQ',
  text: '≥',
  tooltip: 'Greater than or equal to',
};

export const operatorGreaterThan = {
  value: 'GT',
  text: '>',
  tooltip: 'Greater than',
};

export const operatorLessThanOrEqual =   {
  value: 'LEQ',
  text: '≤',
  tooltip: 'Less than or equal to',
};

export const operatorLessThanOrEqual2 =   {
  value: 'LTEQ',
  text: '≤',
  tooltip: 'Less than or equal to',
};

export const operatorLessThan = {
  value: 'LT',
  text: '<',
  tooltip: 'Less than',
};

export const operatorIn = {
  value: 'IN',
  text: 'IN',
  tooltip: 'In',
};

export const operatorHasPart = {
  value: 'HAS_PART',
  text: 'HAS PART',
  tooltip: 'Has Part',
};

export const operatorIsA = {
  value: 'IS_A',
  text: 'IS A',
  tooltip: 'Is a',
};

export const operatorIsOneOf = {
  value: 'IS_NONE_OF',
  text: 'IS NONE OF',
  tooltip: 'Is none of',
};
export const operatorIsAnyOf = {
  value: 'IS_ANY_OF',
  text: 'IS ANY OF',
  tooltip: 'Is any of',
};
export const operatorIsAllOf = {
  value: 'IS_ALL_OF',
  text: 'IS ALL OF',
  tooltip: 'Is all of',
};

export const operators = [ operatorEquals, operatorNotEqual, operatorGreaterThanOrEqual, operatorGreaterThanOrEqual2, operatorGreaterThan, operatorLessThanOrEqual, operatorLessThanOrEqual2, operatorLessThan, operatorIn, operatorHasPart, operatorIsA, operatorIsOneOf, operatorIsAnyOf, operatorIsAllOf ];

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

export const createAndConstraint = (): AndConstraint => ({
  and: [] satisfies (AtomicConstraint|MultiplicityConstraint)[],
});

export const createOrConstraint = (): OrConstraint => ({
  or: [] satisfies (AtomicConstraint|MultiplicityConstraint)[],
});

export const createXOneConstraint = (): XoneConstraint => ({
  xone: [] satisfies (AtomicConstraint|MultiplicityConstraint)[],
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