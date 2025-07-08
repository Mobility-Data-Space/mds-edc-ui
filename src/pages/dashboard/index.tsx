import SideDrawer from "@/components/organisms/side-drawer";
import {T, useTranslator} from "@/i18n";
import {EdcInfoCard} from "@/components/molecules/edc-info-card.tsx";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";
import {EdcAboutCard} from "@/components/molecules/edc-about-card.tsx";
import {EdcUIAboutCard} from "@/components/molecules/edc-ui-about-card.tsx";
import {EdcProperties} from "@/components/molecules/edc-properties.tsx";
import {useEdcEntitiesCount} from "@/hooks/use-edc-entities-count.ts";
import {EdcEntitiesCountGrid} from "@/components/molecules/edc-entities-count-grid.tsx";
import {useEdcFields} from "@/hooks/use-edc-fields.ts";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {useEffect, useState} from "react";
import { TransferProcessStatusChartCard } from "@/components/molecules/transfer-process-status-chart-card.tsx";

export default function ConnectorPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const entitiesCount = useEdcEntitiesCount()
  const edcFields = useEdcFields();
  const edcClient = useEdcConnectorClient({ management: connector.managementUrl });
  const [transferProcesses, setTransferProcesses] = useState<TransferProcess[]>([]);

  useEffect(() => {
    edcClient.management.transferProcesses.queryAll({ offset: 0 })
      .then(setTransferProcesses);
  }, [edcClient]);

  return (
    <SideDrawer title={<T string="dashboard.title" />}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="flex flex-col gap-y-3 xl:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TransferProcessStatusChartCard
              title="dashboard.incomingData"
              transferProcesses={transferProcesses.filter(transferProcess => transferProcess.type === "CONSUMER")}
            />
            <TransferProcessStatusChartCard
              title="dashboard.outgoingData"
              transferProcesses={transferProcesses.filter(transferProcess => transferProcess.type === "PROVIDER")}
            />
          </div>
          <EdcEntitiesCountGrid entitiesCount={entitiesCount} />
          <EdcProperties fields={edcFields} />
        </div>

        <div className="flex flex-col gap-y-3 xl:col-span-1">
          <EdcInfoCard
            name={connector.name}
            description={connector.description}
            managementUrl={connector.managementUrl}
            protocolUrl={connector.protocolUrl}
            translator={translator}
          />
          <EdcAboutCard />
          <EdcUIAboutCard />
        </div>
      </div>
    </SideDrawer>
  );
}
