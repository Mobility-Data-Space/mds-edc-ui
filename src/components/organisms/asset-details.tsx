import React, {useMemo} from "react";
import { T } from "@/i18n";
import {Asset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {ASSET_KEYWORDS, ASSET_DESCRIPTION} from "@/schema/asset.ts";
import {Chip} from "@mui/material";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text.tsx";
import Divider from "@mui/material/Divider";
import AssetFieldGrid from "@/components/molecules/asset-field-grid.tsx";
import {assetCustomFieldsToShow, assetFieldsToShow, assetPrivateFieldsToShow} from "@/utilities/asset.ts";

interface AssetDetailsProps {
  asset: Asset;
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const description = readValue(asset.properties, ASSET_DESCRIPTION);
  const shownFields = useMemo(() => assetFieldsToShow(asset), [asset]);

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
      </div>
    </div>
  );
}
