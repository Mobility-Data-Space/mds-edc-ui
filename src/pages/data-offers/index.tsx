import React, {useState} from "react";
import {ChevronLeft, ChevronRight, CirclePlus} from "lucide-react";
import {Button as MuiButton, IconButton, Icon} from "@mui/material";
import { ContractDefinitionsList } from "@think-it-labs/edc-connector-ui/contract-definitions-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import ContractDefinitionCard from "@/components/organisms/contract-definition-card.tsx";
import {JsonLdDialog} from "@/components/molecules/JsonLdDialog.tsx";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import {ContractDefinition} from "@think-it-labs/edc-connector-client";

export default function AssetListPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openDataOfferData, setOpenDataOfferData] = useState({
    contractDefinition: {} as ContractDefinition,
  });

  const openDetailsModal = (contractDefinition: ContractDefinition) => {
    setIsDetailsModalOpen(true);
    setOpenDataOfferData({ contractDefinition });
  };

  return (
    <SideDrawer title={<T string="contractDefinitions.title" />}>
      <JsonLdDialog
        isOpen={isDetailsModalOpen}
        jsonLdObject={openDataOfferData.contractDefinition}
        onClose={() => setIsDetailsModalOpen(false)}
        title={<TitleWithIcon
          title={openDataOfferData.contractDefinition?.id}
          subtitle={<T string="policyDefinitions.policy" />}
          icon={<Icon fontSize="large">policy</Icon>}
        />}
      />
      <ContractDefinitionsList managementUrl={managementUrl}>
        <div className="flex gap-x-5">
          <div className="flex items-center">
            <div>
              <MuiButton onClick={() => push("/data-offers/new")} variant="contained">
                <CirclePlus fontSize="large" className="mr-2"/>
                <T string="contractDefinitions.publishDataOffer"/>
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
          <ContractDefinitionsList.Items
            limit={limit}
            offset={offset}
            sortOrder="DESC"
          >
            {({item, index}) => (
              <ContractDefinitionCard
                key={index}
                contractDefinition={item}
                onClick={() => openDetailsModal(item)}
              />
            )}
          </ContractDefinitionsList.Items>
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
