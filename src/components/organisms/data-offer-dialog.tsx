import { AssetIcon } from "@/components/atoms/asset-icon";
import { OnRequestDataOfferDescription } from "@/components/atoms/on-request-data-offer-description";
import AssetDetails from "@/components/organisms/asset-details";
import DataOfferDetails from "@/components/organisms/data-offer-details";
import { T } from "@/i18n";
import { ASSET_TITLE } from "@/jsonld/asset";
import { datasetToAsset, HAS_POLICY, removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Dataset } from "@think-it-labs/edc-connector-client";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { MouseEvent } from "react";

interface DataOfferDialogProps {
  dataset: Dataset;
  participantId: string;
  counterPartyAddress: string;
  assetIsOwned?: boolean;
  open: boolean;
  onClose: () => void;
  contentStyle?: { [key: string]: string }
  onNegotiateSuccess?: () => void;
  dataTestId?: string;
}

export default function DataOfferDialog({ open, onClose, dataset, participantId, counterPartyAddress, assetIsOwned = true, contentStyle = {}, onNegotiateSuccess, dataTestId = "data-offer-dialog" }: DataOfferDialogProps) {
  const id = dataset["@id"];
  const title = readValue(dataset, ASSET_TITLE) || "";

  const properties = removeJsonLdSchemaFromProperties(datasetToAsset(dataset).properties);
  const additionalProperties = readValue(properties, "additionalProperties")?.[0] ;
  const onrequest = readValue(additionalProperties, "onrequest") == "true";

  const openEmail = (e: MouseEvent) => {
    const recipient = readValue(additionalProperties, "email"); // Replace with dynamic value if needed
    const subject = readValue(additionalProperties, "preferred_subject");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
    e.preventDefault() ;
};
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      className="my-7"
      onClose={onClose}
      data-testid={dataTestId}
    >
      <DialogTitle>
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
  );
}
