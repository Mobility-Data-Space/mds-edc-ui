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
  or: Constraint[]
}
export interface AndConstraint extends Constraint {
  and: Constraint[]
}
export interface XoneConstraint extends Constraint {
  xone: Constraint[]
}
export type MultiplicityConstraint = OrConstraint | AndConstraint | XoneConstraint ;
