import { TitleWithIcon } from "@/components/atoms/TitleWithIcon.tsx";
import { TransferProcessChartContent } from "@/components/molecules/transfer-process-chart-content.tsx";
import { T } from "@/i18n";
import { Card, CardContent, CircularProgress } from "@mui/material";
import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";
import React from "react";

interface TransferProcessStatusChartCardProps {
  title: string;
  transferProcesses: TransferProcess[];
  emptyMessage: string;
  isLoading?: boolean;
  "data-testid"?: string;
}

export function TransferProcessStatusChartCard({
  title,
  transferProcesses,
  emptyMessage,
  isLoading = false,
  "data-testid": dataTestId,
}: TransferProcessStatusChartCardProps) {
  return (
    <Card data-testid={dataTestId}>
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string={title} />}
          subtitle={<T string="dashboard.transferProcesses" />}
        />

        {isLoading && (
          <div className="flex items-center justify-center h-80 w-full">
            <CircularProgress />
          </div>
        )}

        {!isLoading && !transferProcesses.length && (
          <div className="flex items-center justify-center h-80 w-full">
            <span className="uppercase text-mds-gray">
              <T string={emptyMessage} />
            </span>
          </div>
        )}

        {!isLoading && transferProcesses.length > 0 && (
          <TransferProcessChartContent
            title={title}
            transferProcesses={transferProcesses}
          />
        )}
      </CardContent>
    </Card>
  );
}
