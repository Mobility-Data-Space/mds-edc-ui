import React from "react";
import Typography from "@mui/material/Typography";
import {T} from "@/i18n";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {CircularProgress, Icon, Tooltip} from "@mui/material";
import {formatDateTime, formatDateTimeAgo} from "@/utilities/utilities.ts";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {STATE_RUNNING, STATE_ERROR} from "@/constants/transfer-process.ts";
import {TransferProcessStateIcon} from "@/components/atoms/transfer-process-state-icon.tsx";

interface TransferProcessListProps {
  transferProcesses: TransferProcess[];
}

function readStateTimestamp(transferProcess: TransferProcess) {
  return readValue(
    removeJsonLdSchemaFromProperties(transferProcess),
    "stateTimestamp"
  );
}

export default function TransferProcessList({ transferProcesses }: TransferProcessListProps) {
  return (
    <div className={`flex flex-col gap-y-2.5`}>
      <Typography className="text-lg font-normal uppercase">
        <T string="transferProcesses.history" />
      </Typography>
      <div className="grid grid-cols-1 gap-2.5">
        {transferProcesses.length === 0 && <T string="transferProcesses.noItems" />}

        {transferProcesses.map((transferProcess) =>
          <div key={transferProcess.id} className="flex flex-row gap-x-2.5">
            <Icon className="mt-1.5">
              {transferProcess.type === "CONSUMER" ? "file_download" : "file_upload"}
            </Icon>

            <div>
              <Typography variant="body2" color="textDisabled" component="span" className="flex uppercase gap-x-1 items-center">
                <Tooltip title={formatDateTime(readStateTimestamp(transferProcess), { showDayOfWeek: true })}>
                  <span>{formatDateTimeAgo(readStateTimestamp(transferProcess))}</span>
                </Tooltip>
                <span>&#183;</span>
                <span>{transferProcess.state}</span>
                <TransferProcessStateIcon transferProcess={transferProcess} />
              </Typography>
              <Typography>
                {transferProcess.id}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
