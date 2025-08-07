import React from "react";
import {Asset} from "@think-it-labs/edc-connector-client";
import Typography from "@mui/material/Typography";
import {T, useTranslator} from "@/i18n";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import { MarkdownText } from "./markdown-text";

export function OnRequestDataOfferDescription({ asset }: { asset: Asset }): JSX.Element {
  const properties = removeJsonLdSchemaFromProperties(asset.properties);
  const additionalProperties = readValue(properties, "additionalProperties") ;
  const onrequest = readValue(additionalProperties?.[0], "onrequest") == "true";

  const { translator } = useTranslator() ;

  if (onrequest) {
    return (
      <div>
        <Typography className="text-lg font-normal uppercase">
          <T string="dataOffer.onRequestDataOfferTitle" />
        </Typography>

        <MarkdownText data={translator("dataOffer.onRequestDataOfferDescription1")} />
        <MarkdownText data={translator("dataOffer.onRequestDataOfferDescription2")} />
      </div>
    );
  }

  return <></>;
}
