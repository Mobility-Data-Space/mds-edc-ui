import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import {
  ContractDefinitionView,
  useContractDefinitionContext,
} from "@think-it-labs/edc-connector-ui/contract-definition-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

function DeleteContractDefinition() {
  const { deleteItem } = useContractDefinitionContext();
  const { push } = useRouter();

  return (
    <Button
      variant="unstyled"
      onClick={async () => {
        await deleteItem();
        push("/my-assets");
      }}
    >
      Delete
    </Button>
  );
}

export default function ContractDefinitionViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <SideDrawer title={<T string="contractDefinitions.[id].title" />}>
      <ContractDefinitionView
        id={id}
        managementUrl={managementUrl}
      >
        <ConnectorDashboard.Section>
          <h3 className="text-lg font-bold text-gray-800">
            <ContractDefinitionView.Id />
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            <ContractDefinitionView.CreatedAt />
          </p>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section>
          <DeleteContractDefinition />
        </ConnectorDashboard.Section>
      </ContractDefinitionView>
    </SideDrawer>
  );
}
