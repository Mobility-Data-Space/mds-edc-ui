import { StateChip } from "@/components/atoms/state-chip";
import { Table } from "@/components/atoms/table";
import { JsonLdDialog } from "@/components/molecules/json-ld-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { DataFlow } from "@/domain/data-flow/model";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { T, useTranslator } from "@/i18n";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date";
import { Icon, Tooltip } from "@mui/material";
import { useState } from "react";

const directionIcon = (direction: DataFlow["direction"]) => {
  if (direction === "PULL") return "download";
  if (direction === "PUSH") return "upload";
  return "swap_vert";
};

export default function DataFlowTableRow({ dataFlow }: { dataFlow: DataFlow }) {
  const { translator } = useTranslator();
  const { showSnackbar } = useAppSnackbar();
  const [dataAddress, setDataAddress] = useState<unknown>();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleShowDataAddress = async () => {
    try {
      const response = await fetch(
        `${proxyConnectorManagement}/v4/dataflows/${encodeURIComponent(dataFlow.id)}/dataaddress`,
      );
      // A flow that has not produced a readable address yet (e.g. still being set
      // up, or a push flow) answers 404; that is expected, not a failure.
      if (response.status === 404) {
        showSnackbar({
          type: "info",
          message: translator("dataFlows.dataAddressUnavailable"),
          persist: false,
        });
        return;
      }
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      setDataAddress(await response.json());
      setIsAddressDialogOpen(true);
    } catch (error) {
      console.error(error);
      showSnackbar({
        type: "error",
        message: translator("dataFlows.failedToFetchDataAddress"),
        persist: false,
      });
    }
  };

  return (
    <>
      <JsonLdDialog
        title={<T string="dataFlows.dataAddressTitle" />}
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        jsonLdObject={dataAddress}
      />

      <JsonLdDialog
        title={<T string="dataFlows.detailsTitle" />}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        jsonLdObject={dataFlow.raw}
      />

      <Table.Row className="data-flow-row">
        <Table.Cell>
          <Tooltip title={dataFlow.transferType ?? ""}>
            <Icon color="secondary">{directionIcon(dataFlow.direction)}</Icon>
          </Tooltip>
        </Table.Cell>

        <Table.Cell>
          {dataFlow.stateTimestamp ? (
            <Tooltip
              title={formatDateTime(dataFlow.stateTimestamp, {
                showDayOfWeek: true,
              })}
            >
              <span>{formatDateTimeAgo(dataFlow.stateTimestamp)}</span>
            </Tooltip>
          ) : (
            "—"
          )}
        </Table.Cell>

        <Table.Cell>
          <p className="text-xs mb-1">{dataFlow.assetId ?? "—"}</p>
        </Table.Cell>

        <Table.Cell>
          <div className="flex gap-x-1 items-center">
            <StateChip state={dataFlow.state} didError={!!dataFlow.errorDetail} />
          </div>
        </Table.Cell>

        <Table.Cell>
          <p className="text-xs mb-1">{dataFlow.participantId ?? "—"}</p>
        </Table.Cell>

        <Table.Cell>
          <button
            onClick={handleShowDataAddress}
            className="hover:underline cursor-pointer flex items-center gap-x-1"
            data-testid="show-data-address"
          >
            <Icon style={{ fontSize: "15px" }} color="secondary">
              key
            </Icon>
            <T string="dataFlows.showDataAddress" />
          </button>
        </Table.Cell>

        <Table.Cell>
          <button
            onClick={() => setIsDetailsDialogOpen(true)}
            className="hover:underline cursor-pointer"
            data-testid="show-data-flow-details"
          >
            <T string="common.showDetails" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
