import React, {useMemo} from "react";
import { T } from "@/i18n";
import {Asset, ContractDefinition} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {ASSET_KEYWORDS, ASSET_DESCRIPTION} from "@/schema/asset.ts";
import {Button, Chip, Icon, Tooltip} from "@mui/material";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text.tsx";
import Divider from "@mui/material/Divider";
import AssetFieldGrid from "@/components/molecules/asset-field-grid.tsx";
import {assetCustomFieldsToShow, assetFieldsToShow, assetPrivateFieldsToShow} from "@/utilities/asset.ts";
import {AssetFieldShow} from "@/components/molecules/asset-field-show.tsx";
import Typography from "@mui/material/Typography";

interface AssetDetailsProps {
  asset: Asset;
  participantId: string;
  connectorEndpoint: string;
  contractDefinitions?: ContractDefinition[];
  assetIsOwned: boolean;
}

export default function AssetDetails({ asset, participantId, connectorEndpoint, contractDefinitions, assetIsOwned = true }: AssetDetailsProps) {
  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const description = readValue(asset.properties, ASSET_DESCRIPTION);
  const [shownFields, privateFields, customFields] = useMemo(() => [
    assetFieldsToShow(asset, participantId, connectorEndpoint),
    assetPrivateFieldsToShow(asset),
    assetCustomFieldsToShow(asset),
  ], [asset]);

  return (
    <div className="flex flex-col gap-y-2.5">
      <div>
        {description ?
          <MarkdownCollapsableText data={description}/> :
          <T string="assets.new.noDescription" />
        }
      </div>

      <Divider />

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword: { "@value": string }, index: number) =>
          <Chip className="font-medium text-sm !cursor-default" clickable label={keyword["@value"]} key={index} />
        )}
      </div>

      <div className="flex flex-col gap-y-9">
        <AssetFieldGrid fields={shownFields}/>
        <AssetFieldGrid fields={customFields} label="assets.new.customProperties"/>
        <AssetFieldGrid fields={privateFields} label="assets.new.privateProperties"/>

        <div className="flex flex-col gap-y-4">
          {contractDefinitions && contractDefinitions.map((contractAgreement, index) => (
            <div key={index} >
              <Typography className="uppercase">
                <T string="contractDefinitions.contractOffer" />
                {contractDefinitions.length < 2 ? "" : (" " + (index + 1))}
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [overflow-wrap:anywhere]">
                <AssetFieldShow icon="category" label="contractDefinitions.id" value={contractAgreement["@id"]}/>
              </div>
              <Tooltip title={<T string="contractNegotiations.cannotNegotiateOwnedConnectors" />} disableHoverListener={! assetIsOwned} disableFocusListener={! assetIsOwned} >
                <span className="float-right">
                  <Button disabled={assetIsOwned} color="secondary" variant="contained">
                    <T string="common.negotiate" />
                  </Button>
                </span>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
