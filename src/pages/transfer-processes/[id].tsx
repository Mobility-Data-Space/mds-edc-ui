
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
        <ul className="marker:text-blue-600 list-disc ps-5 space-y-2 text-sm text-gray-600">
          <li>
            <T string="fieldId" />: <TransferProcessView.Id />
          </li>
          <li>
            <T string="fieldAsset" />: <TransferProcessView.AssetId />
          </li>
          <li>
            <T string="fieldCorrelationId" />:{" "}
            <TransferProcessView.CorrelationId />
          </li>
        </ul>
      </TransferProcessView>
    </SideDrawer>
  );
}
