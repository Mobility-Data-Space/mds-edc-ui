import { Table } from "@/components/atoms/table";
import { Snackbar } from "@/components/molecules/snackbar";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import SideDrawer from "@/components/organisms/side-drawer";
import TransferProcessTableRow from "@/components/organisms/transfer-process-table-row.tsx";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { TransferProcessesList } from "@think-it-labs/edc-connector-ui/transfer-processes-list";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { MAX_ITEMS } from "../../constants/lists";
import { proxyConnectorManagement } from "@/constants/proxy";
import SearchInput, { useCriterionSearchInput } from "@/components/molecules/search-input";

export default function TransferProcessesListPage() {
  const router = useRouter();
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();

  const criterionFilter = useCriterionSearchInput({
    searchTerm: router.query.q as string,
    operandLeft: "assetId",
    operator: "ilike",
  })

  const currentPage = parseInt(router.query.page as string) || 0;

  const navigate = useCallback(
    (newPage: number) => {
      router.push({
        href: window.location.href,
        query: {
          ...router.query,
          page: newPage,
        },
      });
    },
    [router],
  );

  return (
    <SideDrawer title={<T string="transferProcesses.title" />}>
      <TransferProcessesList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <div className="flex justify-between pb-6">
          <div className="flex justify-start gap-x-5 items-center">
            <div className="min-w-xl">
              <SearchInput
                placeholder={translator("transferProcesses.searchPlaceholder")}
              />
            </div>
          </div>
          <div className="flex justify-end items-center">
            <TransferProcessesList.Pagination>
              {({
                decrementPage,
                hasPrev,
                hasNext,
                incrementPage,
                page,
                itemsCount,
              }) => (
                <PaginationControls
                  page={page}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  decrementPage={decrementPage}
                  incrementPage={incrementPage}
                  maxItems={MAX_ITEMS}
                  dataTestIdPrefix="pagination"
                  itemsCount={itemsCount}
                />
              )}
            </TransferProcessesList.Pagination>
          </div>
        </div>

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
                filterExpression={criterionFilter}
              >
                {({ item }) => (
                  <TransferProcessTableRow
                    key={item.id}
                    transferProcess={item}
                    managementUrl={proxyConnectorManagement}
                    connectorEndpoint={connector.protocolUrl}
                    participantId={connector.id}
                    data-testid="transfer-process-row"
                  />
                )}
              </TransferProcessesList.Items>
            </Table.Body>
          </Table>
        </div>

        <TransferProcessesList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </TransferProcessesList.Loading>
      </TransferProcessesList>
    </SideDrawer>
  );
}
