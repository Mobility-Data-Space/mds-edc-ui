import { Table } from "@/components/atoms/table";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { MDSManualApprovalController } from "@/utilities/contract-negotiations";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date.ts";
import { Button, Icon, Tooltip } from "@mui/material";
import { ContractNegotiation, CriterionInput } from "@think-it-labs/edc-connector-client";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { ErrorPopup } from "../../components/molecules/error-popup";
import { MAX_ITEMS } from "../../constants/lists";

const CreatedAt = ({ item }: { item: ContractNegotiation }) => {
  const createdAtValue = readValue(item, "https://w3id.org/edc/v0.0.1/ns/createdAt");
  return <Tooltip title={formatDateTime(createdAtValue, { showSeconds: true, showDayOfWeek: true })}>
    <span>
      {formatDateTimeAgo(createdAtValue)}
    </span>
  </Tooltip>;
}

const CounterPartyId = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyId = readValue(item, "https://w3id.org/edc/v0.0.1/ns/counterPartyId") ||
                        readValue(item, "counterPartyId") ||
                        item.counterPartyId;
  return <>{counterPartyId}</>
}

const AssetName = ({ item }: { item: ContractNegotiation }) => {
  const assetId = readValue(item, "https://w3id.org/edc/v0.0.1/ns/assetId") || 
                 readValue(item, "assetId") || 
                 item.assetId;
  return <>{assetId}</>
}

const NegotiationId = ({ item }: { item: ContractNegotiation }) => {
  return <>{item["@id"]}</>
}


export default function ContractNegotiationsManualApprovalListPage() {
  const { query, push } = useRouter()
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [openContractNegotiationData, setOpenContractNegotiationData] = useState({
    contractNegotiation: {} as ContractNegotiation,
  });

  const mdsManualApprovalController = useMemo(() => new MDSManualApprovalController(proxyConnectorManagement), []);

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };

  const onApproveClick = (item: ContractNegotiation, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    mdsManualApprovalController.approve(item["@id"])
      .then(() => {
        enqueueSnackbar(translator("contractNegotiations.approveSuccess"));
        setTimeout(() => push("/negotiation-manual-approval"), 1200)
      })
      .catch(() => enqueueSnackbar(translator("contractNegotiations.approveError")))
  };

  const onRejectClick = (item: ContractNegotiation, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    mdsManualApprovalController.reject(item["@id"])
      .then(() => {
        enqueueSnackbar(translator("contractNegotiations.rejectSuccess"))
        setTimeout(() => push("/negotiation-manual-approval"), 1200)
      })
      .catch(() => enqueueSnackbar(translator("contractNegotiations.rejectError")))
  };

  const pendingFilter: CriterionInput[] = [
    {
      operandLeft: "pending",
      operator: "=",
      operandRight: true
    }
  ];

  const currentPage = parseInt(query.page as string) || 0

  const navigate = useCallback((newPage: number) => {
    push(
      {
        href: window.location.href,
        query: {
          ...query,
          page: newPage,
        },
      },
    );
  }, [push, query])

  return (
    <SideDrawer title={<T string="contractNegotiations.manualApprovalTitle" />}>
      <ContractNegotiationDialog
        open={isDetailsModalOpen}
        contractNegotiation={openContractNegotiationData.contractNegotiation}
        onClose={() => setIsDetailsModalOpen(false)}
        participantId={connector.id}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />
      <ContractNegotiationsList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <ContractNegotiationsList.Error>
          {({ errors }) =>
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.contractNegotiationsLoadError"
            />
          }
        </ContractNegotiationsList.Error>
        <div className="flex gap-x-5">
          <div className="flex-grow">
            <label
              htmlFor="hs-as-table-product-review-search"
              className="sr-only"
            >
              <T global string="search" />
            </label>
            <div className="min-w-xl">
              <SearchBar
                placeholder={translator("contractNegotiations.searchPlaceholder")}
                searchTarget="counterPartyId"
                searchOperator="ilike"
              />
            </div>
          </div>
          <div className="flex justify-end items-center">
            <ContractNegotiationsList.Pagination>
              {({ decrementPage, hasPrev, hasNext, incrementPage, page, itemsCount }) =>
                <PaginationControls
                  page={page}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  decrementPage={decrementPage}
                  incrementPage={incrementPage}
                  maxItems={MAX_ITEMS}
                  itemsCount={itemsCount}
                />
              }
            </ContractNegotiationsList.Pagination>
          </div>
        </div>
        <div data-testid="approval-list" className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">
                  #
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCreatedAt" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingNegotiationId" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingAssetName" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCounterPartyId" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingApprove" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingReject" />
                </Table.Heading>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <ContractNegotiationsList.Items
                limit={MAX_ITEMS}
                sortOrder="DESC"
                sortField="createdAt"
                filterExpression={pendingFilter}
              >
                {({ item, index }) => (
                  <Table.Row
                    key={index}
                    onClick={() => openDetailsModal(item)}
                    data-testid="approval-item"
                  >
                    <Table.Cell>
                      <button
                        type="button"
                        className="flex items-center gap-x-2 text-gray-800"
                      >
                        {(currentPage * 10) + (index + 1)}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <CreatedAt item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <NegotiationId item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <AssetName item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <CounterPartyId item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        startIcon={<Icon>doneOutline</Icon>}
                        variant="contained"
                        color="success"
                        onClick={(event) => onApproveClick(item, event)}
                      >
                        <T string="contractNegotiations.headingApprove" />
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        startIcon={<Icon>close</Icon>}
                        variant="contained"
                        color="error"
                        onClick={(event) => onRejectClick(item, event)}
                      >
                        <T string="contractNegotiations.headingReject" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )}
              </ContractNegotiationsList.Items>
            </Table.Body>
          </Table>
        </div>

        <ContractNegotiationsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </ContractNegotiationsList.Loading>
      </ContractNegotiationsList>
    </SideDrawer>
  );
}
