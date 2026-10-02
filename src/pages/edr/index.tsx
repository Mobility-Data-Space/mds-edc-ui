import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { renderPagination } from "@/components/molecules/pagination-controls";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { EdrsList } from "@think-it-labs/edc-connector-ui/edr-list";
import { Table } from "@/components/atoms/table";
import { ErrorPopup } from "@/components/molecules/error-popup";
import EdrTableRow from "@/components/organisms/edr-table-row";
import { MAX_ITEMS } from "@/constants/lists";
import SearchBar from "@/components/molecules/search-bar";
import { useListPage } from "@/hooks/use-list-page";
import { ListToolbar } from "@/components/molecules/list-toolbar";

export default function EdrsListPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const { currentPage, navigate } = useListPage();

  if (!connector) {
    return <T string="common.noConnector" />;
  }

  return (
    <EdrsList
      managementUrl={proxyConnectorManagement}
      usePagination={true}
      navigate={navigate}
      currentPage={currentPage}
      firstPage={0}
    >
      <ListToolbar
        search={
          <SearchBar
            searchTarget="assetId"
            placeholder={translator("edrs.searchPlaceholder")}
            searchOperator="ilike"
          />
        }
        pagination={<EdrsList.Pagination>{renderPagination}</EdrsList.Pagination>}
      />

      <EdrsList.Error>
        {({ errors }) => (
          <ErrorPopup
            errors={errors}
            errorMessageKey="common.edrsLoadError"
          />
        )}
      </EdrsList.Error>

      <div className="flex gap-6 py-4" data-testid="edrs-list">
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

                <Table.Heading className="w-1/8">
                  <T string="edrs.details" />
                </Table.Heading>
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
  );
}

EdrsListPage.titleKey = "edrs.title";
