import React, {useState} from "react";
import { enqueueSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Dataset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {AssetIcon} from "@/components/atoms/asset-icon";
import DataOfferDetails from "@/components/organisms/data-offer-details";
import AssetDetails from "@/components/organisms/asset-details.tsx";
import {DeleteDialog} from "@/components/molecules/delete-dialog.tsx";
import { T } from "@/i18n";
import {ASSET_TITLE} from "@/schema/asset";
import { datasetToAsset } from "@/utilities/catalog";

const HAS_POLICY = "http://www.w3.org/ns/odrl/2/hasPolicy";

interface DataOfferDialogProps {
  dataset: Dataset;
  participantId: string;
  counterPartyAddress: string;
  assetIsOwned?: boolean;
  open: boolean;
  onClose: () => void;
  onEditClick?: () => void;
  deleteEnabled?: boolean;
  deleteItem?: () => Promise<void>;
  onDeleteSuccess?: () => void;
  contentStyle?: { [key: string]: string }
}

export default function DataOfferDialog({ open, onClose, dataset, onEditClick, deleteEnabled = false, participantId, counterPartyAddress, assetIsOwned = true, deleteItem, onDeleteSuccess, contentStyle = {} }: DataOfferDialogProps) {
  const id = dataset["@id"];
  const title = readValue(dataset.properties, ASSET_TITLE) || "";
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
              <AssetIcon asset={datasetToAsset(dataset)} fontSize="large"/>
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
          <div className="flex flex-col gap-y-2.5">
            <AssetDetails asset={datasetToAsset(dataset)} participantId={participantId} connectorEndpoint={counterPartyAddress} />
          </div>
          <div className="flex flex-col gap-y-2.5">
            <span /> <span />
            <DataOfferDetails assetId={dataset["@id"]} participantId={participantId} counterPartyAddress={counterPartyAddress} offers={dataset[HAS_POLICY]} assetIsOwned={assetIsOwned} />
          </div>
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
