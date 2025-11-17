import { AssetIcon } from "@/components/atoms/asset-icon";
import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import { DeleteDialog } from "@/components/molecules/delete-dialog";
import { Snackbar } from "@/components/molecules/snackbar";
import AssetDetails from "@/components/organisms/asset-details";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { T, useTranslator } from "@/i18n";
import { ASSET_TITLE } from "@/jsonld/asset";
import { Asset, EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { proxyConnectorManagement } from "@/constants/proxy";

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
  contentStyle?: { [key: string]: string };
}

const hasContract = async (client: EdcConnectorClient, assetId: string) => {
  try {
    const agreements = await client.management.contractAgreements.queryAll({
      filterExpression: [
        { operandLeft: "assetId", operator: "=", operandRight: assetId },
      ],
    });
    return agreements.length > 0;
  } catch (error) {
    return false;
  }
};
export default function AssetDialog({
  open,
  onClose,
  asset,
  onEditClick,
  deleteEnabled = false,
  participantId,
  connectorEndpoint,
  deleteItem,
  onDeleteSuccess,
  contentStyle = {},
}: AssetDialogProps) {
  const id = asset["@id"];
  const title = readValue(asset.properties, ASSET_TITLE) || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { closeSnackbar } = useSnackbar();
  const { translator } = useTranslator();

  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  const onDeleteConfirm = async () => {
    try {
      const assetHasContracts = await hasContract(client, id);
      if (assetHasContracts) {
        throw new Error(
          "Asset that is referenced in at least one Contract cannot be deleted"
        );
      }
      if (deleteItem) {
        await deleteItem();
      }
      onClose();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      let message = `Failed deleting asset ${id}`;

      if (error instanceof Error) {
        message = error.message;
      }
      /* TODO: translate */
      enqueueSnackbar("", {
        content: (key) => (
          <Snackbar
            type="error"
            message={message}
            onClose={() => {
              closeSnackbar(key);
            }}
          />
        ),
      });
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
        className="asset-dialog my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <div className="flex flex-row justify-between">
            <TitleWithIcon
              icon={<AssetIcon asset={asset} fontSize="large" />}
              title={title}
              subtitle={id}
            />

            <div>
              {onEditClick && (
                <Tooltip title={translator("common.edit")}>
                  <IconButton
                    data-testid="edit-asset-button"
                    onClick={onEditClick}
                  >
                    <Icon color="secondary">edit</Icon>
                  </IconButton>
                </Tooltip>
              )}
              {deleteEnabled && (
                <Tooltip title={translator("common.delete")}>
                  <IconButton
                    data-testid="delete-asset-modal-btn"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Icon color="secondary">delete</Icon>
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <AssetDetails
            asset={asset}
            participantId={participantId}
            connectorEndpoint={connectorEndpoint}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
