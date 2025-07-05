import { Table } from "@/components/atoms/table";
import PaginationControls from "@/components/molecules/pagination-controls";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { MDSManualApprovalController } from "@/utilities/contract-negotiations";
import { Button, Icon } from "@mui/material";
import { ContractNegotiation, CriterionInput } from "@think-it-labs/edc-connector-client";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { Timestamp } from "@think-it-labs/edc-connector-ui/timestamp";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { MAX_ITEMS } from "../../constants/lists";

const CreatedAt = ({ item }: { item: ContractNegotiation }) => {
  const createdAt = item && item["https://w3id.org/edc/v0.0.1/ns/createdAt"];
  const createdAtValue = createdAt && createdAt[0] && createdAt[0]["@value"];
  return <Timestamp milliseconds={createdAtValue} />
}

const CounterPartyAddress = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyAddress = item["https://w3id.org/edc/v0.0.1/ns/counterPartyAddress"];
  const counterPartyAddressValue = counterPartyAddress && counterPartyAddress[0] && counterPartyAddress[0]["@value"];
  return <>{counterPartyAddressValue}</>
}

export default function ContractNegotiationsManualApprovalListPage() {
  const { query, push } = useRouter()
  const { connector } = useParticipantConnectorState();
  const { globalTranslator, translator } = useTranslator();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractNegotiationData, setOpenContractNegotiationData] = useState({
    contractNegotiation: {} as ContractNegotiation,
  });

  const mdsManualApprovalController = useMemo(() => new MDSManualApprovalController(connector.managementUrl), [connector]);

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };

  const onApproveClick = (item: ContractNegotiation, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    mdsManualApprovalController.approve(item["@id"])
      .then(() => enqueueSnackbar(translator("contractNegotiations.approveSuccess")))
      .catch((error) => enqueueSnackbar(translator("contractNegotiations.approveError")))
  };

  const onRejectClick = (item: ContractNegotiation, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    mdsManualApprovalController.reject(item["@id"])
      .then(() => enqueueSnackbar(translator("contractNegotiations.rejectSuccess")))
      .catch((error) => enqueueSnackbar(translator("contractNegotiations.rejectError")))
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
    <SideDrawer title={<T string="contractNegotiations.title" />}>
      <ContractNegotiationDialog
        open={isDetailsModalOpen}
        contractNegotiation={openContractNegotiationData.contractNegotiation}
        onClose={() => setIsDetailsModalOpen(false)}
        participantId={connector.id}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />
      <ContractNegotiationsList
        managementUrl={connector.managementUrl}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <div className="flex gap-x-5">
          <div className="flex-grow">
            <label
              htmlFor="hs-as-table-product-review-search"
              className="sr-only"
            >
              <T global string="search" />
            </label>
            <div className="relative flex rounded-lg shadow-sm">
              <ContractNegotiationsList.Search
                name="hs-as-table-product-review-search"
                className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder={globalTranslator("searchPlaceholder")}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                <Search className="w-4 h-4" />
              </div>
              <ContractNegotiationsList.SearchTrigger
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <T global string="search" />
              </ContractNegotiationsList.SearchTrigger>
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
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">
                  #
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingState" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCounterPartyAddress" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCreatedAt" />
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
                filterExpression={pendingFilter}
              >
                {({ item, index }) => (
                  <Table.Row
                    key={index}
                    onClick={() => openDetailsModal(item)}
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
                      <span className="font-semibold">
                        {item.state}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <CounterPartyAddress item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <CreatedAt item={item} />
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
