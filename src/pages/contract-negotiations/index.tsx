import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { Timestamp } from "@think-it-labs/edc-connector-ui/timestamp";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import {IconButton} from "@mui/material";

export default function ContractNegotiationsListPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const { globalTranslator } = useTranslator();
  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();

  return (
    <SideDrawer title={<T string="contractNegotiations.title" />}>
      <ContractNegotiationsList managementUrl={managementUrl}>
        <div className="flex gap-x-5">
          <div className="flex-grow">
            <label
              htmlFor="hs-as-table-product-review-search"
              className="sr-only"
            >
              <T global string="search"/>
            </label>
            <div className="relative flex rounded-lg shadow-sm">
              <ContractNegotiationsList.Search
                name="hs-as-table-product-review-search"
                className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder={globalTranslator("searchPlaceholder")}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                <Search className="w-4 h-4"/>
              </div>
              <ContractNegotiationsList.SearchTrigger
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <T global string="search"/>
              </ContractNegotiationsList.SearchTrigger>
            </div>
          </div>
          <div className="flex justify-end items-center">
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
        </div>
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">
                  #
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingId" />
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
                    onClick={() => push(`/contract-negotiations/${item.id}`)}
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
                        {item.id}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-semibold">
                        {item.state}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
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
                    </Table.Cell>
                    <Table.Cell>
                      {item.counterPartyAddress || "n.a."}
                    </Table.Cell>
                    <Table.Cell>
                      <Timestamp milliseconds={item.createdAt} />
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
