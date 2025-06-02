import React, {ReactNode, useEffect, useState} from "react";
import {T} from "@/i18n";
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {replaceUrlPrefixes} from "@/utilities/catalog";
import FormControlLabel from "@mui/material/FormControlLabel";
import {ReactJsonViewProps} from "react-json-view";
import dynamic from "next/dynamic";

export interface JsonLdDialogProps {
  title?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  jsonLdObject: any;
}

export function JsonLdDialog({ isOpen, onClose, title, jsonLdObject }: JsonLdDialogProps): JSX.Element {
  const [ReactJson, setReactJson] = useState<React.ComponentType<ReactJsonViewProps>>();
  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReactJson(dynamic(import("react-json-view"), { ssr: false }));
    }
  }, []);

  return (
    <Dialog
      open={isOpen}
      maxWidth="lg"
      className="my-7 py-5"
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
        {ReactJson && <ReactJson
          src={jsonIsCleaned ? replaceUrlPrefixes(jsonLdObject) : jsonLdObject}
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
  );
}
