import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import {
  PolicyDefinitionView,
  usePolicyDefinitionContext,
} from "@think-it-labs/edc-connector-ui/policy-definition-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";

function DeletePolicyDefinition() {
  const { deleteItem } = usePolicyDefinitionContext();
  const { push } = useRouter();

  return (
    <Button
      variant="unstyled"
      onClick={async () => {
        await deleteItem();
        push("/policy-definitions");
      }}
    >
      Delete
    </Button>
  );
}

export default function AssetPage() {
  const id = useRouter().query.id as string;

  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <ConnectorDashboard>
      <PolicyDefinitionView
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
          <h3 className="text-lg font-bold text-gray-800">
            <PolicyDefinitionView.Id />
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            <PolicyDefinitionView.CreatedAt />
          </p>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section>
          <DeletePolicyDefinition />
        </ConnectorDashboard.Section>
      </PolicyDefinitionView>
    </ConnectorDashboard>
  );
}
