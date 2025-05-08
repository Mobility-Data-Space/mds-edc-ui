import React from "react";
import {MultiTranslate, T} from "@/i18n";
import {Button, Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {AssetFieldDialog} from "@/components/molecules/asset-field-dialog.tsx";

export interface AssetFieldShowProps {
  icon: string;
  label: string;
  value?: string;
  openModalText?: string;
  subLabel?: string;
  valueTitle?: string;
}

export function AssetFieldShow({ icon, label, value, valueTitle, subLabel, openModalText}: AssetFieldShowProps): JSX.Element {
  const nonNullValue = value || "";
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);

  return (
    <div className="flex flex-row gap-x-2.5" >
      <Icon className="mt-1.5">{icon}</Icon>

      {! openModalText ?
        <div>
          <Typography variant="body2" color="textDisabled" className="uppercase">
            {0 === label.indexOf('http') ? label : <T string={label}/>}
          </Typography>
          <Typography>
            {0 === nonNullValue.indexOf('http') ? nonNullValue : <MultiTranslate string={nonNullValue}/>}
          </Typography>
        </div> :
        <>
          <AssetFieldDialog
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
    </div>
  );
}
