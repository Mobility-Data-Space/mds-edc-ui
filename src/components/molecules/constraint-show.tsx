import React, {ReactNode} from "react";

import Typography from "@mui/material/Typography";
import {Tooltip} from "@mui/material";

import {ShowTreeLeaf} from "@/components/atoms/show-tree-leaf";
import {ShowTreeBranch} from "@/components/atoms/show-tree-branch";

import {useTranslator} from "@/i18n";
import {dateToString, formatDateTime} from "@/utilities/date";
import {isDate, tryTranslatingWithTooltip} from "@/utilities/utilities";
import { operators } from "@/utilities/policy-operators";

interface ConstraintShowProps {
  data: any;
  passedFirstLevel?: boolean;
}

function constraintTooltipAndValue(value: string, index: number, translator: (key: string) => string) {
  if (index === 1) {
    const valueToLower = value.toLowerCase();
    const operator = operators.find(
      operator => operator.value.toLowerCase() === valueToLower
    );
    return operator ? [operator.tooltip, operator.text] : [value, value];
  }

  if (index === 2) {
    const trimmedValue = value.trim();
    if (! isDate(value)) {
      return [`"${trimmedValue}"`, trimmedValue];
    }

    const date = new Date(value);
    const dateValue = dateToString(date);
    const tooltip = dateValue ? formatDateTime(date.getTime()) : trimmedValue;
    return [`"${tooltip}"`, dateValue || trimmedValue];
  }

  return tryTranslatingWithTooltip(value, "policyDefinitions.constraint", translator);
}

export function ConstraintShow({ data, passedFirstLevel=false }: ConstraintShowProps): ReactNode {
  const { translator } = useTranslator();
  if (typeof data === 'string') {
    return (
      <div className="flex gap-x-2 items-center">{
        data.split(",").map((value, index) => {
          const [tooltipTitle, computedValue] = constraintTooltipAndValue(value, index, translator);
          return (
            <Tooltip title={tooltipTitle} key={index}>
              <Typography component="span" className={index > 1 ? "[word-break:break-word]" : ""}>
                {computedValue}
              </Typography>
            </Tooltip>
          );
        })
      }</div>
    );
  }

  if (Array.isArray(data)) {
    const lastIndex = data.length - 1;
    return data.map((item, index) => (
      <ShowTreeLeaf disablePadding key={index} hidden={!passedFirstLevel}>
        <div className="pt-2">
          <ConstraintShow passedFirstLevel data={item} />
          {lastIndex !== index ? "" : <div className="bg-white absolute -left-1 bottom-0 size-2" />}
        </div>
      </ShowTreeLeaf>
    ));
  }

  if (typeof data !== 'object' || !data) {
    return [null, undefined].indexOf(data) === -1 ? String(data) : "";
  }

  let html = [];
  for (const key in data) {
    const [tooltip] = tryTranslatingWithTooltip(key, "policyDefinitions.constraint", translator)
    html.push(
      <div key={key}>
        <Tooltip title={tooltip}>
          <Typography component="span" className="p-3 py-1 inline-block uppercase">
            {key}
          </Typography>
        </Tooltip>
        <div>
          <ShowTreeBranch bottomLeafHidden>
            <ConstraintShow data={data[key]} passedFirstLevel/>
          </ShowTreeBranch>
        </div>
      </div>
    );
  }

  return html;
}
