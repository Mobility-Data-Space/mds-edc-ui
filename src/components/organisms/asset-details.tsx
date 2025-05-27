import React, {useEffect, useMemo, useState} from "react";
import dynamic from "next/dynamic";
import {ReactJsonViewProps} from "react-json-view";
import {Chip} from "@mui/material";
import Divider from "@mui/material/Divider";

import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";

import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text";
import FieldGrid from "@/components/molecules/field-grid.tsx";
import {T} from "@/i18n";
import {ASSET_KEYWORDS, ASSET_DESCRIPTION} from "@/schema/asset";
import { assetFieldsToShow, assetPrivateFieldsToShow} from "@/utilities/asset";

interface AssetDetailsProps {
  asset: Asset;
  participantId: string;
  connectorEndpoint: string;
}

export default function AssetDetails({ asset, participantId, connectorEndpoint }: AssetDetailsProps) {

  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const description = readValue(asset.properties, ASSET_DESCRIPTION);

  const [shownFields, privateFields] = useMemo(() => [
    assetFieldsToShow(asset, participantId, connectorEndpoint),
    assetPrivateFieldsToShow(asset)
  ], [asset]);

  const [ReactJson, setReactJson] = useState<React.ComponentType<ReactJsonViewProps>>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReactJson(dynamic(import("react-json-view"), { ssr: false }));
    }
  }, [])

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
        <FieldGrid fields={shownFields}/>
        <FieldGrid fields={privateFields} label="assets.new.privateProperties"/>
      </div>
    </div>
  );
}
