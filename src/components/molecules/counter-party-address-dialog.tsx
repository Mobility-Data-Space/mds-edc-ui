import React, {ReactNode} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import ViewTimelineIcon from "@mui/icons-material/ViewTimelineSharp";
import {T} from "@/i18n";

interface CounterPartyAddressDialogProps {
  content?: ReactNode;
  open: boolean;
  onClose: () => void;
  contentStyle?: { [key: string]: string }
}

export function CounterPartyAddressDialog({ open, onClose, content = "", contentStyle = {} }: CounterPartyAddressDialogProps): JSX.Element {
  const onConfirmAndClose = () => {
    // TODO: refresh behaviour
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
        <div className="flex flex-row gap-x-4 items-center">
          <ViewTimelineIcon className="!size-10" />
          <div className="flex flex-col">
            <Typography variant="h4">
              <T string="catalog.fetchStatus"/>
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <T string="catalog.otherConnectorEndpointCatalogs"/>
            </Typography>
          </div>
        </div>
      </DialogTitle>
      <DialogContent style={contentStyle}>
        {content}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          <T string="common.cancel"/>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
