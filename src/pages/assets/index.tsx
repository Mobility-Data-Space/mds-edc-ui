import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { Snackbar } from "@/components/molecules/snackbar";
import AssetCard from "@/components/organisms/asset-card";
import AssetDialog from "@/components/organisms/asset-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import AssetFormDialog from "@/components/templates/asset-form-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from '@mui/material';
import { Asset } from "@think-it-labs/edc-connector-client";
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { ErrorPopup } from "../../components/molecules/error-popup";
import { MAX_ITEMS } from "../../constants/lists";

export default function AssetListPage() {
  const router = useRouter();
  const { translator } = useTranslator();
  const { connector } = useParticipantConnectorState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openAssetData, setOpenAssetData] = useState({
    asset: {} as Asset,
    deleteItem: async () => { },
  });

  const openDetailsModal = (asset: Asset, deleteItem: () => Promise<void> = async () => { }) => {
    setIsDetailsModalOpen(true);
    setOpenAssetData({ asset, deleteItem });
  };

  const navigate = useCallback((newPage: number) => {
    router.push(
      {
        href: window.location.href,
        query: {
          ...router.query,
          page: newPage,
        },
      },
    );
  }, [router])

  return (
    <>
      <AssetFormDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <AssetDialog
        open={isDetailsModalOpen}
        asset={openAssetData.asset}
        onClose={() => setIsDetailsModalOpen(false)}
        deleteEnabled
        deleteItem={openAssetData.deleteItem}
        onEditClick={() => router.push(`/assets/${openAssetData.asset.id}/edit`)}
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        onDeleteSuccess={() => {
          enqueueSnackbar("", {
            content: (key) => (
              <Snackbar
                type="success"
                message={translator('assets.deleteSuccess')}
                onClose={() => { closeSnackbar(key); }}
              />
            )
          });
        }}
      />

      <SideDrawer title={<T string="assets.title" />}>
        <AssetsList
          managementUrl={proxyConnectorManagement}
          usePagination
          navigate={navigate}
          currentPage={parseInt(router.query.page as string) || 0}
          firstPage={0}
        >
          <AssetsList.Error>
            {({ errors }) =>
              <ErrorPopup
                errors={errors}
                errorMessageKey="common.assetsLoadError"
              />
            }
          </AssetsList.Error>
          <div className="flex justify-between pb-6">
            <div className="flex justify-start gap-x-5 items-center">
              <div className="min-w-xl h-full">
                <SearchBar searchTarget={["id", "http://purl.org/dc/terms/title", "http://purl.org/dc/terms/description"]} placeholder={translator("assets.searchPlaceholder")} searchOperator="ilike" />
              </div>
              <div className="flex gap-x-4">
                <MuiButton
                  data-testid="create-asset-modal-opener"
                  variant="contained"
                  className="gap-x-2 font-medium min-h-14"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Icon fontSize="medium" className="mr-2">add_circle_outline</Icon>
                  <T string="assets.buttonAdd" />
                </MuiButton>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <AssetsList.Pagination>
                {({ decrementPage, hasPrev, page, hasNext, incrementPage, itemsCount }) =>
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
              </AssetsList.Pagination>
            </div>
          </div>

          <div id="asset-list" data-testid="assets-list">
            <div className="flex flex-wrap gap-3">
              <AssetsList.Items
                limit={MAX_ITEMS}
                sortOrder="DESC"
                sortField="createdAt"
              >
                {({ item, index, deleteItem }) => (
                  <AssetCard asset={item} key={index} onClick={() => openDetailsModal(item, deleteItem)} participantId={connector.id} data-testid="asset-card" />
                )}
              </AssetsList.Items>
            </div>
          </div>

          <AssetsList.Loading>
            <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
              <span
                className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </span>
            </div>
          </AssetsList.Loading>
        </AssetsList>
      </SideDrawer>
    </>
  );
}
