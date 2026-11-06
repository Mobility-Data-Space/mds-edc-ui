import { DeleteDialog } from "@/components/molecules/delete-dialog";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { T, useTranslator } from "@/i18n";
import { contextToCompact } from "@/jsonld/context";
import {
  containsSensitiveData,
  maskSensitiveData,
} from "@/utilities/sensitive-data";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import jsonld, { JsonLdDocument } from "jsonld";
import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useState } from "react";
import { ReactJsonViewProps } from "react-json-view";

export interface JsonLdDialogProps {
  title?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  jsonLdObject: unknown;
  dataTestId?: string;
  deleteItem?: () => Promise<void>;
  onDeleteSuccess?: () => void;
  deleteConfirmationMessage?: string;
  deleteFailMessage?: string;
  deleteButtonTestId?: string;
}

export function JsonLdDialog({
  isOpen,
  onClose,
  title,
  jsonLdObject,
  dataTestId = "jsonld-dialog",
  deleteItem,
  onDeleteSuccess,
  deleteConfirmationMessage,
  deleteFailMessage,
  deleteButtonTestId,
}: JsonLdDialogProps): React.ReactElement {
  const { translator } = useTranslator();
  const [ReactJson, setReactJson] =
    useState<React.ComponentType<ReactJsonViewProps>>();
  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);
  const [cleanJson, setCleanJson] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const {showSnackbar} = useAppSnackbar();
  const onDeleteConfirm = async () => {
    try {
      if (deleteItem) await deleteItem();
      onClose();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch {
      showSnackbar({
        type: "error",
        message: deleteFailMessage || "", 
        persist: true
      })
    }
  };

  useEffect(() => {
    jsonld.compact(jsonLdObject as JsonLdDocument, contextToCompact).then((compacted) => {
      const newValue = { ...compacted };
      delete newValue["@context"];
      setCleanJson(newValue);
    });
  }, [jsonLdObject]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReactJson(dynamic(import("react-json-view"), { ssr: false }));
    }
  }, []);

  const displayedJson = jsonIsCleaned ? cleanJson : jsonLdObject;

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="assets.[id].deleteTitle"
        content={deleteConfirmationMessage}
        onConfirm={onDeleteConfirm}
      />
      <Dialog
        open={isOpen}
        maxWidth="lg"
        className="my-7 py-5"
        onClose={onClose}
        data-testid={dataTestId}
      >
        <DialogTitle>
          <div className="flex flex-row justify-between">
            {title}
            {deleteItem && (
              <div>
                <Tooltip title={translator("common.delete")}>
                  <IconButton aria-label={translator("common.delete")}
                    data-testid={deleteButtonTestId}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Icon color="secondary">delete</Icon>
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </DialogTitle>
        <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
          {ReactJson && (
            <ReactJson
              src={(showSensitive ? displayedJson : maskSensitiveData(displayedJson)) as object}
              displayObjectSize={false}
              displayDataTypes={false}
              enableClipboard={false}
            />
          )}
        </DialogContent>
        <DialogActions>
          <div className="flex flex-1 px-5 justify-between">
            <div className="flex flex-row gap-4">
              <FormControlLabel
                label={<T string="common.cleanedJson" />}
                control={
                  <Checkbox
                    color="secondary"
                    value={jsonIsCleaned}
                    onChange={() => setJsonIsCleaned((value) => !value)}
                  />
                }
              />
              {containsSensitiveData(displayedJson) && (
                <FormControlLabel
                  label={<T string="common.showSensitiveValues" />}
                  control={
                    <Checkbox
                      color="secondary"
                      checked={showSensitive}
                      onChange={() => setShowSensitive((value) => !value)}
                    />
                  }
                />
              )}
            </div>
            <Button color="secondary" onClick={onClose}>
              <T string="common.close" />
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
