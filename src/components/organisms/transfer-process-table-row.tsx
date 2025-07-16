import React, {useEffect, useState} from "react";
import {Icon, Tooltip} from "@mui/material";
import {Asset, ContractAgreement, ContractNegotiation} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {T} from "@/i18n";
import {Table} from "@/components/atoms/table.tsx";
import {TransferProcessIcon} from "@/components/atoms/transfer-process-icon.tsx";
import {TransferProcessStateIcon} from "@/components/atoms/transfer-process-state-icon.tsx";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import AssetDialog from "@/components/organisms/asset-dialog.tsx";
import {JsonLdDialog} from "@/components/molecules/JsonLdDialog.tsx";
import {useTransferProcessJsonLd} from "@/hooks/use-transfer-process-json-ld.ts";
import {formatDateTime, formatDateTimeAgo} from "@/utilities/date.ts";
import {StateChip} from "@/components/atoms/state-chip.tsx";
import {theme} from "@/theme/ThemeProvider.tsx";

interface AssetDetailsProps {
  transferProcess: TransferProcess;
  managementUrl: string;
  connectorEndpoint: string;
  participantId: string;
}

export default function TransferProcessTableRow({ transferProcess, managementUrl, connectorEndpoint, participantId }: AssetDetailsProps) {
  const cleanedTransferProcess = removeJsonLdSchemaFromProperties(transferProcess);
  const stateTimestamp = readValue(cleanedTransferProcess, "stateTimestamp");
  const edcClient = useEdcConnectorClient({ management: managementUrl });
  const [assetDialogIsOpen, setAssetDialogIsOpen] = useState(false);
  const [transferProcessDialogIsOpen, setTransferProcessDialogIsOpen] = useState(false);
  const [contractNegotiation, setContractNegotiation] = useState({} as ContractNegotiation);
  const [contractAgreement, setContractAgreement] = useState({} as ContractAgreement);
  const [asset, setAsset] = useState({} as Asset);

  useEffect(() => {
    if (!transferProcess.contractId) {
      return;
    }

    edcClient.management.contractAgreements.getNegotiation(transferProcess.contractId)
      .then((negotiation) => {
        const cleanNegotiation = removeJsonLdSchemaFromProperties(negotiation);
        setContractNegotiation({
          ...negotiation,
          counterPartyId: readValue(cleanNegotiation, "counterPartyId"),
          counterPartyAddress: readValue(cleanNegotiation, "counterPartyAddress"),
        } as unknown as ContractNegotiation);
      })
      .catch(() => setContractNegotiation({} as ContractNegotiation));

    edcClient.management.contractAgreements.get(transferProcess.contractId)
      .then(setContractAgreement)
      .catch(() => setContractAgreement({} as ContractAgreement));
  }, [edcClient, transferProcess.contractId]);

  useEffect(() => {
    if (!transferProcess.assetId) {
      return;
    }

    edcClient.management.assets.get(transferProcess.assetId)
      .then(setAsset)
      .catch(() => setAsset({} as Asset));
  }, [edcClient, transferProcess.assetId]);

  const jsonLdObject = useTransferProcessJsonLd(transferProcess, contractNegotiation);

  return (
    <>
      <AssetDialog
        asset={asset}
        participantId={participantId}
        connectorEndpoint={connectorEndpoint}
        open={assetDialogIsOpen}
        onClose={() => setAssetDialogIsOpen(false)}
      />

      <JsonLdDialog
        isOpen={transferProcessDialogIsOpen}
        onClose={() => setTransferProcessDialogIsOpen(false)}
        jsonLdObject={jsonLdObject}
      />

      <Table.Row className="transfer-process-row">
        <Table.Cell>
          <TransferProcessIcon transferProcess={transferProcess} />
        </Table.Cell>

        <Table.Cell>
          <Tooltip title={formatDateTime(stateTimestamp, { showDayOfWeek: true })}>
            <span>{formatDateTimeAgo(stateTimestamp)}</span>
          </Tooltip>
        </Table.Cell>

        <Table.Cell>
          <div
            className={`text-xs mb-1 ${asset.id ? "hover:underline cursor-pointer" : ""}`}
            {...(asset.id ? { onClick: () => setAssetDialogIsOpen(true) } : {})}
          >
            {asset.id && <Icon style={{ fontSize: "15px" }}>open_in_new</Icon>}
            <p className="text-xs mb-1">
              {asset.id || transferProcess.assetId}
            </p>
          </div>
        </Table.Cell>

        <Table.Cell>
          <div className="flex gap-x-1 items-center">
            <StateChip state={transferProcess.state} icon={<TransferProcessStateIcon transferProcess={transferProcess} />} />
          </div>
        </Table.Cell>

        <Table.Cell>
          {contractNegotiation.counterPartyId}
        </Table.Cell>
        <Table.Cell>
          {contractNegotiation.counterPartyAddress}
        </Table.Cell>
        <Table.Cell>
          <p className="text-xs italic mb-1">
            {`${contractAgreement.providerId} → ${contractAgreement.consumerId}`}
          </p>
          <p className="font-semibold">
            {contractAgreement.id}
          </p>
        </Table.Cell>
        <Table.Cell>
          <span
            className="hover:underline cursor-pointer"
            onClick={() => setTransferProcessDialogIsOpen(true)}
          >
            <T string="common.showDetails" />
          </span>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
