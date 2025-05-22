import { PolicyDefinitionsList } from "@think-it-labs/edc-connector-ui/policy-definitions-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import {ChevronLeft, ChevronRight, CirclePlus, Plus, Search} from "lucide-react";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import PolicyCard from "@/components/organisms/policy-card.tsx";
import {Button as MuiButton, IconButton} from "@mui/material";
import { Button } from "@/components/atoms/button";
import Typography from "@mui/material/Typography";

export default function PolicyDefinitionListPage() {
  const { push, connector } = useParticipantConnectorState();
  const { globalTranslator } = useTranslator();

  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();

  const managementUrl = connector?.managementUrl as string;

  return (
    <SideDrawer title={<T string="policyDefinitions.title" />}>
      <PolicyDefinitionsList managementUrl={managementUrl}>
        <div className="flex gap-x-5">
          <div>
            <label
              htmlFor="hs-as-table-product-review-search"
              className="sr-only"
            >
              <T global string="search"/>
            </label>
            <div className="relative flex rounded-lg shadow-sm">
              <PolicyDefinitionsList.Search
                name="hs-as-table-product-review-search"
                className="py-3 px-4 ps-11 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder={globalTranslator("searchPlaceholder")}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                <Search className="w-4 h-4"/>
              </div>
              <PolicyDefinitionsList.SearchTrigger
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <T global string="buttonSearch"/>
              </PolicyDefinitionsList.SearchTrigger>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <MuiButton onClick={() => push("/policy-definitions/new")} variant="contained">
                <CirclePlus fontSize="large" className="mr-2"/>
                <T string="policyDefinitions.createPolicy"/>
              </MuiButton>
            </div>
          </div>
          <div className="flex justify-end items-center flex-grow">
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

        <div className="flex flex-wrap gap-4 py-4">
          <PolicyDefinitionsList.Items
            limit={limit}
            offset={offset}
            sortOrder="DESC"
          >
            {({item, index}) => (
              <PolicyCard key={index} policyDefinition={item} onClick={() => push(`/policy-definitions/${item.id}`)}/>
            )}
          </PolicyDefinitionsList.Items>
        </div>

        <PolicyDefinitionsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </PolicyDefinitionsList.Loading>
      </PolicyDefinitionsList>
    </SideDrawer>
  );
}
