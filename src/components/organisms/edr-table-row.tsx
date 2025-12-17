import { Table } from "@/components/atoms/table.tsx";
import { T, useTranslator } from "@/i18n";
import { Edr, JsonLdObject } from "@think-it-labs/edc-connector-client";
import { useState } from "react";
import { proxyConnectorManagement } from "../../constants/proxy";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date";
import { Tooltip } from "@mui/material";
import { JsonLdDialog } from "../molecules/JsonLdDialog";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useSnackbar } from "notistack";
import { Snackbar } from "../molecules/snackbar";

export default function EdrTableRow({ edr }: { edr: Edr }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { translator } = useTranslator();
  const [edrDataAddress, setEdrDataAddress] = useState<JsonLdObject>();
  const [isEdrDialogOpen, setIsEdrDialogOpen] = useState(false);

  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  const handleShowDetails = async () => {
    try {
      const dataAddress = await client.management.edrs.dataAddress(edr.id);
      setEdrDataAddress(dataAddress);
      setIsEdrDialogOpen(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("", {
        content: (key) => (
          <Snackbar
            type="error"
            message={translator("edrs.failedToFetchEdr")}
            onClose={() => {
              closeSnackbar(key);
            }}
          />
        ),
      });
    }
  };

  return (
    <>
      <JsonLdDialog
        isOpen={isEdrDialogOpen}
        onClose={() => setIsEdrDialogOpen(false)}
        jsonLdObject={edrDataAddress}
        sensitiveFields={
          new Set([
            "endpoint",
            "authorization",
            "tokenEndpoint",
            "kafkaConsumerProperties",
          ])
        }
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

        <Table.Cell className="w-1/8">
          <button
            onClick={handleShowDetails}
            className="hover:underline cursor-pointer"
          >
            <T string="common.showDetails" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
