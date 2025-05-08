import React from "react";
import {T} from "@/i18n";
import {Button, Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {AssetFieldShowProps} from "@/components/molecules/asset-field-show.tsx";

export function AssetFieldDialog({ icon, label, subLabel, value, valueTitle, isOpen, onClose }: AssetFieldShowProps & { isOpen: boolean, onClose: () => void }): JSX.Element {
  const nonNullValue = value || "";
  const nonNullValueTitle = valueTitle || "";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        <div className="flex flex-row items-center gap-x-4">
          <Icon>{icon}</Icon>
          <div>
            <Typography variant="h6">
              <T string={label} />
            </Typography>
            <Typography variant="body1" color="textDisabled">
              <T string={subLabel || ""} />
            </Typography>
          </div>
        </div>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-y-2.5" style={{ maxWidth: "80vw", width: "800px" }}>
        <div className="flex flex-col gap-y-2">
          {nonNullValueTitle.split("\n").map((line, index) => (
            <div key={index}>{<T string={line} />}</div>
          ))}
        </div>
        <div className={valueTitle ? "pl-4" : ""}>
          {nonNullValue.split("\n").map((line, index) => {
            if (line.indexOf('http') === 0) {
              return (<div key={index}>
                <a className="hover:underline cursor-pointer" href={line}>
                  {line}
                </a>
              </div>);
            }
            return (<div className="text-balance" key={index}>{line}</div>);
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          <T string="common.close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
