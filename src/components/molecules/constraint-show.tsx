import React, { ReactNode } from "react";

import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";

import { ShowTreeLeaf } from "@/components/atoms/show-tree-leaf";
import { ShowTreeBranch } from "@/components/atoms/show-tree-branch";

import { useTranslator } from "@/i18n";
import { dateToString, formatDateTime } from "@/utilities/date";
import { isDate, tryTranslatingWithTooltip } from "@/utilities/utilities";
import { operators } from "@/utilities/policy-operators";

interface ConstraintShowProps {
  data: unknown;
  passedFirstLevel?: boolean;
}

function constraintTooltipAndValue(
  value: string,
  index: number,
  translator: (key: string) => string,
) {
  if (index === 1) {
    const valueToLower = value.toLowerCase();
    const operator = operators.find(
      (operator) => operator.value.toLowerCase() === valueToLower,
    );
    return operator ? [operator.tooltip, operator.text] : [value, value];
  }

  if (index === 2) {
    const trimmedValue = value.trim();
    if (!isDate(value)) {
      return [`"${trimmedValue}"`, trimmedValue];
    }

    const date = new Date(value);
    const dateValue = dateToString(date);
    const tooltip = dateValue ? formatDateTime(date.getTime()) : trimmedValue;
    return [`"${tooltip}"`, dateValue || trimmedValue];
  }

  return tryTranslatingWithTooltip(
    value,
    "policyDefinitions.constraint",
    translator,
  );
}

export function ConstraintShow({
  data,
  passedFirstLevel = false,
}: ConstraintShowProps): ReactNode {
  const { translator } = useTranslator();
  if (typeof data === "string") {
    const parts = data.split(",");
    const result = [parts[0], parts[1], parts.slice(2).join(",")];

    return (
      <div className="flex gap-x-2 items-center">
        {result.map((value, index) => {
          const [, computedValue] = constraintTooltipAndValue(
            value,
            index,
            translator,
          );
          

          return (
            <div key={index}>
              {computedValue
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
                .map((value, i) => (
                  <Tooltip title={value} key={`${value}-${i}`}>
                    <Typography  component="div">
                      {value}
                    </Typography>
                  </Tooltip>
                ))}
            </div>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(data)) {
    const lastIndex = data.length - 1;
    return data.map((item, index) => (
      <ShowTreeLeaf disablePadding key={index} hidden={!passedFirstLevel}>
        <div className="pt-2">
          <ConstraintShow passedFirstLevel data={item} />
          {lastIndex !== index ? (
            ""
          ) : (
            <div className="bg-white absolute -left-1 bottom-0 size-2" />
          )}
        </div>
      </ShowTreeLeaf>
    ));
  }

  if (typeof data !== "object" || !data) {
    return data === null || data === undefined ? "" : String(data);
  }

  const html = [];
  const record = data as Record<string, unknown>;
  for (const key in record) {
    const [tooltip] = tryTranslatingWithTooltip(
      key,
      "policyDefinitions.constraint",
      translator,
    );
    html.push(
      <div key={key}>
        <Tooltip title={tooltip}>
          <Typography
            component="span"
            className="p-3 py-1 inline-block uppercase"
          >
            {key}
          </Typography>
        </Tooltip>
        <div>
          <ShowTreeBranch bottomLeafHidden>
            <ConstraintShow data={record[key]} passedFirstLevel />
          </ShowTreeBranch>
        </div>
      </div>,
    );
  }

  return html;
}
