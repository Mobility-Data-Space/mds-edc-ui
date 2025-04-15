import React from "react";
import { Button } from "@mui/material";

export type RadioButtonProps = {
  id?: string;
  value: any;
  trueValue?: any;
  falseValue?: any;
  onChange: (value: boolean) => void;
  labelTrue: string,
  labelFalse: string
}

export function RadioButton({ id = "", trueValue = true, falseValue = false, value, onChange, labelTrue, labelFalse, }: RadioButtonProps): JSX.Element {
  const valueIsTrue = value === trueValue;
  const onClick = () => {
    return onChange(valueIsTrue ? falseValue : trueValue);
  }

  return (
    <Button id={id} onClick={onClick} color={valueIsTrue ? "error" : "secondary"} size="small" >
      <span className="font-medium text-sm">{valueIsTrue ? labelTrue : labelFalse}</span>
    </Button>
  );
}
