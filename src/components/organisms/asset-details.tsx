import React, {useMemo} from "react";
import { T } from "@/i18n";
import {Asset} from "@think-it-labs/edc-connector-client";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import Typography from "@mui/material/Typography";
import {AssetIcon} from "@/components/atoms/asset-icon.tsx";
import {Chip, Icon, IconButton} from "@mui/material";
import {ASSET_KEYWORDS, ASSET_DESCRIPTION} from "@/schema/asset.ts";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text.tsx";
import Divider from "@mui/material/Divider";
import AssetFieldGrid from "@/components/molecules/asset-field-grid.tsx";
import {assetCustomFieldsToShow, assetFieldsToShow, assetPrivateFieldsToShow} from "@/utilities/asset.ts";

interface AssetDetailsProps {
  asset: Asset;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export default function AssetDetails({ asset, onEditClick, onDeleteClick }: AssetDetailsProps) {
  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const title = readValue(asset.properties, ASSET_TITLE) || "";
  const description = readValue(asset.properties, ASSET_DESCRIPTION);
  const shownFields = useMemo(() => assetFieldsToShow(asset), [asset]);

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex flex-row gap-x-4 justify-between">
        <div className="flex flex-row items-center">
          <AssetIcon asset={asset} fontSize="large"/>
          <div>
            <Typography variant="h4">
              {title}
            </Typography>
            {/* TODO: creatorOrganizationName or participant id */}
          </div>

        </div>
        <div>
          {onEditClick &&
            <IconButton onClick={onEditClick} >
              <EditIcon color="secondary" />
            </IconButton>
          }
          {onDeleteClick &&
            <IconButton onClick={onDeleteClick} >
              <DeleteIcon color="secondary" />
            </IconButton>
          }
        </div>
      </div>

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
