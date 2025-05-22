import {AndConstraint, MultiplicityConstraint, OrConstraint, XoneConstraint} from "@/utilities/constraints";
import * as React from "react";
import {ConstraintProps} from "@/components/molecules/constraint.tsx";
import PolicyExpression from "@/components/organisms/policy-expression.tsx";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";

export function RestrictionConstraint({value, onChange, onRemove}: ConstraintProps) {
  if (value.hasOwnProperty("and")){
    value = value as AndConstraint ;
    return (
      <PolicyExpression
        title="and"
        isFirstLevel={false}
        showAddButton={true}
        value={value.and as (AtomicConstraint|MultiplicityConstraint)[]}
        onChange={(newConstraints) => onChange({...value, and: newConstraints})}
        onRemove={onRemove}
      />
    );
  }else if (value.hasOwnProperty("or")){
    value = value as OrConstraint ;
    return (
      <PolicyExpression
        title="or"
        isFirstLevel={false}
        showAddButton={true}
        value={value.or as (AtomicConstraint|MultiplicityConstraint)[]}
        onChange={(newConstraints) => onChange({...value, or: newConstraints})}
        onRemove={onRemove}
      />
    );
  } else {
    value = value as XoneConstraint ;
    return (
      <PolicyExpression
        title="xone"
        isFirstLevel={false}
        showAddButton={true}
        value={value.xone as (AtomicConstraint|MultiplicityConstraint)[]}
        onChange={(newConstraints) => onChange({...value, xone: newConstraints})}
        onRemove={onRemove}
      />
    );
  }

  
}
