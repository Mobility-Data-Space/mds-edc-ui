import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";

import {T} from "@/i18n";

interface DeleteDialogProps {
  title?: string;
  content?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentStyle?: { [key: string]: string }
}

export function DeleteDialog({ open, onClose, title = "", content = "", onConfirm, contentStyle = {} }: DeleteDialogProps): JSX.Element {
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
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          <T string="common.close"/>
        </Button>
        <Button data-testid="confirm-delete-btn" color="error" variant="contained" onClick={onConfirmAndClose}>
          <T string="common.delete"/>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
