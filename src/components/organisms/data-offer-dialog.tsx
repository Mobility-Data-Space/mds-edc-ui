import { AssetIcon } from "@/components/atoms/asset-icon";
import { OnRequestDataOfferDescription } from "@/components/atoms/on-request-data-offer-description.tsx";
import { DeleteDialog } from "@/components/molecules/delete-dialog";
import AssetDetails from "@/components/organisms/asset-details";
import DataOfferDetails from "@/components/organisms/data-offer-details";
import { T } from "@/i18n";
import { ASSET_TITLE } from "@/jsonld/asset";
import { datasetToAsset, removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Dataset } from "@think-it-labs/edc-connector-client";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { enqueueSnackbar } from 'notistack';
import { useState } from "react";

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
  onNegotiateSuccess?: () => void;
  dataTestId?: string;
}

export default function DataOfferDialog({ open, onClose, dataset, onEditClick, deleteEnabled = false, participantId, counterPartyAddress, assetIsOwned = true, deleteItem, onDeleteSuccess, contentStyle = {}, onNegotiateSuccess, dataTestId = "data-offer-dialog" }: DataOfferDialogProps) {
  const id = dataset["@id"];
  const title = readValue(dataset, ASSET_TITLE) || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const properties = removeJsonLdSchemaFromProperties(datasetToAsset(dataset).properties);
  const additionalProperties = readValue(properties, "additionalProperties")?.[0] ;
  const onrequest = readValue(additionalProperties, "onrequest") == "true";

  const openEmail = () => {
    const recipient = readValue(additionalProperties, "email"); // Replace with dynamic value if needed
    const subject = readValue(additionalProperties, "preferred_subject");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
};
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
        data-testid={dataTestId}
      >
        <DialogTitle>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-x-4 items-center">
              <AssetIcon asset={datasetToAsset(dataset)} fontSize="large" />
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
                  <Icon color="secondary" >edit</Icon>
                </IconButton>
              }
              {deleteEnabled &&
                <IconButton onClick={() => setDeleteDialogOpen(true)}>
                  <Icon color="secondary" >delete</Icon>
                </IconButton>
              }
            </div>
          </div>
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <div className="flex flex-col gap-y-2.5">
            <AssetDetails asset={datasetToAsset(dataset)} participantId={participantId} connectorEndpoint={counterPartyAddress} />
          </div>
          {onrequest ? 
            <div className="mt-6">
              <OnRequestDataOfferDescription asset={datasetToAsset(dataset)} />
            </div> : 
            <div className="flex flex-col gap-y-2.5">
              <span /> <span />
              <DataOfferDetails
                assetId={dataset["@id"]}
                participantId={participantId}
                counterPartyAddress={counterPartyAddress}
                offers={dataset[HAS_POLICY]}
                assetIsOwned={assetIsOwned}
                onNegotiateSuccess={onNegotiateSuccess}
              />
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close" />
          </Button>
          {onrequest && !assetIsOwned ? 
            <Button variant="contained" onClick={openEmail}>
              <T string="common.contact" />
            </Button> : "" 
          }
        </DialogActions>
      </Dialog>
    </>
  );
}
