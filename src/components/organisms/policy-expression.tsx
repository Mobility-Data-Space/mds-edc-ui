import { TreeBranch } from "@/components/atoms/tree-branch";
import { TreeLeaf } from "@/components/atoms/tree-leaf";
import { Constraint } from "@/components/molecules/constraint";
import { AddConstraintButton } from "@/components/organisms/add-constraint-button";
import { MultiplicityConstraint } from "@/utilities/policy-constraints";
import { Icon, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { ReactNode } from "react";
import * as React from "react";

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

          <IconButton
            size="large"
            onClick={onRemove}
            className="gap-x-2 font-medium float-right"
            color="secondary"
          >
            <Icon
              data-testid="add-expression-button"
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
