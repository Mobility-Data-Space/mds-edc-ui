import { AssetIcon } from "@/components/atoms/asset-icon";
import {
  ASSET_DESCRIPTION,
  ASSET_KEYWORDS,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/schema/asset";
import { datasetToAsset } from "@/utilities/catalog";
import { truncate } from "@/utilities/utilities";
import { Card, CardContent, Chip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Dataset } from "@think-it-labs/edc-connector-client";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";

export interface DataOfferCardProps {
  dataset: Dataset,
  participantId: string,
  onClick?: () => void
  dataTestId?: string;
}

export default function DataOfferCard({ dataset, participantId, dataTestId, onClick = () => { } }: DataOfferCardProps) {
  const assetTitle = readValue(dataset, ASSET_TITLE)
  const keywords = dataset[ASSET_KEYWORDS] || [];
  const slicedKeywords = keywords.slice(0, 3);
  const remainingKeywordsCount = keywords.length - slicedKeywords.length;

  const description = truncate(readValue(dataset, ASSET_DESCRIPTION), 200);
  const version = readValue(dataset, ASSET_VERSION);

  return (
    <Card className="w-[300px]" onClick={onClick} data-testid={dataTestId}>
      <CardContent className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-4 items-start">
          <AssetIcon asset={datasetToAsset(dataset)} fontSize="large" />
          <div className="flex flex-col">
            <Typography variant="h4" className="title !leading-none hover:underline cursor-pointer" data-testid="asset-title">
              {assetTitle}
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
    </Card >
  );
}
