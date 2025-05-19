import React from "react";
import {T} from "@/i18n";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";

interface ConfirmDialogProps {
  title?: string;
  content?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentStyle?: { [key: string]: string }
}

export function ConfirmDialog({ open, onClose, title = "", content = "", onConfirm, contentStyle = {} }: ConfirmDialogProps): JSX.Element {
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
        <Button color="primary" variant="contained" onClick={onConfirmAndClose}>
          <T string="common.confirm"/>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
