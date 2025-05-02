import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-form";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function CreateAssetPage() {
  const { push } = useConnectorDashboardState();
  return (
    <SideDrawer title={<T string="policyDefinitions.new.title" />}>
      <AssetForm managementUrl="http://localhost:3000/api/19193/management">
        <ConnectorDashboard.Section className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => push("/policy-definitions")}
          >
            <T string="buttonCancel" />
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            <T string="buttonSave" />
          </Button>
        </ConnectorDashboard.Section>
      </AssetForm>
    </SideDrawer>
  );
}
