import { Table } from "@/components/atoms/table.tsx";
import { T } from "@/i18n";
import { Edr } from "@think-it-labs/edc-connector-client";
import { Eye, EyeOff } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { proxyConnectorManagement } from "../../constants/proxy";
import EdrDialog from "./edr-dialog";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date";
import { Tooltip } from "@mui/material";
import { EdrView } from "@think-it-labs/edc-connector-ui/edr-view";

export default function EdrTableRow({ edr }: { edr: Edr }) {
  const [isEdrDialogOpen, setIsEdrDialogOpen] = useState(false);
  return (
    <>
      <EdrDialog
        edr={edr}
        open={isEdrDialogOpen}
        onClose={() => setIsEdrDialogOpen(false)}
      />

      <Table.Row className="edr-row">
        <Table.Cell className="w-1/8">
          <div className="text-xs mb-1">
            <p className="text-xs mb-1">{edr.assetId}</p>
          </div>
        </Table.Cell>

        <Table.Cell className="w-1/8">
          <Tooltip
            title={formatDateTime(+edr.createdAt, { showDayOfWeek: true })}
          >
            <span>{formatDateTimeAgo(+edr.createdAt)}</span>
          </Tooltip>
        </Table.Cell>
        <Table.Cell className="w-1/8">
          <div className="text-xs mb-1">
            <p className="text-xs mb-1">{edr.providerId}</p>
          </div>
        </Table.Cell>

        <Table.Cell className="w-2/8">
          <div className="flex flex-col gap-y-2">
            <HiddenDetails>
              <EdrView id={edr.id} managementUrl={proxyConnectorManagement}>
                <EdrView.Loading
                  fallback={
                    <div>
                      <T string="common.loading" />
                    </div>
                  }
                >
                  <EdrView.Properties.Endpoint />
                </EdrView.Loading>
              </EdrView>
            </HiddenDetails>
          </div>
        </Table.Cell>

        <Table.Cell className="w-2/8">
          <div className="flex flex-col gap-y-2">
            <EdrView id={edr.id} managementUrl={proxyConnectorManagement}>
              <HiddenDetails>
                <EdrView.Loading
                  fallback={
                    <div>
                      <T string="common.loading" />
                    </div>
                  }
                >
                  <EdrView.Properties.Authorization />
                </EdrView.Loading>
              </HiddenDetails>
            </EdrView>
          </div>
        </Table.Cell>

        <Table.Cell className="w-1/8">
          <button
            onClick={() => setIsEdrDialogOpen(true)}
            className="hover:underline cursor-pointer"
          >
            <T string="common.showDetails" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
}

function HiddenDetails({ children }: PropsWithChildren) {
  const [isDetailsShown, setIsDetailsShown] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={() => setIsDetailsShown(!isDetailsShown)}
        title={isDetailsShown ? "Hide details" : "Show details"}
      >
        {isDetailsShown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {isDetailsShown && (
        <div className="font-mono text-xs w-full min-w-0 max-w-xs">
          <div className="whitespace-pre-wrap break-words bg-gray-50 p-2 rounded border">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
