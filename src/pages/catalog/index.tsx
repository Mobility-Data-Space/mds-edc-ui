import { Table } from "@/components/atoms/table";
import { ConnectorStatus } from "@/components/organisms/connector-status";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { DATASPACE } from "@/constants/dataspace";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";

export default function CatalogsPage() {
  const { push } = useConnectorDashboardState();

  return (
    <ConnectorDashboard>
      <ConnectorDashboard.Section>
        <ConnectorDashboard.Title>
          <T string="title" />
        </ConnectorDashboard.Title>
        <ConnectorDashboard.Description>
          <T string="description" />
        </ConnectorDashboard.Description>
      </ConnectorDashboard.Section>

      <Table className="table table-auto">
        <Table.Head>
          <Table.Row>
            <Table.Heading className="w-16">
              #
            </Table.Heading>

            <Table.Heading>
              <T string="headingName" />
            </Table.Heading>

            <Table.Heading>
              <T string="headingStatus" />
            </Table.Heading>
          </Table.Row>
        </Table.Head>

        <Table.Body>

        </Table.Body>
      </Table>
    </ConnectorDashboard>
  );
}
