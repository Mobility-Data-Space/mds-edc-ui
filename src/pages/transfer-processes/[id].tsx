import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { TransferProcessView } from "@think-it-labs/edc-connector-ui/transfer-process-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";

export default function TransferProcessViewPage() {
  const id = useRouter().query.id as string;

  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <ConnectorDashboard>
      <TransferProcessView
        id={id}
        managementUrl={managementUrl}
      >
        <ConnectorDashboard.Section>
          <ConnectorDashboard.Title>
            <T string="title" />
          </ConnectorDashboard.Title>
          <ConnectorDashboard.Description>
            <T string="description" />
          </ConnectorDashboard.Description>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section>
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
        </ConnectorDashboard.Section>
      </TransferProcessView>
    </ConnectorDashboard>
  );
}
