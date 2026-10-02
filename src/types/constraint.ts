import type { ComponentProps } from "react";
import type { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import type { MultiplicityConstraint } from "@/utilities/policy-constraints";

export interface ConstraintProps {
  value: AtomicConstraint | MultiplicityConstraint,
  onChange: (newValue: AtomicConstraint | MultiplicityConstraint) => void,
  onRemove: () => void,
  participantIdExpressionButtonProps?: ComponentProps<'button'>,
  participantIdFieldProps?: ComponentProps<'input'>,
}
