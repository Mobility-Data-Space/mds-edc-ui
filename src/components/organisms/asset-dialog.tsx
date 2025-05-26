import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from 'notistack';
import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";

import {AssetIcon} from "@/components/atoms/asset-icon";
import AssetDetails from "@/components/organisms/asset-details";
import {DeleteDialog} from "@/components/molecules/delete-dialog";
import { T } from "@/i18n";
import {ASSET_TITLE} from "@/schema/asset";


interface AssetDialogProps {
  asset: Asset;
  participantId: string;
  connectorEndpoint: string;

  open: boolean;
  onClose: () => void;
  onEditClick?: () => void;
  deleteEnabled?: boolean;
  deleteItem?: () => Promise<void>;
  onDeleteSuccess?: () => void;
  contentStyle?: { [key: string]: string }
}
export default function AssetDialog({ open, onClose, asset, onEditClick, deleteEnabled = false, participantId, connectorEndpoint, deleteItem, onDeleteSuccess, contentStyle = {} }: AssetDialogProps) {
  const id = asset["@id"];
  const title = readValue(asset.properties, ASSET_TITLE) || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onDeleteConfirm = async () => {
    try {
      deleteItem && await deleteItem();
      onClose();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      /* TODO: translate */
      enqueueSnackbar(`Failed deleting asset ${id}`);
    }
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="assets.[id].deleteTitle"
        content={`Please confirm you want to delete Asset ${title}. This action cannot be undone.`}
        onConfirm={onDeleteConfirm}
      />
      
      <Dialog
        open={open}
        maxWidth="lg"
        className="my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-x-4 items-center">
              <AssetIcon asset={asset} fontSize="large"/>
              <div className="flex flex-col">
                <Typography variant="h4">
                  {title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {id}
                </Typography>
              </div>
            </div>

            <div>
            {onEditClick &&
                <IconButton onClick={onEditClick}>
                  <EditIcon color="secondary"/>
                </IconButton>
              }
              {deleteEnabled &&
                <IconButton onClick={() => setDeleteDialogOpen(true)}>
                  <DeleteIcon color="secondary"/>
                </IconButton>
              }
            </div>
          </div>
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <AssetDetails asset={asset} participantId={participantId} connectorEndpoint={connectorEndpoint} />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close"/>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
