import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { usePagination } from "@/hooks/use-pagination";
import { T } from "@/i18n";

import React, {useState} from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import AssetCard from "@/components/organisms/asset-card.tsx";
import {Catalog} from "@think-it-labs/edc-connector-ui/catalog.tsx";
import {dataSetToAsset, dataSetToContractDefinitions} from "@/schema/catalog.ts";
import {Asset, ContractDefinition} from "@think-it-labs/edc-connector-client";
import AssetDetailsDialog from "@/components/organisms/asset-details-dialog.tsx";

export default function CatalogPage() {
  const { connector } = useConnectorDashboardState();
  const { offset, limit } = usePagination();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openAssetData, setOpenAssetData] = useState({
    asset: {} as Asset,
    participantId: "" as string,
    contractDefinitions: [] as ContractDefinition[],
  });

  const openDetailsModal = (asset: Asset, participantId: string, contractDefinitions: ContractDefinition[]) => {
    setIsDetailsModalOpen(true);
    setOpenAssetData({ asset, participantId, contractDefinitions });
  };

  return (
    <>
      <SideDrawer title={<T string="catalog.title" />}>
        <Catalog managementUrl={connector.managementUrl} protocolUrl={connector.protocolUrl} >
          <Catalog.Provider>
            {({ endpointUrl }) => (
              <AssetDetailsDialog
                open={isDetailsModalOpen}
                asset={openAssetData.asset}
                participantId={openAssetData.participantId}
                connectorEndpoint={endpointUrl}
                contractDefinitions={openAssetData.contractDefinitions}
                onClose={() => setIsDetailsModalOpen(false)}
                contentStyle={{ maxWidth: "90vw", width: "1000px" }}
              />
            )}
          </Catalog.Provider>
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
                <AssetCard asset={dataSetToAsset(item) as any} key={index} onClick={() => openDetailsModal(dataSetToAsset(item) as any, participantId, dataSetToContractDefinitions(item))} participantId={participantId} />
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
