import { StateChip } from "@/components/atoms/state-chip";
import { Table } from "@/components/atoms/table";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date";
import { Tooltip } from "@mui/material";
import { ContractNegotiation } from "@think-it-labs/edc-connector-client";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { useState } from "react";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { MAX_ITEMS } from "@/constants/lists";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

const CreatedAt = ({ item }: { item: ContractNegotiation }) => {
  const createdAtValue = readValue(
    item,
    "https://w3id.org/edc/v0.0.1/ns/createdAt",
  );
  return (
    <Tooltip
      title={formatDateTime(createdAtValue, {
        showSeconds: true,
        showDayOfWeek: true,
      })}
    >
      <span>{formatDateTimeAgo(createdAtValue)}</span>
    </Tooltip>
  );
};

const CounterPartyAddress = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyAddressValue = readValue(
    item,
    "https://w3id.org/edc/v0.0.1/ns/counterPartyAddress",
  );
  return <>{counterPartyAddressValue}</>;
};

export default function ContractNegotiationsListPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractNegotiationData, setOpenContractNegotiationData] =
    useState({
      contractNegotiation: {} as ContractNegotiation,
    });

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };


  const { currentPage, navigate } = useListPage();

  return (
    <>
      <ContractNegotiationDialog
        open={isDetailsModalOpen}
        contractNegotiation={openContractNegotiationData.contractNegotiation}
        onClose={() => setIsDetailsModalOpen(false)}
        participantId={connector?.id ?? ""}
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
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.contractNegotiationsLoadError"
            />
          )}
        </ContractNegotiationsList.Error>
        <ListToolbar
          search={
            <SearchBar
              searchTarget="counterPartyId"
              placeholder={translator(
                "contractNegotiations.searchPlaceholder",
              )}
              searchOperator="ilike"
            />
          }
          pagination={<ContractNegotiationsList.Pagination>{renderPagination}</ContractNegotiationsList.Pagination>}
        />
        <div
          className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200"
          data-testid="negotiations-list"
        >
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">#</Table.Heading>

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
                sortField="createdAt"
              >
                {({ item, index }) => (
                  <Table.Row
                    key={index}
                    onClick={() => openDetailsModal(item)}
                    data-testid="negotiation-item"
                    className="bg-color-hover"
                  >
                    <Table.Cell>
                      <button
                        type="button"
                        className="flex items-center gap-x-2 text-gray-800"
                      >
                        {currentPage * 10 + (index + 1)}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <StateChip
                        state={item.state}
                        didError={!!item.errorDetail}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {!item.contractAgreementId ? (
                        ""
                      ) : (
                        <ContractAgreementView
                          managementUrl={proxyConnectorManagement}
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
                      )}
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
          <LoadingSpinner />
        </ContractNegotiationsList.Loading>
      </ContractNegotiationsList>
    </>
  );
}

ContractNegotiationsListPage.titleKey = "contractNegotiations.title";
