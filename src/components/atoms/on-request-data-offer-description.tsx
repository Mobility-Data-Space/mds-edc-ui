import React from "react";
import {Asset} from "@think-it-labs/edc-connector-client";
import Typography from "@mui/material/Typography";
import {T} from "@/i18n";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {DataAddressTypes} from "@/utilities/data-address.ts";

export function OnRequestDataOfferDescription({ asset }: { asset: Asset }): JSX.Element {
  const dataAddress = removeJsonLdSchemaFromProperties(asset.dataAddress);
  const type = readValue(dataAddress, "type");

  if (type === DataAddressTypes.MDSOnRequestOffer) {
    return (
      <div>
        <Typography className="text-lg font-normal uppercase">
          <T string="dataOffer.onRequestDataOfferTitle" />
        </Typography>
        <Typography>
          <T string="dataOffer.onRequestDataOfferDescription1" />
        </Typography>
        <Typography>
          <T string="dataOffer.onRequestDataOfferDescription2" />
        </Typography>
      </div>
    );
  }

  return <></>;
}
