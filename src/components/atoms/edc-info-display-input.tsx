import { Input } from "@/components/atoms/input";
import { Icon, IconButton, Tooltip } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { forwardRef } from "react";

export interface EdcInfoDisplayInputProps {
  value: string,
  translator: (key: string) => string,
  "data-testid"?: string,
}

export const EdcInfoDisplayInput = forwardRef<HTMLInputElement, Omit<TextFieldProps, "error"> & EdcInfoDisplayInputProps>(
  ({ translator, label, value, "data-testid": dataTestId, ...rest }, ref): JSX.Element => {
    return (
      <Input
        ref={ref}
        fullWidth
        label={label}
        value={value}
        data-testid={dataTestId}
        slotProps={{
          input: {
            classes: { root: "flex-grow" },
            startAdornment: <Icon className="mr-2">link</Icon>,
            endAdornment: <Tooltip title={translator("common.copyToClipboard")}>
              <IconButton color="secondary" onClick={() => navigator.clipboard.writeText(value)}>
                <Icon>content_copy</Icon>
              </IconButton>
            </Tooltip>
          }
        }}
        {...rest}
      />
    );
  }
);

EdcInfoDisplayInput.displayName = "EdcInfoDisplayInput";
