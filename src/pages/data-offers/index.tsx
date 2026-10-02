import { TitleWithIcon } from "@/components/atoms/title-with-icon";
import { JsonLdDialog } from "@/components/molecules/json-ld-dialog";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import ContractDefinitionCard from "@/components/organisms/contract-definition-card";
import DataOfferCreateDialog from "@/components/organisms/data-offer-create-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from "@mui/material";
import { ContractDefinition } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { ContractDefinitionsList } from "@think-it-labs/edc-connector-ui/contract-definitions-list";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { MAX_ITEMS } from "@/constants/lists";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

export default function DataOffersPage() {
  const { push } = useRouter();
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const { showSnackbar } = useAppSnackbar();
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });


  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [listKey, setListKey] = useState(1);

  const [openDataOfferData, setOpenDataOfferData] = useState({
    contractDefinition: {} as ContractDefinition,
    deleteItem: async () => { },
  });

  const openDetailsModal = (contractDefinition: ContractDefinition) => {
    setIsDetailsModalOpen(true);
    setOpenDataOfferData({
      contractDefinition,
      deleteItem: () => {
        return edcClient.management.contractDefinitions.delete(
          contractDefinition?.id,
        );
      },
    });
  };

  const { currentPage, navigate } = useListPage();

  return (
    <>
      <DataOfferCreateDialog
        key={`DataOfferCreateDialog${isCreateModalOpen}`}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        participantId={connector?.id ?? ""}
        connectorEndpoint={connector?.protocolUrl ?? ""}
        managementUrl={proxyConnectorManagement}
        translator={translator}
        onSuccess={() => setListKey((key) => key + 1)}
      />
      <JsonLdDialog
        dataTestId="data-offer-dialog"
        isOpen={isDetailsModalOpen}
        jsonLdObject={openDataOfferData.contractDefinition}
        onClose={() => setIsDetailsModalOpen(false)}
        title={
          <TitleWithIcon
            title={openDataOfferData.contractDefinition?.id}
            subtitle={<T string="contractDefinitions.dataOffer" />}
            icon={<Icon fontSize="large">policy</Icon>}
          />
        }
        deleteConfirmationMessage={translator("contractDefinitions.deleteConfirmation", { name: openDataOfferData.contractDefinition?.id })}
        deleteFailMessage={translator("contractDefinitions.deleteFailed", { name: openDataOfferData.contractDefinition?.id })}
        deleteButtonTestId="delete-data-offer-modal-btn"
        deleteItem={openDataOfferData.deleteItem}
        onDeleteSuccess={() => {
          showSnackbar({
            type: "success",
            message: translator("contractDefinitions.deleteSuccess"),
            persist: false,
          });

          setListKey((key) => key + 1);
          setTimeout(() => push("/data-offers"), 1000);
        }}
      />
      <ContractDefinitionsList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <ContractDefinitionsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.dataOffersLoadError"
            />
          )}
        </ContractDefinitionsList.Error>
        <ListToolbar
          search={
            <SearchBar
              searchTarget="id"
              placeholder={translator(
                "contractDefinitions.searchPlaceholder",
              )}
              searchOperator="ilike"
            />
          }
          actions={
            <MuiButton
              className="min-h-12"
              onClick={() => setIsCreateModalOpen(true)}
              variant="contained"
            >
              <Icon fontSize="medium" className="mr-2">
                add_circle_outline
              </Icon>
              <T string="contractDefinitions.publishDataOffer" />
            </MuiButton>
          }
          pagination={<ContractDefinitionsList.Pagination>{renderPagination}</ContractDefinitionsList.Pagination>}
        />

        <div
          className="flex flex-wrap gap-4 py-4"
          data-testid="data-offers-list"
        >
          <ContractDefinitionsList.Items
            key={listKey}
            limit={MAX_ITEMS}
            sortField="createdAt"
            sortOrder="DESC"
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
          <LoadingSpinner />
        </ContractDefinitionsList.Loading>
      </ContractDefinitionsList>
    </>
  );
}

DataOffersPage.titleKey = "contractDefinitions.title";
