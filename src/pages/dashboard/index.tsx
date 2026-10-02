import { EdcAboutCard } from "@/components/molecules/edc-about-card";
import { EdcEntitiesCountGrid } from "@/components/molecules/edc-entities-count-grid";
import { EdcInfoCard } from "@/components/molecules/edc-info-card";
import { EdcProperties } from "@/components/molecules/edc-properties";
import { EdcUIAboutCard } from "@/components/molecules/edc-ui-about-card";
import { TransferProcessStatusChartCard } from "@/components/molecules/transfer-process-status-chart-card";
import { proxyConnectorManagement } from "@/constants/proxy";
import { GetManagedEDC } from "@/components/molecules/get-managed-edc-card";
import { useEdcEntitiesCount } from "@/hooks/use-edc-entities-count";
import { useEdcFields } from "@/hooks/use-edc-fields";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useVersionFields } from "@/hooks/use-version-fields";
import { useTranslator } from "@/i18n";
import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
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
  const [isLoadingTransferProcesses, setIsLoadingTransferProcesses] =
    useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setting loading state before async call is a valid pattern
    setIsLoadingTransferProcesses(true);
    edcClient.management.transferProcesses
      .queryAll({ offset: 0 })
      .then(setTransferProcesses)
      .finally(() => setIsLoadingTransferProcesses(false));
  }, [edcClient]);

  return (
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
          name={connector?.name ?? ""}
          description={connector?.description}
          managementUrl={connector?.managementUrl ?? ""}
          protocolUrl={connector?.protocolUrl ?? ""}
          translator={translator}
        />
        <GetManagedEDC />
        <EdcAboutCard />
        <EdcUIAboutCard />
      </div>
    </div>
  );
}

ConnectorPage.titleKey = "dashboard.title";
