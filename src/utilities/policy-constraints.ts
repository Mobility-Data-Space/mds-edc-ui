import { AtomicConstraint, Constraint } from "@think-it-labs/edc-connector-client";

import { consumerParticipantIdLeft, operatorIn, operatorLessThan, timeRestrictionLeft } from "./policy-operators";

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
    createTimeRestrictionConstraint(startDate, operatorLessThan.value),
    createTimeRestrictionConstraint(endDate, operatorLessThan.value)
  ],
});

export interface OrConstraint extends Constraint {
  or: (AtomicConstraint | MultiplicityConstraint)[]
}
export interface AndConstraint extends Constraint {
  and: (AtomicConstraint | MultiplicityConstraint)[]
}
export interface XoneConstraint extends Constraint {
  xone: (AtomicConstraint | MultiplicityConstraint)[]
}
export type MultiplicityConstraint = OrConstraint | AndConstraint | XoneConstraint;

export function isAtomicConstraint(constraint: Constraint): constraint is AtomicConstraint {
  return (
    typeof (constraint as AtomicConstraint).leftOperand === 'string' &&
    typeof (constraint as AtomicConstraint).operator === 'string' &&
    typeof (constraint as AtomicConstraint).rightOperand === 'string'
  );
}

export function isMultiplicityConstraint(constraint: Constraint): constraint is MultiplicityConstraint {
  return (
    (Array.isArray((constraint as OrConstraint).or)) ||
    (Array.isArray((constraint as AndConstraint).and)) ||
    (Array.isArray((constraint as XoneConstraint).xone))
  );
}

export function isOrConstraint(constraint: MultiplicityConstraint): constraint is OrConstraint {
  return Array.isArray((constraint as OrConstraint).or);
}

export function isAndConstraint(constraint: MultiplicityConstraint): constraint is AndConstraint {
  return Array.isArray((constraint as AndConstraint).and);
}

export function isXoneConstraint(constraint: MultiplicityConstraint): constraint is XoneConstraint {
  return Array.isArray((constraint as XoneConstraint).xone);
}
