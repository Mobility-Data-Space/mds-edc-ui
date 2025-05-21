
import { TransferProcessView } from "@think-it-labs/edc-connector-ui/transfer-process-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function TransferProcessViewPage() {
  const id = useRouter().query.id as string;

  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  
  return (
    <SideDrawer title={<T string="transferProcesses.[id].title" />}>
      <TransferProcessView
        id={id}
        managementUrl={managementUrl}
      >
        <ul>
          <li>
            <TransferProcessView.Id />
          </li>
          <li>
            <TransferProcessView.AssetId />
          </li>
          <li>
            <TransferProcessView.ContractId />
          </li>
          <li>
            <TransferProcessView.ConnectorId />
          </li>
          <li>
            <TransferProcessView.CorrelationId />
          </li>
        </ul>
      </TransferProcessView>
    </SideDrawer>
  );
}
