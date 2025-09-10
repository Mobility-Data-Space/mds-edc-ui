import { Input } from "@/components/atoms/input";
import { Icon, IconButton, Tooltip } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import React, { forwardRef, SVGProps } from "react";

export interface EdcInfoDisplayInputProps {
  value: string,
  translator: (key: string) => string,
  "data-testid"?: string,
}

const LinkIcon = React.memo((props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"
      ></path>
    </svg>
  )
})

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
            startAdornment: <LinkIcon className="size-7 mr-2" />,
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
