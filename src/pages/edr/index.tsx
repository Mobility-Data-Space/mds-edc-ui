import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import PaginationControls from "@/components/molecules/pagination-controls";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { T } from "@/i18n";
import { EdrsList } from "@think-it-labs/edc-connector-ui/edr-list";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Table } from "../../components/atoms/table";
import { ErrorPopup } from "../../components/molecules/error-popup";
import EdrTableRow from "../../components/organisms/edr-table-row";
import { MAX_ITEMS } from "../../constants/lists";

export default function EdrsListPage() {
  const { query } = useRouter();
  const { connector } = useParticipantConnectorState();

  const updateQueryParams = useUpdateQueryParams();

  const navigateToPage = useCallback(
    (newPage: number) => {
      updateQueryParams({ page: String(newPage) });
    },
    [updateQueryParams],
  );

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="edrs.title" />}>
      <EdrsList
        managementUrl={proxyConnectorManagement}
        usePagination={true}
        navigate={navigateToPage}
        currentPage={parseInt(query.page as string) || 0}
        firstPage={0}
      >
        <div className="flex flex-wrap justify-end gap-4 pb-6 min-h-[56px]">
          <div className="flex justify-end items-center">
            <EdrsList.Pagination>
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
            </EdrsList.Pagination>
          </div>
        </div>

        <EdrsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.edrsLoadError"
            />
          )}
        </EdrsList.Error>

        <div className="flex gap-6 py-4" data-testid="contract-agreements-list">
          <div className="flex flex-col flex-wrap gap-4 flex-1 min-h-[60vh]">
            <Table className="w-full">
              <Table.Head>
                <Table.Row>
                  <Table.Heading className="min-w-0">
                    <T string="edrs.assetId" />
                  </Table.Heading>

                  <Table.Heading className="min-w-0">
                    <T string="edrs.createdAt" />
                  </Table.Heading>

                  <Table.Heading className="min-w-0">
                    <T string="edrs.providerId" />
                  </Table.Heading>

                  <Table.Heading className="min-w-0">
                    <T string="edrs.endpoint" />
                  </Table.Heading>

                  <Table.Heading className="min-w-0">
                    <T string="edrs.authorization" />
                  </Table.Heading>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <EdrsList.Items
                  limit={30}
                  sortOrder="DESC"
                  sortField="createdAt"
                >
                  {({ item, index }) => <EdrTableRow key={index} edr={item} />}
                </EdrsList.Items>
              </Table.Body>
            </Table>
            <EdrsList.Loading>
              <div className="size-full min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            </EdrsList.Loading>
          </div>
        </div>
      </EdrsList>
    </SideDrawer>
  );
}
