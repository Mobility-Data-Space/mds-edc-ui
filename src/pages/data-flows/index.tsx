import { Input } from "@/components/atoms/input";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { Table } from "@/components/atoms/table";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { ListToolbar } from "@/components/molecules/list-toolbar";
import PaginationControls from "@/components/molecules/pagination-controls";
import DataFlowTableRow from "@/components/organisms/data-flow-table-row";
import { MAX_ITEMS } from "@/constants/lists";
import { useDataFlows } from "@/hooks/use-data-flows";
import { useListPage } from "@/hooks/use-list-page";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Button, Icon } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

// Lightweight search that drives the `q` query param (the connector-ui SearchBar is
// coupled to the library list context, which the data-flows view does not use).
function DataFlowSearchBar() {
  const { translator } = useTranslator();
  const { query, push, pathname } = useRouter();
  const [value, setValue] = useState<string>((query.q as string) ?? "");
  const search = () =>
    push(
      { pathname, query: { ...query, q: value, page: 0 } },
      undefined,
      { shallow: true },
    );

  return (
    <div className="relative flex rounded-lg h-full">
      <Input
        className="!pr-0 rounded"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder={translator("dataFlows.searchPlaceholder")}
        onKeyDown={(event) => event.key === "Enter" && search()}
        slotProps={{
          input: {
            className: "!pr-0 h-full",
            startAdornment: <Icon className="size-5">search</Icon>,
            endAdornment: (
              <Button
                variant="contained"
                type="button"
                className="gap-x-2 font-medium h-full hover:cursor-pointer"
                style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
                onClick={search}
              >
                <T global string="search" />
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}

export default function DataFlowsListPage() {
  const { connector } = useParticipantConnectorState();
  const { query } = useRouter();
  const { currentPage, navigate } = useListPage();
  const search = (query.q as string) || undefined;

  const { dataFlows, loading, error, hasNext } = useDataFlows({
    page: currentPage,
    limit: MAX_ITEMS,
    search,
  });

  if (!connector) {
    return <T string="common.noConnector" />;
  }

  return (
    <div data-testid="data-flows-list">
      <ListToolbar
        search={<DataFlowSearchBar />}
        pagination={
          <PaginationControls
            page={currentPage}
            hasPrev={currentPage > 0}
            hasNext={hasNext}
            decrementPage={() => navigate(currentPage - 1)}
            incrementPage={() => navigate(currentPage + 1)}
            itemsCount={dataFlows.length}
            maxItems={MAX_ITEMS}
          />
        }
      />

      {error && (
        <ErrorPopup errors={[error]} errorMessageKey="dataFlows.loadError" />
      )}

      <div className="flex gap-6 py-4">
        <div className="flex flex-col flex-wrap gap-4 flex-1 min-h-[60vh]">
          <Table className="w-full">
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">
                  <T string="dataFlows.direction" />
                </Table.Heading>
                <Table.Heading>
                  <T string="dataFlows.lastUpdated" />
                </Table.Heading>
                <Table.Heading>
                  <T string="dataFlows.assetId" />
                </Table.Heading>
                <Table.Heading>
                  <T string="dataFlows.state" />
                </Table.Heading>
                <Table.Heading>
                  <T string="dataFlows.counterparty" />
                </Table.Heading>
                <Table.Heading>
                  <T string="dataFlows.dataAddress" />
                </Table.Heading>
                <Table.Heading>
                  <T string="common.showDetails" />
                </Table.Heading>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-16">
                    <LoadingSpinner />
                  </Table.Cell>
                </Table.Row>
              ) : dataFlows.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-16 !text-2xl">
                    <T string="dataFlows.noDataFlowsFound" />
                  </Table.Cell>
                </Table.Row>
              ) : (
                dataFlows.map((dataFlow) => (
                  <DataFlowTableRow key={dataFlow.id} dataFlow={dataFlow} />
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

DataFlowsListPage.titleKey = "dataFlows.title";
