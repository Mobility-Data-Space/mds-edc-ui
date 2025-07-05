import { T } from "@/i18n";
import { contextToCompact } from "@/schema/context.ts";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import jsonld from "jsonld";
import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useState } from "react";
import { ReactJsonViewProps } from "react-json-view";

export interface JsonLdDialogProps {
  title?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  jsonLdObject: any;
  dataTestId?: string;
}

export function JsonLdDialog({ isOpen, onClose, title, jsonLdObject, dataTestId = "jsonld-dialog" }: JsonLdDialogProps): JSX.Element {
  const [ReactJson, setReactJson] = useState<React.ComponentType<ReactJsonViewProps>>();
  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);
  const [cleanJson, setCleanJson] = useState({});

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
    <Dialog
      open={isOpen}
      maxWidth="lg"
      className="my-7 py-5"
      onClose={onClose}
      data-testid={dataTestId}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
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
  );
}
