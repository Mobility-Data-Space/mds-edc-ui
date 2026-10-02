import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import AssetCard from "@/components/organisms/asset-card";
import AssetDialog from "@/components/organisms/asset-dialog";
import AssetFormDialog from "@/components/organisms/asset-form-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Icon, Button as MuiButton } from "@mui/material";
import { Asset } from "@think-it-labs/edc-connector-client";
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { MAX_ITEMS } from "@/constants/lists";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

export default function AssetListPage() {
  const router = useRouter();
  const { translator } = useTranslator();
  const { connector } = useParticipantConnectorState();
  const { showSnackbar } = useAppSnackbar();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openAssetData, setOpenAssetData] = useState({
    asset: {} as Asset,
    deleteItem: async () => {},
  });

  const openDetailsModal = (
    asset: Asset,
    deleteItem: () => Promise<void> = async () => {},
  ) => {
    setIsDetailsModalOpen(true);
    setOpenAssetData({ asset, deleteItem });
  };

  const { currentPage, navigate } = useListPage();

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
        onEditClick={() =>
          router.push(`/assets/${openAssetData.asset.id}/edit`)
        }
        participantId={connector?.id ?? ""}
        connectorEndpoint={connector?.protocolUrl ?? ""}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        onDeleteSuccess={() => {
          showSnackbar({
            type: "success",
            message: translator("assets.deleteSuccess"),
            persist: false,
          });
        }}
      />

      <AssetsList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <AssetsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.assetsLoadError"
            />
          )}
        </AssetsList.Error>
        <ListToolbar
          search={
            <SearchBar
              searchTarget={[
                "id",
                "http://purl.org/dc/terms/title",
                "http://purl.org/dc/terms/description",
              ]}
              placeholder={translator("assets.searchPlaceholder")}
              searchOperator="ilike"
            />
          }
          actions={
            <MuiButton
              data-testid="create-asset-modal-opener"
              variant="contained"
              className="gap-x-2 font-medium min-h-14"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Icon fontSize="medium" className="mr-2">
                add_circle_outline
              </Icon>
              <T string="assets.buttonAdd" />
            </MuiButton>
          }
          pagination={<AssetsList.Pagination>{renderPagination}</AssetsList.Pagination>}
        />

        <div id="asset-list" data-testid="assets-list">
          <div className="flex flex-wrap gap-3">
            <AssetsList.Items
              limit={MAX_ITEMS}
              sortOrder="DESC"
              sortField="createdAt"
            >
              {({ item, index, deleteItem }) => (
                <AssetCard
                  asset={item}
                  key={index}
                  onClick={() => openDetailsModal(item, deleteItem)}
                  participantId={connector?.id ?? ""}
                  data-testid="asset-card"
                />
              )}
            </AssetsList.Items>
          </div>
        </div>

        <AssetsList.Loading>
          <LoadingSpinner />
        </AssetsList.Loading>
      </AssetsList>
    </>
  );
}

AssetListPage.titleKey = "assets.title";
