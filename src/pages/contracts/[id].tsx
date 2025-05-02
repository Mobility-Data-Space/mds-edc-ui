import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function ContractAgreementViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <SideDrawer title={<T string="contractAgreements.[id].title" />}>
      <ContractAgreementView
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
        </ConnectorDashboard.Section>
      </ContractAgreementView>
    </SideDrawer>
  );
}
