import { Table } from "@/components/atoms/table";
import { ConnectorStatus } from "@/components/organisms/connector-status";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { DATASPACE } from "@/constants/dataspace";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";

export default function CatalogsPage() {
  const { push, useCase, environment } = useConnectorDashboardState();

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
          {DATASPACE.map(useCase as any, environment as any, (
            { id, name, defaultUrl },
            index,
          ) => (
            <Table.Row
              key={id}
              onClick={() => push(`/catalog/${id}`)}
            >
              <Table.Cell>
                <button
                  type="button"
                  className="flex items-center gap-x-2"
                >
                  <span className="text-sm text-gray-800">
                    {index + 1}
                  </span>
                </button>
              </Table.Cell>
              <Table.Cell>
                {name}
              </Table.Cell>
              <Table.Cell>
                <ConnectorStatus
                  className="grid grid-cols-4 gap-1 w-20"
                  defaultUrl={defaultUrl}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ConnectorDashboard>
  );
}
