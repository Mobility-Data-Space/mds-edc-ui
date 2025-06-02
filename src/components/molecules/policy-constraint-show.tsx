import React, {ReactNode, useState} from "react";
import {Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import {T} from "@/i18n";
import {ConstraintShow} from "@/components/molecules/constraint-show";
import {convertOdrlToJsonHtml} from "@/utilities/catalog";
import {JsonLdDialog} from "@/components/molecules/JsonLdDialog";
import {Constraint} from "@think-it-labs/edc-connector-client";

export interface FieldShowProps {
  constraints: Constraint[];
  jsonLdDialogTitle: ReactNode;
  jsonLdObject: any;
}

export function PolicyConstraintShow({ constraints, jsonLdDialogTitle, jsonLdObject }: FieldShowProps): JSX.Element {
  const [jsonLdModalOpen, setJsonLdModalOpen] = useState(false);
  const onOpen = () => setJsonLdModalOpen(true);
  const onClose = () => setJsonLdModalOpen(false);

  return (
    <>
      <div className="sm:grid sm:grid-cols-3">
        <div className="flex flex-row gap-x-2 sm:col-span-2">
          <Icon className="mt-1.5">policy</Icon>
          <div>
            <Typography variant="body2" color="textDisabled" className="uppercase">
              <T string="contractDefinitions.contractPolicy"/>
            </Typography>
            <div>
              <ConstraintShow
                data={convertOdrlToJsonHtml(constraints, ",")}/>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-x-2 sm:col-span-1">
          <Icon className="mt-1.5">policy</Icon>
          <div className="flex flex-col gapy-y-2">
            <Typography variant="body2" color="textDisabled" className="uppercase">
              <T string="contractDefinitions.contractPolicyJsonLd"/>
            </Typography>
            <Typography className="!leading-none hover:underline cursor-pointer" onClick={onOpen}>
              <T string="common.showJsonLd"/>
            </Typography>
          </div>
        </div>
      </div>

      <JsonLdDialog
        isOpen={jsonLdModalOpen}
        onClose={onClose}
        jsonLdObject={jsonLdObject}
        title={jsonLdDialogTitle}
      />
    </>
  );
}
