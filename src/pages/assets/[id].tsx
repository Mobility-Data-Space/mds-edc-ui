import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import {
  AssetView,
  useAssetContext,
} from "@think-it-labs/edc-connector-ui/asset-view";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";

function DeleteAsset() {
//  const { deleteItem } = useAssetContext();
  const { push } = useRouter();

  return (
    <Button
      variant="unstyled"
      onClick={async () => {
//        await deleteItem();
        push("/assets");
      }}
    >
      <T string="deleteButton" />
    </Button>
  );
}

export default function AssetPage() {
  const id = useRouter().query.id as string;
  const { connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <ConnectorDashboard>
      <AssetView
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
            <AssetView.Name />
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            <AssetView.Id />
          </p>
          <div className="mt-2">
            <h2>
              <T string="dataAddress" />
            </h2>
            <ul className="marker:text-blue-600 list-disc ps-5 space-y-2 text-sm text-gray-600">
              <li>
                <AssetView.DataAddress.Name />
              </li>
              <li>
                <AssetView.DataAddress.Type />
              </li>
              <li>
                <AssetView.DataAddress.MandatoryValue
                  prefix="edc"
                  name="baseUrl"
                />
              </li>
            </ul>
          </div>
        </ConnectorDashboard.Section>
        <ConnectorDashboard.Section>
          <DeleteAsset />
        </ConnectorDashboard.Section>
      </AssetView>
    </ConnectorDashboard>
  );
}
