import React, {useEffect} from "react";
import {Card, CardContent, Typography} from "@mui/material";
import {T} from "@/i18n";
import {EdcInfoDisplayInput} from "@/components/atoms/edc-info-display-input.tsx";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import {QuerySpec} from "@think-it-labs/edc-connector-client";
import {EdcConnectorClientContext} from "@think-it-labs/edc-connector-client/dist/src/context";

export interface EdcEntityCountProps {
  label: string;
  count: number;
  className?: string;
}

export function EdcEntityCount({ label, count, className = "" }: EdcEntityCountProps): JSX.Element {
  return (
    <Card className={className} >
      <CardContent className="flex flex-col gap-y-4">
        <Typography className="!text-[81px] text-center" component="h2">
          {count}
        </Typography>
        <Typography variant="body1" color="textSecondary" className="text-center" component="h4">
          <T string={label} />
        </Typography>
      </CardContent>
    </Card>
  );
}
