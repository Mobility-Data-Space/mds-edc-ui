import { Table } from "@/components/atoms/table";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { ContractNegotiation } from "@think-it-labs/edc-connector-client";
import { Tooltip } from "@mui/material";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { MAX_ITEMS } from "../../constants/lists";
import {formatDateTime, formatDateTimeAgo} from "@/utilities/date.ts";

const CreatedAt = ({ item }: { item: ContractNegotiation }) => {
  const createdAtValue = readValue(item, "https://w3id.org/edc/v0.0.1/ns/createdAt");
  return <Tooltip title={formatDateTime(createdAtValue, { showSeconds: true, showDayOfWeek: true })}>
    <span>
      {formatDateTimeAgo(createdAtValue)}
    </span>
  </Tooltip>;
}

const CounterPartyId = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyIdValue = readValue(item, "https://w3id.org/edc/v0.0.1/ns/counterPartyId");
  return <>{counterPartyIdValue}</>
}

const CounterPartyAddress = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyAddressValue = readValue(item, "https://w3id.org/edc/v0.0.1/ns/counterPartyAddress");
  return <>{counterPartyAddressValue}</>
}

export default function ContractNegotiationsListPage() {
  const { push, query } = useRouter()
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const { translator } = useTranslator();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractNegotiationData, setOpenContractNegotiationData] = useState({
    contractNegotiation: {} as ContractNegotiation,
  });

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };

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
  }, [])

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
        managementUrl={managementUrl}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <div className="flex justify-between pb-6">
          <div className="flex justify-start gap-x-5 items-center">
            <div className="min-w-xl">
              <SearchBar searchTarget="counterPartyId" placeholder={translator("contractNegotiations.searchPlaceholder")} searchOperator="ilike" />
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
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200" data-testid="negotiations-list">
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
                  <T string="contractNegotiations.headingContractAgreement" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCounterPartyAddress" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCreatedAt" />
                </Table.Heading>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <ContractNegotiationsList.Items
                limit={MAX_ITEMS}
                sortOrder="DESC"
              >
                {({ item, index }) => (
                  <Table.Row
                    key={index}
                    onClick={() => openDetailsModal(item)}
                    data-testid="negotiation-item"
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
                      {!item.contractAgreementId ? "" :
                        <ContractAgreementView
                          managementUrl={managementUrl}
                          id={item.contractAgreementId}
                        >
                          <p className="text-xs italic mb-1 text-gray-800">
                            <ContractAgreementView.ProviderId /> →{" "}
                            <ContractAgreementView.ConsumerId />
                          </p>
                          <p className="font-semibold text-sm text-gray-800">
                            <ContractAgreementView.Id />
                          </p>
                        </ContractAgreementView>
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <CounterPartyAddress item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <CreatedAt item={item} />
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
