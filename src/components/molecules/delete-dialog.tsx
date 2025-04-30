import React, {useState, useRef, useEffect} from "react";
import {T} from "@/i18n";
import {MarkdownText} from "@/components/atoms/markdown-text.tsx";
import {
  Button as MuiButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton
} from "@mui/material";
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';
import Typography from "@mui/material/Typography";
import {Asset} from "@think-it-labs/edc-connector-client";
import {AssetIcon} from "@/components/atoms/asset-icon.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssetDetails from "@/components/organisms/asset-details.tsx";

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
        <MuiButton color="secondary" onClick={onClose}>
          <T string="common.close"/>
        </MuiButton>
        <MuiButton color="error" variant="contained" onClick={onConfirmAndClose}>
          <T string="common.delete"/>
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
}
