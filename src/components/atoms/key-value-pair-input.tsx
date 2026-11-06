import { TextFieldProps } from "@mui/material/TextField";
import { Button, FormHelperText, TextField } from "@mui/material";
import { useState } from "react";
import { SensitiveValueToggle } from "@/components/atoms/sensitive-value-toggle";
import { isUrl } from "@/utilities/utilities";

export type Tag = {
  key: string;
  value: string;
};

export type KeyValuePairInputProps = Omit<TextFieldProps, "onChange"> & {
  onChange: ({ input, valid }: { input: Partial<Tag>; valid: boolean }) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value: Tag;
  ensureValueIsALink?: boolean;
  maskValue?: boolean;
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
  ensureValueIsALink,
  maskValue = false,
  valid,
}: KeyValuePairInputProps) {
  const [showValue, setShowValue] = useState(false);
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-_\.]{0,49}$/;

  function textInputHandler(text: string, label: string) {
    onChange({
      input: { [label]: text },
      valid: ensureValueIsALink ? isUrl(text) : regex.test(text),
    });
  }

  return (
    <div className="mb-2">
      <div className={`grid grid-cols-9 gap-x-5`}>
        {valueOnly ? "" :
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
        }
        <TextField
          color="secondary"
          className={valueOnly ? "col-span-8" : "col-span-6"}
          fullWidth
          required={valueOnly}
          type={maskValue && !showValue ? "password" : "text"}
          autoComplete={maskValue ? "new-password" : undefined}
          slotProps={
            maskValue
              ? {
                  input: {
                    endAdornment: (
                      <SensitiveValueToggle
                        shown={showValue}
                        onToggle={() => setShowValue((value) => !value)}
                      />
                    ),
                  },
                }
              : undefined
          }
          label={valueLabel}
          placeholder={valuePlaceholder}
          value={value?.value}
          onChange={(event) => {
            textInputHandler(event.target.value, "value");
          }}
          variant="outlined"
          error={!valid}
        />
        <Button onClick={onRemove} color="error" className="col-span-1 font-bold">
          {removeText}
        </Button>
      </div>
      {!valid && (<FormHelperText error={!valid}>{errorText}</FormHelperText>)}
    </div>
  );
}
