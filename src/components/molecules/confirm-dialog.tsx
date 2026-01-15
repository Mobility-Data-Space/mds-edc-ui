import React, { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";

import { Checkbox } from "@/components/atoms/checkbox.tsx";
import { T } from "@/i18n";

interface ConfirmDialogProps {
  title?: string;
  content?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentStyle?: { [key: string]: string }
  confirmCheckboxText?: string;
}

export function ConfirmDialog({ open, onClose, title = "", content = "", onConfirm, contentStyle = {}, confirmCheckboxText }: ConfirmDialogProps): React.ReactElement {
  const [isChecked, setIsChecked] = useState(false);
  const onConfirmAndClose = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      className="my-7"
      onClose={onClose}
    >
      <DialogTitle>
        <Typography variant="h4">
          <T string={title} />
        </Typography>
      </DialogTitle>
      <DialogContent style={contentStyle}>
        <T string={content} />
        {confirmCheckboxText &&
          <Checkbox
            label={confirmCheckboxText}
            value={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
          />
        }
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end flex-grow gap-x-3 p-3">
          <Button color="secondary" onClick={onClose}>
            <T string="common.close" />
          </Button>
          <Button color="primary" variant="contained" onClick={onConfirmAndClose}
            disabled={!!confirmCheckboxText && !isChecked}>
            <T string="common.confirm" />
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
