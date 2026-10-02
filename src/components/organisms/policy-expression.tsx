import { TreeBranch } from "@/components/atoms/tree-branch";
import { TreeLeaf } from "@/components/atoms/tree-leaf";
import { ConsumerParticipantIdConstraint } from "@/components/molecules/consumer-participant-id-constraint";
import { TimeRestrictionConstraint } from "@/components/molecules/time-restriction-constraint";
import { AddConstraintButton } from "@/components/organisms/add-constraint-button";
import type { ConstraintProps } from "@/types/constraint";
import { useTranslator } from "@/i18n";
import { MultiplicityConstraint } from "@/utilities/policy-constraints";
import { consumerParticipantIdLeft, timeRestrictionLeft } from "@/utilities/policy-operators";
import { Icon, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { ReactNode } from "react";
import * as React from "react";

// Constraint, MultiplicityConstraintExpression and PolicyExpression render each other recursively, so they share a module.
function Constraint({ value, onChange, onRemove, participantIdExpressionButtonProps, participantIdFieldProps }: ConstraintProps) {
  if ("leftOperand" in value) {
    if (value.leftOperand === consumerParticipantIdLeft) {
      return (
        <ConsumerParticipantIdConstraint
          value={value}
          onChange={onChange}
          onRemove={onRemove}
          participantIdExpressionButtonProps={participantIdExpressionButtonProps}
          participantIdFieldProps={participantIdFieldProps}
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

  return (
    <MultiplicityConstraintExpression
      value={value as MultiplicityConstraint}
      onChange={onChange}
      onRemove={onRemove}
    />
  );
}

interface MultiplicityConstraintExpressionProps {
  value: MultiplicityConstraint;
  onChange: (newValue: MultiplicityConstraint) => void;
  onRemove: () => void;
}

function MultiplicityConstraintExpression({ value, onChange, onRemove }: MultiplicityConstraintExpressionProps) {
  const operator = "and" in value ? "and" : "or" in value ? "or" : "xone";
  const constraints = (value as Record<typeof operator, (AtomicConstraint | MultiplicityConstraint)[]>)[operator];

  return (
    <PolicyExpression
      title={operator}
      isFirstLevel={false}
      showAddButton={true}
      value={constraints}
      onChange={(newConstraints) => onChange({ ...value, [operator]: newConstraints } as MultiplicityConstraint)}
      onRemove={onRemove}
    />
  );
}

export interface PolicyExpressionProps {
  value: (AtomicConstraint | MultiplicityConstraint)[];
  onChange: (newValue: (AtomicConstraint | MultiplicityConstraint)[]) => void;
  onRemove?: () => void;
  title?: ReactNode;
  isFirstLevel?: boolean;
  showAddButton?: boolean;
}

export default function PolicyExpression({
  value,
  onChange,
  onRemove,
  title = "",
  isFirstLevel = true,
  showAddButton = false,
}: PolicyExpressionProps) {
  const { translator } = useTranslator();
  const resolvedShowAddButton =
    showAddButton || (isFirstLevel && value.length === 0);
  const hideVerticalAndHorizontalLine = isFirstLevel && value.length <= 1;

  const createOnChange =
    (index: number) =>
    (newConstraint: AtomicConstraint | MultiplicityConstraint) => {
      const result = [...value];
      result[index] = newConstraint;
      return onChange(result);
    };

  const createOnRemove = (index: number) => () => {
    const result = [...value];
    result.splice(index, 1);
    return onChange(result);
  };

  const onAdd = (newConstraint: AtomicConstraint | MultiplicityConstraint) =>
    onChange([...value, newConstraint]);

  return (
    <div>
      {!title ? (
        ""
      ) : (
        <div className="pb-4">
          <Typography component="span" className="p-3 inline-block uppercase">
            {title}
          </Typography>

          <IconButton aria-label={translator("common.remove")}
            size="large"
            onClick={onRemove}
            className="gap-x-2 font-medium float-right"
            color="secondary"
          >
            <Icon
              data-testid="remove-expression-button"
              style={{ fontSize: "28px" }}
            >
              remove
            </Icon>
          </IconButton>
        </div>
      )}
      <TreeBranch hidden={hideVerticalAndHorizontalLine}>
        {!value || value.length === 0
          ? ""
          : value.map((constraint, index) => (
              <TreeLeaf key={index} hidden={hideVerticalAndHorizontalLine}>
                <Constraint
                  value={constraint}
                  onChange={createOnChange(index)}
                  onRemove={createOnRemove(index)}
                />
              </TreeLeaf>
            ))}

        {!resolvedShowAddButton ? (
          ""
        ) : (
          <TreeLeaf hidden>
            <AddConstraintButton
              onClick={onAdd}
              showAddButton={resolvedShowAddButton}
            />
          </TreeLeaf>
        )}
      </TreeBranch>
    </div>
  );
}
