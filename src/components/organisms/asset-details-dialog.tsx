import React, {useMemo, useState} from "react";
import { T } from "@/i18n";
import {Asset} from "@think-it-labs/edc-connector-client";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {
  ASSET_TITLE,
} from "@/schema/asset.ts";
import Typography from "@mui/material/Typography";
import {AssetIcon} from "@/components/atoms/asset-icon.tsx";
import {Button as MuiButton, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import AssetDetails from "@/components/organisms/asset-details.tsx";
import {DeleteDialog} from "@/components/molecules/delete-dialog.tsx";

interface AssetDetailsDialogProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
  onEditClick?: () => void;
  deleteEnabled?: boolean;
  participantId?: string;
  deleteItem?: () => Promise<void>;
  contentStyle?: { [key: string]: string }
}
export default function AssetDetailsDialog({ open, onClose, asset, onEditClick, deleteEnabled = false, participantId, deleteItem, contentStyle = {} }: AssetDetailsDialogProps) {
  const title = readValue(asset.properties, ASSET_TITLE) || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onDeleteConfirm = async () => {
    try {
      deleteItem && await deleteItem();
      onClose()
    } catch (error) {
      // TODO: show error message
    }
  };
  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="assets.[id].deleteTitle"
        /* TODO: translate */
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
                  {participantId}
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
          <AssetDetails asset={asset} />
        </DialogContent>
        <DialogActions>
          <MuiButton color="secondary" onClick={onClose}>
            <T string="common.close"/>
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
