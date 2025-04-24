import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import SearchIcon from '@mui/icons-material/Search';
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { usePagination } from "@/hooks/use-pagination";
import {T, useTranslator} from "@/i18n";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import {Dialog, Box, Button as MuiButton, DialogContent, TextField} from '@mui/material';

import React, {useCallback, useState} from "react";
import CreateAssetForm from "@/components/templates/create-asset-form.tsx";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import AssetCard from "@/components/organisms/asset-card.tsx";
import {Asset} from "@think-it-labs/edc-connector-client";
import AssetDetails from "@/components/organisms/asset-details.tsx";

export default function AssetListPage() {
  const { push, connector } = useConnectorDashboardState();
  const { page, decrementPage, incrementPage, offset, limit, hasPrev } = usePagination();
  const { translator } = useTranslator();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openAsset, setOpenAsset] = useState({} as Asset);

  const openDetailsModal = (asset: Asset) => {
    setIsDetailsModalOpen(true);
    setOpenAsset(asset);
  };

  const onDeleteAssetClick = () => {
// TODO: implement
  };


  return (
    <>
      <Dialog
        open={isCreateModalOpen}
        maxWidth="lg"
        className="my-7"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
          <CreateAssetForm />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailsModalOpen}
        maxWidth="lg"
        className="my-7"
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <DialogContent style={{ maxWidth: "90vw", width: "1000px" }}>
          <AssetDetails asset={openAsset} onDeleteClick={onDeleteAssetClick} />
        </DialogContent>
      </Dialog>

      <SideDrawer title={<T string="assets.title" />}>
        <AssetsList managementUrl={connector.managementUrl}>
          <div className="flex gap-x-4 py-4">
            <Input
              fullWidth={false}
              placeholder={translator("assets.search")}
              slots={{ htmlInput: (props) => <AssetsList.Search {...props} /> }}
              slotProps={{
                input: {
                  classes: { root: "flex-grow" },
                  startAdornment: <SearchIcon />,
                }
              }}
            />
            <MuiButton
              data-testid="create-asset-modal-opener"
              variant="contained"
              className="gap-x-2 font-medium"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <T string="assets.buttonAdd" />
            </MuiButton>

            {/* TODO: move pagination here */}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <AssetsList.Items
              limit={limit}
              offset={offset}
              sortOrder="DESC"
            >
              {({ item, index }) => (
                <AssetCard asset={item} key={index} onClick={() => openDetailsModal(item)} />
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
