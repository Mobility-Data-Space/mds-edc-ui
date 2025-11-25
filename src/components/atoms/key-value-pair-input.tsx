import React from "react";
import { TextFieldProps } from "@mui/material/TextField";
import { Button, FormHelperText, TextField } from "@mui/material";

export type Tag = {
  key: string;
  value: string;
};

export type KeyValuePairInputProps = Omit<TextFieldProps, "onChange"> & {
  onChange: ({ input, valid }: { input: Partial<Tag>; valid: boolean }) => void;
  onRemove: (event: any) => void;
  value: Tag;
  ignoreRegexCheck?: boolean;
  removeText?: string;
  errorText?: string;
  keyLabel?: string;
  keyPlaceholder?: string;
  valueLabel?: string;
  valuePlaceholder?: string;
  valueOnly: boolean;
  valid: boolean;
};

export function KeyValuePairInput({
  onChange,
  onRemove,
  value,
  removeText = "Remove",
  errorText = "Please insert valid key/value pair",
  keyLabel = "Key",
  keyPlaceholder = "Key",
  valueLabel = "Value",
  valuePlaceholder = "Value",
  valueOnly = false,
  ignoreRegexCheck,
  valid,
}: KeyValuePairInputProps) {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-_\.\/]+$/;

  function textInputHandler(text: string, label: string) {
    onChange({
      input: { [label]: text },
      valid: ignoreRegexCheck ? !!text : regex.test(text),
    });
  }

  return (
    <div className="mb-2">
      <div className={`grid grid-cols-9 gap-x-5`}>
        {valueOnly ? (
          ""
        ) : (
          <TextField
            color="secondary"
            className="col-span-2"
            fullWidth
            required
            label={keyLabel}
            placeholder={keyPlaceholder}
            value={value.key}
            onChange={(event) => {
              textInputHandler(event.target.value, "key");
            }}
            variant="outlined"
            error={!valid}
          />
        )}
        <TextField
          color="secondary"
          className={valueOnly ? "col-span-8" : "col-span-6"}
          fullWidth
          required={valueOnly}
          label={valueLabel}
          placeholder={valuePlaceholder}
          value={value?.value}
          onChange={(event) => {
            textInputHandler(event.target.value, "value");
          }}
          variant="outlined"
          error={!valid}
        />
        <Button
          onClick={onRemove}
          color="error"
          className="col-span-1 font-bold"
        >
          {removeText}
        </Button>
      </div>
      {!valid && <FormHelperText error={!valid}>{errorText}</FormHelperText>}
    </div>
  );
}
