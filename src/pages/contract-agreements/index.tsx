import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";

import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { Timestamp } from "@think-it-labs/edc-connector-ui/timestamp";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";

export default function ContractAgreementsListPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;

  const { globalTranslator } = useTranslator();

  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();
  if (!connector) {
    return "No connector";
  }
  return (
    <SideDrawer title={<T string="contractAgreements.title" />}>
      <ContractAgreementsList managementUrl={managementUrl}>
        <div className="sm:col-span-1">
          <label
            htmlFor="hs-as-table-product-review-search"
            className="sr-only"
          >
            <T global string="search" />
          </label>
          <div className="relative flex rounded-lg shadow-sm">
            <ContractAgreementsList.Search
              name="hs-as-table-product-review-search"
              className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder={globalTranslator("searchPlaceholder")}
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <Search className="w-4 h-4" />
            </div>
            <ContractAgreementsList.SearchTrigger className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              <T global string="buttonSearch" />
            </ContractAgreementsList.SearchTrigger>
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
                  <T string="contractAgreements.headingId" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractAgreements.headingConsumer" /> →{" "} <T string="contractAgreements.headingProvider" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractAgreements.headingAsset" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractAgreements.headingContractSigningDate" />
                </Table.Heading>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <ContractAgreementsList.Items
                limit={limit}
                offset={offset}
                sortOrder="DESC"
              >
                {({ item, index }) => {
                  return (
                    <ContractAgreementView id={item.id} managementUrl={connector.managementUrl}>
                      <Table.Row
                        onClick={() => push(`/contract-agreements/${item.id}`)}
                      >
                        <Table.Cell>
                          <button
                            type="button"
                            className="flex items-center gap-x-2"
                          >
                            <span className="text-sm text-gray-800">
                              {(page * 10) + (index + 1)}
                            </span>
                          </button>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-semibold">
                            <ContractAgreementView.Id />
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="text-xs mb-1 text-gray-800">
                            <ContractAgreementView.ConsumerId /> →{" "} <ContractAgreementView.ProviderId />
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <ContractAgreementsList.Asset
                            id={item.assetId}
                            managementUrl={connector!.managementUrl}
                          >
                            <p className="text-sm mb-1 text-gray-800">
                              <ContractAgreementsList.Asset.Name />
                            </p>
                            <p className="text-xs mb-1 text-gray-800">
                              <ContractAgreementsList.Asset.Id />
                            </p>
                            <p className="text-xs italic text-gray-800">
                              <ContractAgreementsList.Asset.ContentType />
                            </p>
                          </ContractAgreementsList.Asset>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-sm text-gray-800">
                            <Timestamp
                              milliseconds={item.contractSigningDate}
                            />
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </ContractAgreementView>
                  );
                }}
              </ContractAgreementsList.Items>
            </Table.Body>
          </Table>
        </div>
        

        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
          <div className="inline-flex gap-x-2">
            <Button
              variant="secondary"
              onClick={decrementPage}
              disabled={!hasPrev}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>

            <Button
              variant="secondary"
              onClick={incrementPage}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ContractAgreementsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </ContractAgreementsList.Loading>
      </ContractAgreementsList>
    </SideDrawer>
  );
}
