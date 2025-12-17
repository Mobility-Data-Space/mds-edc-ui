import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import PaginationControls from "@/components/molecules/pagination-controls";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { T, useTranslator } from "@/i18n";
import { EdrsList } from "@think-it-labs/edc-connector-ui/edr-list";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Table } from "../../components/atoms/table";
import { ErrorPopup } from "../../components/molecules/error-popup";
import EdrTableRow from "../../components/organisms/edr-table-row";
import { MAX_ITEMS } from "../../constants/lists";
import SearchBar from "@/components/molecules/search-bar";

export default function EdrsListPage() {
  const { query } = useRouter();
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();

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
        <div className="flex justify-between pb-6">
          <div className="flex justify-start gap-x-5 items-center">
            <div className="min-w-xl">
              <SearchBar
                searchTarget="assetId"
                placeholder={translator("edrs.searchPlaceholder")}
                searchOperator="ilike"
              />
            </div>
          </div>
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
                  <Table.Heading className="w-1/8">
                    <T string="edrs.assetId" />
                  </Table.Heading>

                  <Table.Heading className="w-1/8">
                    <T string="edrs.createdAt" />
                  </Table.Heading>

                  <Table.Heading className="w-1/8">
                    <T string="edrs.providerId" />
                  </Table.Heading>

                  <Table.Heading className="w-1/8">Details</Table.Heading>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <EdrsList.Items
                  emptyMessage={
                    <Table.Row>
                      <Table.Cell
                        colSpan={6}
                        className="text-center py-16 !text-2xl"
                      >
                        <T string="edrs.noEdrsFound" />
                      </Table.Cell>
                    </Table.Row>
                  }
                  limit={MAX_ITEMS}
                  sortOrder="DESC"
                  sortField="createdAt"
                >
                  {({ item, index }) => <EdrTableRow key={index} edr={item} />}
                </EdrsList.Items>
                <EdrsList.Loading>
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-16">
                      <LoadingSpinner />
                    </Table.Cell>
                  </Table.Row>
                </EdrsList.Loading>
              </Table.Body>
            </Table>
          </div>
        </div>
      </EdrsList>
    </SideDrawer>
  );
}
