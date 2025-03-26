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
  trueValueClassName?: string
  falseValueClassName?: string
}

export function RadioButton({ id = "", trueValue = true, falseValue = false, value, onChange, labelTrue, labelFalse, trueValueClassName = "text-red-600", falseValueClassName = "" }: RadioButtonProps): JSX.Element {
  const valueIsTrue = value === trueValue;
  const onClick = () => {
    return onChange(valueIsTrue ? falseValue : trueValue);
  }

  return (
    <Button id={id} onClick={onClick}>
      <span className={valueIsTrue ? trueValueClassName : falseValueClassName}>{valueIsTrue ? labelTrue : labelFalse}</span>
    </Button>
  );
}
