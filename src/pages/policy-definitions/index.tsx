import { PolicyDefinitionsList } from "@think-it-labs/edc-connector-ui/policy-definitions-list";
import { Timestamp } from "@think-it-labs/edc-connector-ui/timestamp";
import PolicyCard from "@/components/organisms/policy-card";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import {ChevronLeft, ChevronRight, CirclePlus, Plus, Search} from "lucide-react";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
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
