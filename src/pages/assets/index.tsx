import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { IconButton, Button as MuiButton, Typography } from '@mui/material';
import { Asset } from "@think-it-labs/edc-connector-client";
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import AssetCard from "@/components/organisms/asset-card";
import AssetDialog from "@/components/organisms/asset-dialog";
import AssetFormDialog from "@/components/templates/asset-form-dialog";
import { List } from "@think-it-labs/edc-connector-ui/list";
import { MAX_ITEMS } from "../../constants/lists";

export default function AssetListPage() {
  const router = useRouter();
  const { connector } = useParticipantConnectorState();

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
  }, [])

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
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        onDeleteSuccess={() => router.reload()}
      />

      <SideDrawer title={<T string="assets.title" />}>
        <AssetsList
          managementUrl={connector.managementUrl}
          usePagination
          navigate={navigate}
          currentPage={parseInt(router.query.page as string) || 0}
          firstPage={0}
        >
          <div className="flex justify-between gap-x-5">
            <Typography variant="h4" >
              <T string="assets.title" />
            </Typography>
            <List.Pagination>
              {({ decrementPage, hasPrev, hasNext, incrementPage }) =>
                <div className="flex justify-end items-center">
                  <div className="inline-flex float-right gap-x-2">
                    <IconButton
                      onClick={decrementPage}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="size-6" />
                    </IconButton>
                    <IconButton
                      onClick={incrementPage}
                      disabled={!hasNext}
                    >
                      <ChevronRight className="size-6" />
                    </IconButton>
                  </div>
                </div>
              }
            </List.Pagination>
          </div>
          <div className="flex gap-x-4 py-4">
            <MuiButton
              data-testid="create-asset-modal-opener"
              variant="contained"
              className="gap-x-2 font-medium"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <T string="assets.buttonAdd" />
            </MuiButton>
          </div>

          <div className="flex flex-wrap gap-3">
            <AssetsList.Items
              limit={MAX_ITEMS}
              sortOrder="DESC"
            >
              {({ item, index, deleteItem }) => (
                <AssetCard asset={item} key={index} onClick={() => openDetailsModal(item, deleteItem)} participantId={connector.id} />
              )}
            </AssetsList.Items>
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
