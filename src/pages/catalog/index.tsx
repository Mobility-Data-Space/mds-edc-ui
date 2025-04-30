import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { usePagination } from "@/hooks/use-pagination";
import { T } from "@/i18n";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import {Modal, Box, Button as MuiButton, Dialog, DialogContent} from '@mui/material';

import React, {useState} from "react";
import CreateAssetForm from "@/components/templates/create-asset-form.tsx";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import AssetCard from "@/components/organisms/asset-card.tsx";
import {Catalog} from "@think-it-labs/edc-connector-ui/catalog.tsx";
import {useListContext} from "@think-it-labs/edc-connector-ui/list";
import {dataSetToAsset} from "@/schema/catalog.ts";
import AssetDetails from "@/components/organisms/asset-details.tsx";
import {Asset} from "@think-it-labs/edc-connector-client";

export default function CatalogPage() {
  const { push, connector } = useConnectorDashboardState();
  const { page, decrementPage, incrementPage, offset, limit, hasPrev } = usePagination();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openAssetData, setOpenAssetData] = useState({
    asset: {} as Asset,
    participantId: "" as string | undefined,
  });

  const openDetailsModal = (asset: Asset, participantId?: string) => {
    setIsDetailsModalOpen(true);
    setOpenAssetData({ asset, participantId });
  };

  return (
    <>
      <Dialog
        open={isDetailsModalOpen}
        maxWidth="lg"
        className="my-7"
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <DialogContent style={{ maxWidth: "90vw", width: "1000px" }}>
          <AssetDetails asset={openAsset} />
        </DialogContent>
      </Dialog>

      <SideDrawer title={<T string="catalog.title" />}>
        <Catalog managementUrl={connector.managementUrl} protocolUrl={connector.protocolUrl} >
          <div className="flex justify-end py-4">

            {/* TODO: move pagination here */}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Catalog.Items
              limit={limit}
              offset={offset}
              sortOrder="DESC"
            >
              {({ item, index, participantId }) => (
                <AssetCard asset={dataSetToAsset(item) as any} key={index} onClick={() => openDetailsModal(dataSetToAsset(item) as any, participantId)} participantId={participantId} />
              )}
            </Catalog.Items>
          </div>

          <Catalog.Loading>
            <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
              <span
                className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </span>
            </div>
          </Catalog.Loading>
        </Catalog>
      </SideDrawer>
    </>
  );
}
