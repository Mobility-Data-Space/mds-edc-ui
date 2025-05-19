import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";

import { ContractDefinitionsList } from "@think-it-labs/edc-connector-ui/contract-definitions-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function AssetListPage() {
  const { push, connector } = useParticipantConnectorState();
  const { globalTranslator } = useTranslator();
  const managementUrl = connector?.managementUrl as string;
  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();
  return (
    <SideDrawer title={<T string="contractDefinitions.title" />}>
      <ContractDefinitionsList managementUrl={managementUrl}>
          <div className="flex items-center">
            <div>
              <button
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => push("/data-offers/new")}
              >
                <Plus className="h-4 w-4" />
                <T string="buttonAdd" />
              </button>
            </div>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="hs-as-table-product-review-search"
              className="sr-only"
            >
              <T global string="search" />
            </label>
            <div className="relative flex rounded-lg shadow-sm">
              <ContractDefinitionsList.Search
                name="hs-as-table-product-review-search"
                className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder={globalTranslator("searchPlaceholder")}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                <Search className="w-4 h-4" />
              </div>
              <ContractDefinitionsList.SearchTrigger className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <T global string="search" />
              </ContractDefinitionsList.SearchTrigger>
            </div>
          </div>

        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading className="w-16">
                #
              </Table.Heading>

              <Table.Heading>
                <T string="headingId" />
              </Table.Heading>

              <Table.Heading>
                <T string="headingContractPolicy" />
              </Table.Heading>

              <Table.Heading>
                <T string="headingAccessPolicy" />
              </Table.Heading>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            <ContractDefinitionsList.Items
              limit={limit}
              offset={offset}
              sortOrder="DESC"
            >
              {({ item, index }) => (
                <Table.Row
                  onClick={() => push(`/data-offers/${item.id}`)}
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
                    <div className="flex items-center gap-x-3">
                      <span className="font-semibold text-sm text-gray-800">
                        {item.id}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="text-sm text-gray-800">
                      <ContractDefinitionsList.Policy
                        managementUrl={managementUrl}
                        id={item.contractPolicyId}
                      >
                        <ContractDefinitionsList.Policy.Id />
                        <br />
                        <span className="text-xs text-gray-800">
                          <ContractDefinitionsList.Policy.CreatedAt />
                        </span>
                      </ContractDefinitionsList.Policy>
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="text-sm text-gray-800">
                      <ContractDefinitionsList.Policy
                        managementUrl={managementUrl}
                        id={item.accessPolicyId}
                      >
                        <ContractDefinitionsList.Policy.Id />
                        <br />
                        <span className="text-xs text-gray-800">
                          <ContractDefinitionsList.Policy.CreatedAt />
                        </span>
                      </ContractDefinitionsList.Policy>
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </ContractDefinitionsList.Items>
          </Table.Body>
        </Table>
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
        <ContractDefinitionsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </ContractDefinitionsList.Loading>
      </ContractDefinitionsList>
    </SideDrawer>
  );
}
