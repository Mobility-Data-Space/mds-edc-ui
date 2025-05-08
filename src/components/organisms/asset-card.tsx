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
  participantId: string,
  onClick?: () => void
}

export default function AssetCard({ asset, participantId, onClick = () => {} }: AssetCardProps) {
  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const slicedKeywords = keywords.slice(0, 3);
  const remainingKeywordsCount = keywords.length - slicedKeywords.length;

  const title = readValue(asset.properties, ASSET_TITLE);
  const description = truncate(readValue(asset.properties, ASSET_DESCRIPTION), 200);
  const version = readValue(asset.properties, ASSET_VERSION);

  return (
    <Card className="w-[300px]">
      <CardContent className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-4 items-start">
          <AssetIcon asset={asset} fontSize="large" />
          <div className="flex flex-col">
            <Typography variant="h4" className="!leading-none hover:underline cursor-pointer" onClick={onClick}>
              {title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {participantId}
            </Typography>
          </div>
        </div>

        <Typography className="line-clamp-5">
          {description}
        </Typography>

        <div className="flex flex-wrap gap-2">
          {version && <Chip className="font-medium text-sm !cursor-default" clickable label={version} key={-1} color="primary" />}
          {slicedKeywords.map((keyword: { "@value": string }, index: number) =>
            <Chip className="font-medium text-sm !cursor-default" clickable label={keyword["@value"]} key={index} />
          )}
          {remainingKeywordsCount <= 0 ? "" : <Chip className="font-medium text-sm !cursor-default" clickable label={`+${remainingKeywordsCount}`} key={slicedKeywords.length} />}
        </div>
      </CardContent>
    </Card>
  );
}
