import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import { JsonLdDialog } from "@/components/molecules/JsonLdDialog";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import PolicyCard from "@/components/organisms/policy-card";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from "@mui/material";
import { PolicyDefinition } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { PolicyDefinitionsList } from "@think-it-labs/edc-connector-ui/policy-definitions-list";
import { useRouter} from "next/router";
import { useCallback, useState } from "react";
import { ErrorPopup } from "../../components/molecules/error-popup";
import { MAX_ITEMS } from "../../constants/lists";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";

export default function PolicyDefinitionListPage() {
  const router = useRouter();
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


  const navigate = useCallback(
    (newPage: number) => {
      router.push({
        href: window.location.href,
        query: {
          ...router.query,
          page: newPage,
        },
      });
    },
    [router],
  );

  return (
    <SideDrawer title={<T string="policyDefinitions.title" />}>
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
        deleteConfirmationMessage={`Please confirm you want to delete Policy ${openPolicyDefinitionData.policyDefinition?.id}. This action cannot be undone.`}
        deleteFailMessage={`Failed deleting policy ${openPolicyDefinitionData.policyDefinition?.id}`}
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
        currentPage={parseInt(router.query.page as string) || 0}
        firstPage={0}
        managementUrl={proxyConnectorManagement}
        key={policyListKey}

      >
        <div className="flex justify-between pb-6">
          <div className="flex justify-start gap-x-5">
            <div className="min-w-xl h-full">
              <SearchBar
                searchTarget="id"
                placeholder={translator("policyDefinitions.searchPlaceholder")}
                searchOperator="ilike"
              />
            </div>
            <div className="flex gap-x-4">
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
            </div>
          </div>
          <div className="flex justify-end items-center">
            <PolicyDefinitionsList.Pagination>
              {({
                decrementPage,
                page,
                hasNext,
                hasPrev,
                incrementPage,
                itemsCount,
              }) => (
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
              )}
            </PolicyDefinitionsList.Pagination>
          </div>
        </div>

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
