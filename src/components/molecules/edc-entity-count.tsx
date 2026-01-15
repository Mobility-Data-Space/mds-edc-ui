import { T } from "@/i18n";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

export interface EdcEntityCountProps {
  label: string;
  count: number;
  className?: string;
  "data-testid"?: string;
}

export function EdcEntityCount({ label, count, className = "", "data-testid": dataTestId }: EdcEntityCountProps): React.ReactElement {
  return (
    <Card className={className} data-testid={dataTestId} >
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
