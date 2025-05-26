import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {IconButton} from "@mui/material";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";

import SideDrawer from "@/components/organisms/side-drawer";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";

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
        <div className="flex gap-x-5">
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
        <div className="flex flex-wrap gap-2.5 py-4">
          <ContractAgreementsList.Items
            limit={limit}
            offset={offset}
            sortOrder="DESC"
          >
            {({item, index}) => {
              return (
                <ContractAgreementCard key={index} contractAgreement={item}
                                       onClick={() => push(`/contract-agreements/${item.id}`)}/>
              );
            }}
          </ContractAgreementsList.Items>
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
