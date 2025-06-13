import React, {useState} from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {IconButton, Tooltip} from "@mui/material";
import {ContractAgreementView} from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import {ContractNegotiation} from "@think-it-labs/edc-connector-client";
import { Table } from "@/components/atoms/table";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import {formatDateTime, formatDateTimeAgo} from "@/utilities/utilities.ts";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";

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
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const { globalTranslator, translator } = useTranslator();
  const { decrementPage, incrementPage, offset, limit, hasPrev, page } = usePagination();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractNegotiationData, setOpenContractNegotiationData] = useState({
    contractNegotiation: {} as ContractNegotiation,
  });

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };

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
      <ContractNegotiationsList managementUrl={managementUrl}>
        <div className="flex justify-end items-center mb-3">
          <div className="inline-flex float-right gap-x-2">
            <IconButton
              onClick={decrementPage}
              disabled={!hasPrev}
            >
              <ChevronLeft className="size-6"/>
            </IconButton>
            <IconButton
              onClick={incrementPage}
            >
              <ChevronRight className="size-6"/>
            </IconButton>
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
                limit={limit}
                offset={offset}
                sortOrder="DESC"
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
                        {(page * 10) + (index + 1)}
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
