import {
  andLeft,

  consumerParticipantIdLeft,
  MultiplicityConstraint,
  orLeft,
  timeRestrictionLeft,
  xOneLeft
} from "@/utilities/constraints";
import * as React from "react";
import {ConsumerParticipantIdConstraint} from "@/components/molecules/consumer-participant-id-constraint.tsx";
import {TimeRestrictionConstraint} from "@/components/molecules/time-restriction-constraint.tsx";
import {RestrictionConstraint} from "@/components/molecules/restriction-constraint.tsx";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

export interface ConstraintProps {
  value: AtomicConstraint|MultiplicityConstraint,
  onChange: (newValue: AtomicConstraint|MultiplicityConstraint) => void,
  onRemove: () => void,
}
export const Constraint = ({value, onChange, onRemove}: ConstraintProps) => {
  if(value.hasOwnProperty("leftOperand")){
    value = value as AtomicConstraint ;

    if (value.leftOperand === consumerParticipantIdLeft) {
      return (
        <ConsumerParticipantIdConstraint
          value={value}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    }

    if (value.leftOperand === timeRestrictionLeft) {
      return (
        <TimeRestrictionConstraint
          value={value}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    }
  }
  
  // MultiplicityConstraint
  return (
    <RestrictionConstraint
      value={value}
      onChange={onChange}
      onRemove={onRemove}
    />
  );
};
