import { TitleWithIcon } from "@/components/atoms/title-with-icon";
import { JsonLdDialog } from "@/components/molecules/json-ld-dialog";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import PolicyCard from "@/components/organisms/policy-card";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from "@mui/material";
import { PolicyDefinition } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { PolicyDefinitionsList } from "@think-it-labs/edc-connector-ui/policy-definitions-list";
import { useState } from "react";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { MAX_ITEMS } from "@/constants/lists";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

export default function PolicyDefinitionListPage() {
  const { push } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const { showSnackbar }= useAppSnackbar();
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  const [policyListKey, setPolicyListKey] = useState(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openPolicyDefinitionData, setOpenPolicyDefinitionData] = useState({
    policyDefinition: {} as PolicyDefinition,
    deleteItem: async () => {},
  });

  const openDetailsModal = (policyDefinition: PolicyDefinition) => {
    setIsDetailsModalOpen(true);
    setOpenPolicyDefinitionData({
      policyDefinition,
      deleteItem: () => {
        return edcClient.management.policyDefinitions.delete(
          policyDefinition?.id,
        );
      },
    });
  };


  const { currentPage, navigate } = useListPage();

  return (
    <>
      <JsonLdDialog
        isOpen={isDetailsModalOpen}
        dataTestId="policy-dialog"
        jsonLdObject={
          openPolicyDefinitionData.policyDefinition?.policy?.permissions
        }
        onClose={() => setIsDetailsModalOpen(false)}
        title={
          <TitleWithIcon
            title={openPolicyDefinitionData.policyDefinition?.id}
            subtitle={<T string="policyDefinitions.policy" />}
            icon={<Icon fontSize="large">policy</Icon>}
          />
        }
        deleteConfirmationMessage={translator("policyDefinitions.deleteConfirmation", { name: openPolicyDefinitionData.policyDefinition?.id })}
        deleteFailMessage={translator("policyDefinitions.deleteFailed", { name: openPolicyDefinitionData.policyDefinition?.id })}
        deleteButtonTestId="delete-policy-modal-btn"
        deleteItem={openPolicyDefinitionData.deleteItem}
        onDeleteSuccess={() => {
          showSnackbar({
            type: "success",
            message: translator("policyDefinitions.deleteSuccess"),
            persist: true
          })
          setPolicyListKey((key) => key + 1);
        }}
      />
      <PolicyDefinitionsList
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
        managementUrl={proxyConnectorManagement}
        key={policyListKey}

      >
        <ListToolbar
          search={
            <SearchBar
              searchTarget="id"
              placeholder={translator("policyDefinitions.searchPlaceholder")}
              searchOperator="ilike"
            />
          }
          actions={
            <MuiButton
              className="min-h-12"
              onClick={() => push("/policy-definitions/new")}
              variant="contained"
            >
              <Icon fontSize="medium" className="mr-2">
                add_circle_outline
              </Icon>
              <T string="policyDefinitions.createPolicy" />
            </MuiButton>
          }
          pagination={<PolicyDefinitionsList.Pagination>{renderPagination}</PolicyDefinitionsList.Pagination>}
        />

        <PolicyDefinitionsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.policyDefinitionsLoadError"
            />
          )}
        </PolicyDefinitionsList.Error>

        <div className="flex flex-wrap gap-4 py-4" data-testid="policies-list">
          <PolicyDefinitionsList.Items
            limit={MAX_ITEMS}
            sortOrder="DESC"
            sortField="createdAt"
          >
            {({ item, index }) => (
              <PolicyCard
                key={index}
                policyDefinition={item}
                onClick={() => openDetailsModal(item)}
                data-testid="policy-card"
              />
            )}
          </PolicyDefinitionsList.Items>
        </div>

        <PolicyDefinitionsList.Loading>
          <LoadingSpinner />
        </PolicyDefinitionsList.Loading>
      </PolicyDefinitionsList>
    </>
  );
}

PolicyDefinitionListPage.titleKey = "policyDefinitions.title";
