import React from "react";

import { Button, Icon, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";

import { FieldDialog } from "@/components/molecules/field-dialog";

import { MultiTranslate, T } from "@/i18n";

export interface FieldShowProps {
  icon: string;
  label: string;
  testDataId?: string;
  value?: string;
  openModalText?: string;
  subLabel?: string;
  valueTitle?: string;
  copyTextIcon?: boolean
}

export function FieldShow({ icon, label, value, valueTitle, subLabel, openModalText, testDataId, copyTextIcon = false }: FieldShowProps): React.ReactElement {
  const nonNullValue = value || "";
  const shouldNotTranslateValue = 0 === nonNullValue.indexOf('http') || (typeof nonNullValue === "string" && nonNullValue.match(/^\d/));
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);

  return (
    <div className="flex flex-row gap-x-2.5" >
      <Icon className="mt-1.5">{icon}</Icon>

      {!openModalText ?
        <div>
          <Typography variant="body2" color="textDisabled" className="uppercase">
            {0 === label.indexOf('http') ? label : <T string={label} />}
          </Typography>
          <Typography data-testid={testDataId}>
            {shouldNotTranslateValue ? nonNullValue : <MultiTranslate string={nonNullValue} />}
          </Typography>
        </div> :
        <>
          <FieldDialog
            icon={icon}
            value={nonNullValue}
            valueTitle={valueTitle}
            label={label}
            subLabel={subLabel}
            isOpen={dialogIsOpen}
            onClose={() => setDialogIsOpen(false)}
          />
          <div>
            <Typography variant="body2" color="textDisabled">
              <T string={label} />
            </Typography>
            <Button sx={{ padding: 0 }} color="secondary" onClick={() => setDialogIsOpen(true)}>
              <Typography className="hover:underline cursor-pointer" component="span" variant="body2">
                <T string={openModalText} />
              </Typography>
            </Button>
          </div>
        </>
      }
      {copyTextIcon && <IconButton color="secondary" onClick={() => navigator.clipboard.writeText(nonNullValue)}>
        <Icon>content_copy</Icon>
      </IconButton>}
    </div>
  );
}
