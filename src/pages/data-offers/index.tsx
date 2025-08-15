import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import { JsonLdDialog } from "@/components/molecules/JsonLdDialog";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import ContractDefinitionCard from "@/components/organisms/contract-definition-card";
import DataOfferCreateDialog from "@/components/organisms/data-offer-create-dialog.tsx";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from "@mui/material";
import { ContractDefinition } from "@think-it-labs/edc-connector-client";
import { ContractDefinitionsList } from "@think-it-labs/edc-connector-ui/contract-definitions-list";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { ErrorPopup } from "../../components/molecules/error-popup";
import { MAX_ITEMS } from "../../constants/lists";

export default function DataOffersPage() {
  const { push, query } = useRouter()
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [listKey, setListKey] = useState(1);

  const [openDataOfferData, setOpenDataOfferData] = useState({
    contractDefinition: {} as ContractDefinition,
  });

  const openDetailsModal = (contractDefinition: ContractDefinition) => {
    setIsDetailsModalOpen(true);
    setOpenDataOfferData({ contractDefinition });
  };

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
  }, [push, query])

  return (
    <SideDrawer title={<T string="contractDefinitions.title" />}>
      <DataOfferCreateDialog
        key={`DataOfferCreateDialog${isCreateModalOpen}`}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        managementUrl={proxyConnectorManagement}
        translator={translator}
        onSuccess={() => setListKey(key => key + 1)}
      />
      <JsonLdDialog
        dataTestId="data-offer-dialog"
        isOpen={isDetailsModalOpen}
        jsonLdObject={openDataOfferData.contractDefinition}
        onClose={() => setIsDetailsModalOpen(false)}
        title={<TitleWithIcon
          title={openDataOfferData.contractDefinition?.id}
          subtitle={<T string="policyDefinitions.policy" />}
          icon={<Icon fontSize="large">policy</Icon>}
        />}
      />
      <ContractDefinitionsList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={parseInt(query.page as string) || 0}
        firstPage={0}
      >
        <ContractDefinitionsList.Error>
          {({ errors }) =>
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.dataOffersLoadError"
            />
          }
        </ContractDefinitionsList.Error>
        <div className="flex justify-between pb-6">
          <div className="flex justify-start gap-x-5">
            <div className="min-w-xl h-full">
              <SearchBar searchTarget="id" placeholder={translator("contractDefinitions.searchPlaceholder")} searchOperator="ilike" />
            </div>
            <div className="flex gap-x-4">
              <MuiButton className="min-h-12" onClick={() => setIsCreateModalOpen(true)} variant="contained">
                <Icon fontSize="medium" className="mr-2">add_circle_outline</Icon>
                <T string="contractDefinitions.publishDataOffer" />
              </MuiButton>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <ContractDefinitionsList.Pagination>
              {({ decrementPage, hasPrev, hasNext, incrementPage, page, itemsCount }) =>
                <PaginationControls
                  page={page}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  decrementPage={decrementPage}
                  incrementPage={incrementPage}
                  maxItems={MAX_ITEMS}
                  dataTestIdPrefix="pagination"
                  itemsCount={itemsCount}
                />
              }
            </ContractDefinitionsList.Pagination>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-4" data-testid="data-offers-list">
          <ContractDefinitionsList.Items
            key={listKey}
            limit={MAX_ITEMS}
          >
            {({ item, index }) => (
              <ContractDefinitionCard
                key={index}
                contractDefinition={item}
                onClick={() => openDetailsModal(item)}
                data-testid="data-offer-card"
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
