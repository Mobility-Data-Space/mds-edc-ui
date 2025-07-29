import {T, useTranslator} from "@/i18n";
import { contextToCompact } from "@/jsonld/context";
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Tooltip} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import jsonld from "jsonld";
import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useState } from "react";
import { ReactJsonViewProps } from "react-json-view";
import {DeleteDialog} from "@/components/molecules/delete-dialog.tsx";
import {enqueueSnackbar, useSnackbar} from "notistack";
import {Snackbar} from "@/components/molecules/snackbar.tsx";

export interface JsonLdDialogProps {
  title?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  jsonLdObject: any;
  dataTestId?: string;
  deleteItem?: () => Promise<void>;
  onDeleteSuccess?: () => void;
  deleteConfirmationMessage?: string;
  deleteFailMessage?: string;
  deleteButtonTestId?: string;
}

export function JsonLdDialog({ isOpen, onClose, title, jsonLdObject, dataTestId = "jsonld-dialog", deleteItem, onDeleteSuccess, deleteConfirmationMessage, deleteFailMessage, deleteButtonTestId }: JsonLdDialogProps): JSX.Element {
  const { translator } = useTranslator();
  const [ReactJson, setReactJson] = useState<React.ComponentType<ReactJsonViewProps>>();
  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);
  const [cleanJson, setCleanJson] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { closeSnackbar } = useSnackbar();

  const onDeleteConfirm = async () => {
    try {
      deleteItem && await deleteItem();
      onClose();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      /* TODO: translate */
      enqueueSnackbar("", {
        content: (key) => (
          <Snackbar
            type="error"
            message={deleteFailMessage || ""}
            onClose={() => { closeSnackbar(key); }}
          />
        )
      });
    }
  };

  useEffect(() => {
    jsonld.compact(jsonLdObject, contextToCompact).then((compacted: any) => {
      const { "@context": context, ...newValue } = compacted;
      setCleanJson(newValue);
    });
  }, [jsonLdObject]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReactJson(dynamic(import("react-json-view"), { ssr: false }));
    }
  }, []);

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
            {deleteItem && <div>
              <Tooltip title={translator("common.delete")} >
                <IconButton data-testid={deleteButtonTestId} onClick={() => setDeleteDialogOpen(true)}>
                  <Icon color="secondary" >delete</Icon>
                </IconButton>
              </Tooltip>
            </div>}
          </div>
        </DialogTitle>
        <DialogContent style={{maxWidth: "80vw", width: "800px" }}>
          {ReactJson && <ReactJson
            src={jsonIsCleaned ? cleanJson : jsonLdObject}
            displayObjectSize={false}
            displayDataTypes={false}
            enableClipboard={false}
          />}
        </DialogContent>
        <DialogActions>
          <div className="flex flex-1 px-5 justify-between">
            <FormControlLabel label={<T string="common.cleanedJson" />} control={<Checkbox color="secondary" value={jsonIsCleaned} onChange={() => setJsonIsCleaned((value) => !value)} />} />
            <Button color="secondary" onClick={onClose}>
              <T string="common.close" />
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
