import { EdcAboutCard } from "@/components/molecules/edc-about-card.tsx";
import { EdcEntitiesCountGrid } from "@/components/molecules/edc-entities-count-grid.tsx";
import { EdcInfoCard } from "@/components/molecules/edc-info-card.tsx";
import { EdcProperties } from "@/components/molecules/edc-properties.tsx";
import { EdcUIAboutCard } from "@/components/molecules/edc-ui-about-card.tsx";
import { TransferProcessStatusChartCard } from "@/components/molecules/transfer-process-status-chart-card.tsx";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { GetManagedEDC } from "@/components/molecules/get-managed-edc-card";
import { useEdcEntitiesCount } from "@/hooks/use-edc-entities-count.ts";
import { useEdcFields } from "@/hooks/use-edc-fields.ts";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state.ts";
import { useVersionFields } from "@/hooks/use-version-fields.ts";
import { T, useTranslator } from "@/i18n";
import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import { useEffect, useState } from "react";

export default function ConnectorPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const entitiesCount = useEdcEntitiesCount();
  const edcFields = useEdcFields();
  const versionFields = useVersionFields();
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });
  const [transferProcesses, setTransferProcesses] = useState<TransferProcess[]>(
    [],
  );
  const [isLoadingTransferProcesses, setIsLoadingTransferProcesses] = useState(true);

  useEffect(() => {
    setIsLoadingTransferProcesses(true);
    edcClient.management.transferProcesses
      .queryAll({ offset: 0 })
      .then(setTransferProcesses)
      .finally(() => setIsLoadingTransferProcesses(false));
  }, [edcClient]);

  return (
    <SideDrawer title={<T string="dashboard.title" />}>
      <div
        className="grid grid-cols-1 xl:grid-cols-3 gap-5"
        data-testid="dashboard-widget"
      >
        <div className="flex flex-col gap-y-3 xl:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TransferProcessStatusChartCard
              data-testid="dashboard-incoming-data"
              title="dashboard.incomingData"
              transferProcesses={transferProcesses.filter(
                (transferProcess) => transferProcess.type === "CONSUMER",
              )}
              emptyMessage="dashboard.noConsumingTransferProcesses"
              isLoading={isLoadingTransferProcesses}
            />
            <TransferProcessStatusChartCard
              data-testid="dashboard-outgoing-data"
              title="dashboard.outgoingData"
              emptyMessage="dashboard.noProvidingTransferProcesses"
              transferProcesses={transferProcesses.filter(
                (transferProcess) => transferProcess.type === "PROVIDER",
              )}
              isLoading={isLoadingTransferProcesses}
            />
          </div>
          <EdcEntitiesCountGrid entitiesCount={entitiesCount} />
          <EdcProperties fields={edcFields} versionFields={versionFields} />
        </div>

        <div className="flex flex-col gap-y-3 xl:col-span-1">
          <EdcInfoCard
            name={connector.name}
            description={connector.description}
            managementUrl={connector.managementUrl}
            protocolUrl={connector.protocolUrl}
            translator={translator}
          />
          <GetManagedEDC />
          <EdcAboutCard />
          <EdcUIAboutCard />
        </div>
      </div>
    </SideDrawer>
  );
}
