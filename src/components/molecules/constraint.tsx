import * as React from "react";

import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

import {ConsumerParticipantIdConstraint} from "@/components/molecules/consumer-participant-id-constraint";
import {TimeRestrictionConstraint} from "@/components/molecules/time-restriction-constraint";
import {RestrictionConstraint} from "@/components/molecules/restriction-constraint";

import {
  consumerParticipantIdLeft,
  MultiplicityConstraint,
  timeRestrictionLeft
} from "@/utilities/policy-constraints";


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
