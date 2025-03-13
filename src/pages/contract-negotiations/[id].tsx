import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import {
  ContractNegotiationView,
} from "@think-it-labs/edc-connector-ui/contract-negotiation-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";

export default function ContractNegotiationViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <ConnectorDashboard>
      <ContractNegotiationView
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
              <T string="fieldId" />: <ContractNegotiationView.Id />
            </li>
            <li>
              <T string="fieldContractAgreementId" />:{" "}
              <ContractNegotiationView.ContractAgreementId />
            </li>
            <li>
              <T string="fieldCounterPartyAddress" />:{" "}
              <ContractNegotiationView.CounterPartyAddress />
            </li>
            <li>
              <T string="fieldErrorDetail" />:{" "}
              <ContractNegotiationView.ErrorDetail />
            </li>
          </ul>
        </ConnectorDashboard.Section>
      </ContractNegotiationView>
    </ConnectorDashboard>
  );
}
