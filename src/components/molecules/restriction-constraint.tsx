import {ConstraintType} from "@/constants/constraints.ts";
import * as React from "react";
import {ConstraintProps} from "@/components/molecules/constraint.tsx";
import PolicyExpression from "@/components/organisms/policy-expression.tsx";

export function RestrictionConstraint({value, onChange, onRemove}: ConstraintProps) {
  return (
    <PolicyExpression
      title={value.left}
      isFirstLevel={false}
      showAddButton={true}
      value={value.right as ConstraintType[]}
      onChange={(newConstraints) => onChange({...value, right: newConstraints})}
      onRemove={onRemove}
    />
  );
}
