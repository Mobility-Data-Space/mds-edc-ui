import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback } from "react";
import { TransferProcessesList } from "@think-it-labs/edc-connector-ui/transfer-processes-list";
import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { useRouter } from "next/router";
import { List } from "@think-it-labs/edc-connector-ui/list";
import { MAX_ITEMS } from "../../constants/lists";
import TransferProcessTableRow from "@/components/organisms/transfer-process-table-row.tsx";

export default function TransferProcessesListPage() {
  const router = useRouter();
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;

  const currentPage = parseInt(router.query.page as string) || 0

  const navigate = useCallback((newPage: number) => {
    router.push(
      {
        href: window.location.href,
        query: {
          ...router.query,
          page: newPage,
        },
      },
    );
  }, [])

  return (
    <SideDrawer title={<T string="transferProcesses.title" />}>
      <TransferProcessesList
        managementUrl={managementUrl}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <div className="px-6 py-4 gap-3 flex justify-end border-gray-200">
          <List.Pagination>
            {({ decrementPage, incrementPage, hasNext, hasPrev }) =>
              <div className="inline-flex gap-x-2">
                <Button
                  variant="secondary"
                  onClick={decrementPage}
                  disabled={!hasPrev}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  onClick={incrementPage}
                  disabled={!hasNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            }
          </List.Pagination>
        </div>

        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
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
              >
                {({ item }) => (
                  <TransferProcessTableRow
                    key={item.id}
                    transferProcess={item}
                    managementUrl={managementUrl}
                    connectorEndpoint={connector.protocolUrl}
                    participantId={connector.id}
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
