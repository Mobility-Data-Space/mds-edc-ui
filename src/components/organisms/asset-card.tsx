import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Chip} from "@mui/material";
import {Asset} from "@think-it-labs/edc-connector-client";
import {AssetIcon} from "@/components/atoms/asset-icon.tsx";
import {
  ASSET_DESCRIPTION,
  ASSET_KEYWORDS,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/schema/asset.ts";
import {JsonLdValue, readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {truncate} from "@/utilities/utilities.ts";

export interface AssetCardProps {
  asset: Asset,
  onClick?: () => void
}

export default function AssetCard({ asset, onClick = () => {} }: AssetCardProps) {
  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const slicedKeywords = keywords.slice(0, 3);
  const remainingKeywordsCount = keywords.length - slicedKeywords.length;

  return (
    <Card className="w-[300px]">
      <CardContent className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-4 items-center">
          <AssetIcon asset={asset} fontSize="large" />
          <Typography variant="h4" className="hover:underline cursor-pointer" onClick={onClick}>
            {readValue(asset.properties, ASSET_TITLE)}
          </Typography>

          {/* TODO: creatorOrganizationName or participant id */}
        </div>

        <Typography className="line-clamp-5">
          {truncate(readValue(asset.properties, ASSET_DESCRIPTION), 200)}
        </Typography>

        <div className="flex flex-wrap gap-2">
          {readValue(asset.properties, ASSET_VERSION) && <Chip className="font-medium text-sm !cursor-default" clickable label={readValue(asset.properties, ASSET_VERSION)} key={-1} color="primary" />}
          {slicedKeywords.map((keyword: { "@value": string }, index: number) =>
            <Chip className="font-medium text-sm !cursor-default" clickable label={keyword["@value"]} key={index} />
          )}
          {remainingKeywordsCount <= 0 ? "" : <Chip className="font-medium text-sm !cursor-default" clickable label={`+${remainingKeywordsCount}`} key={slicedKeywords.length} />}
        </div>
      </CardContent>
    </Card>
  );
}
