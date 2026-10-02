import { Table } from "@/components/atoms/table";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import TransferProcessTableRow from "@/components/organisms/transfer-process-table-row";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { TransferProcessesList } from "@think-it-labs/edc-connector-ui/transfer-processes-list";
import { MAX_ITEMS } from "@/constants/lists";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

export default function TransferProcessesListPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();


  const { currentPage, navigate } = useListPage();

  return (
    <TransferProcessesList
      managementUrl={proxyConnectorManagement}
      usePagination
      navigate={navigate}
      currentPage={currentPage}
      firstPage={0}
    >
      <ListToolbar
        search={
          <SearchBar
            searchTarget="assetId"
            placeholder={translator("transferProcesses.searchPlaceholder")}
            searchOperator="ilike"
          />
        }
        pagination={<TransferProcessesList.Pagination>{renderPagination}</TransferProcessesList.Pagination>}
      />

      <div
        className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200"
        data-testid="transfer-processes-list"
      >
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading className="w-16">
                <T string="transferProcesses.direction" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingLastUpdated" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingAsset" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingState" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingCounterpartyParticipantId" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingCounterpartyConnectorEndpoint" />
              </Table.Heading>

              <Table.Heading>
                <T string="transferProcesses.headingContractDetails" />
              </Table.Heading>

              <Table.Heading>
                <T string="common.showDetails" />
              </Table.Heading>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            <TransferProcessesList.Items
              limit={MAX_ITEMS}
              sortOrder="DESC"
              sortField="stateTimestamp"
            >
              {({ item }) => (
                <TransferProcessTableRow
                  key={item.id}
                  transferProcess={item}
                  managementUrl={proxyConnectorManagement}
                  connectorEndpoint={connector?.protocolUrl ?? ""}
                  participantId={connector?.id ?? ""}
                  data-testid="transfer-process-row"
                />
              )}
            </TransferProcessesList.Items>
          </Table.Body>
        </Table>
      </div>

      <TransferProcessesList.Loading>
        <LoadingSpinner />
      </TransferProcessesList.Loading>
    </TransferProcessesList>
  );
}

TransferProcessesListPage.titleKey = "transferProcesses.title";
