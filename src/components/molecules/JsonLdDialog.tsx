import { DeleteDialog } from "@/components/molecules/delete-dialog.tsx";
import { Snackbar } from "@/components/molecules/snackbar.tsx";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { T, useTranslator } from "@/i18n";
import { contextToCompact } from "@/jsonld/context";
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
import jsonld from "jsonld";
import dynamic from "next/dynamic";
import { enqueueSnackbar, useSnackbar } from "notistack";
import React, { ReactNode, useEffect, useState } from "react";
import { ReactJsonViewProps } from "react-json-view";

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
  sensitiveFields?: Set<string>;
}

const isSensitiveKey = (key: string, fields: Set<string>): boolean => {
  for (const field of fields) {
    if (
      key === field ||
      key.endsWith(`/${field}`) ||
      key.endsWith(`:${field}`)
    ) {
      return true;
    }
  }
  return false;
};

const maskSensitiveData = (obj: any, fields: Set<string>): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item, fields));
  }

  const masked: Record<string, any> = {};
  for (const key in obj) {
    if (isSensitiveKey(key, fields)) {
      masked[key] = "••••••••";
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      masked[key] = maskSensitiveData(obj[key], fields);
    } else {
      masked[key] = obj[key];
    }
  }
  return masked;
};

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
  sensitiveFields = new Set<string>(),
}: JsonLdDialogProps): React.ReactElement {
  const { translator } = useTranslator();
  const [ReactJson, setReactJson] =
    useState<React.ComponentType<ReactJsonViewProps>>();
  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);
  const [cleanJson, setCleanJson] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const { closeSnackbar } = useSnackbar();
  const {showSnackbar} = useAppSnackbar();
  const onDeleteConfirm = async () => {
    try {
      deleteItem && (await deleteItem());
      onClose();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      /* TODO: translate */

      showSnackbar({
        type: "error",
        message: deleteFailMessage || "", 
        persist: true
      })
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
            {deleteItem && (
              <div>
                <Tooltip title={translator("common.delete")}>
                  <IconButton
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
              src={(() => {
                const baseJson = jsonIsCleaned ? cleanJson : jsonLdObject;
                if (sensitiveFields.size > 0 && !showSensitive) {
                  return maskSensitiveData(baseJson, sensitiveFields);
                }
                return baseJson;
              })()}
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
              {sensitiveFields.size > 0 && (
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
