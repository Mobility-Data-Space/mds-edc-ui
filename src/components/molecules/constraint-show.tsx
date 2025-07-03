import React, {ReactNode} from "react";

import Typography from "@mui/material/Typography";
import {Tooltip} from "@mui/material";

import {ShowTreeLeaf} from "@/components/atoms/show-tree-leaf";
import {ShowTreeBranch} from "@/components/atoms/show-tree-branch";

import {useTranslator} from "@/i18n";
import {dateToString} from "@/utilities/date";
import {tryTranslatingWithTooltip} from "@/utilities/utilities";
import { operators } from "@/utilities/policy-operators";

interface ConstraintShowProps {
  data: any;
}

function constraintTooltipAndValue(value: string, index: number, translator: (key: string) => string) {
  if (index === 1) {
    const operator = operators.find(operator => operator.value === value);
    if (operator) {
      return [operator.tooltip, operator.text];
    }
  }

  if (index === 2) {
    const dateValue = dateToString(new Date(value));
    return [`"${value}"`, dateValue || value];
  }

  return tryTranslatingWithTooltip(value, "policyDefinitions.constraint", translator);
}

export function ConstraintShow({ data }: ConstraintShowProps): ReactNode {
  const { translator } = useTranslator();
    if (typeof data === 'string') {
      return (
        <div className="flex gap-x-2 items-center">{
          data.split(",").map((value, index) => {
            const [tooltipTitle, computedValue] = constraintTooltipAndValue(value, index, translator);
            return (
              <Tooltip title={tooltipTitle} key={index}>
                <Typography>
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
        <ShowTreeLeaf disablePadding key={index} >
          <div className={lastIndex === index ? "pt-2" : "pt-2"}>
            <ConstraintShow data={item} />
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
          <div className="">
            <ShowTreeBranch bottomLeafHidden>
              <ConstraintShow data={data[key]} />
            </ShowTreeBranch>
          </div>
        </div>
      );
    }

    return html;
}
