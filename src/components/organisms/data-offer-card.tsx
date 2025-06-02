import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Chip} from "@mui/material";
import {Asset, Dataset} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {AssetIcon} from "@/components/atoms/asset-icon";
import {
  ASSET_DESCRIPTION,
  ASSET_KEYWORDS,
  ASSET_VERSION,
} from "@/schema/asset";
import {truncate} from "@/utilities/utilities";
import { datasetToAsset } from "@/utilities/catalog";

export interface DataOfferCardProps {
  dataset: Dataset,
  participantId: string,
  onClick?: () => void
}

export default function DataOfferCard({ dataset, participantId, onClick = () => {} }: DataOfferCardProps) {
  const asset_id = dataset["@id"] ;
  const keywords = dataset[ASSET_KEYWORDS] || [];
  const slicedKeywords = keywords.slice(0, 3);
  const remainingKeywordsCount = keywords.length - slicedKeywords.length;

  const description = truncate(readValue(dataset, ASSET_DESCRIPTION), 200);
  const version = readValue(dataset, ASSET_VERSION);

  return (
    <Card className="w-[300px]" onClick={onClick}>
      <CardContent className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-4 items-start">
          <AssetIcon asset={datasetToAsset(dataset)} fontSize="large" />
          <div className="flex flex-col">
            <Typography variant="h4" className="!leading-none hover:underline cursor-pointer">
              {asset_id}
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
