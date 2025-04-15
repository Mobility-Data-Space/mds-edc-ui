import {
  andLeft,
  ConstraintType,
  consumerParticipantIdLeft,
  orLeft,
  timeRestrictionLeft,
  xOneLeft
} from "@/constants/constraints.ts";
import * as React from "react";
import {ConsumerParticipantIdConstraint} from "@/components/molecules/consumer-participant-id-constraint.tsx";
import {TimeRestrictionConstraint} from "@/components/molecules/time-restriction-constraint.tsx";
import {RestrictionConstraint} from "@/components/molecules/restriction-constraint.tsx";

export interface ConstraintProps {
  value: ConstraintType,
  onChange: (newValue: ConstraintType) => void,
  onRemove: () => void,
}
export const Constraint = ({value, onChange, onRemove}: ConstraintProps) => {
  if (value.left === consumerParticipantIdLeft) {
    return (
      <ConsumerParticipantIdConstraint
        value={value}
        onChange={onChange}
        onRemove={onRemove}
      />
    );
  }

  if (value.left === timeRestrictionLeft) {
    return (
      <TimeRestrictionConstraint
        value={value}
        onChange={onChange}
        onRemove={onRemove}
      />
    );
  }

  if ([andLeft, orLeft, xOneLeft].includes(value.left)) {
    return (
      <RestrictionConstraint
        value={value}
        onChange={onChange}
        onRemove={onRemove}
      />
    );
  }

  return <></>;
};
