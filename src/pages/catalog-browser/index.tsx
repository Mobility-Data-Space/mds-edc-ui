import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import { Input } from "@/components/atoms/input";
import React, {useState} from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import AssetCard from "@/components/organisms/asset-card.tsx";
import {dataSetToAsset, dataSetToContractDefinitions} from "@/schema/catalog.ts";
import {Asset, ContractDefinition} from "@think-it-labs/edc-connector-client";
import AssetDetailsDialog from "@/components/organisms/asset-details-dialog.tsx";
import { ContractOffersList } from "@think-it-labs/edc-connector-ui/contract-offers-list";
import {Button as MuiButton} from '@mui/material';
import { PlusCircle, Search, SearchIcon } from "lucide-react";

export default function CatalogPage() {
  const { connector } = useParticipantConnectorState();
  const { offset, limit } = usePagination();

  const { globalTranslator } = useTranslator();
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [counterPartyAddress, setCounterPartyAddress] = useState(connector.protocolUrl) ;

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
      <AssetDetailsDialog
        open={isDetailsModalOpen}
        asset={openAssetData.asset}
        participantId={openAssetData.participantId}
        connectorEndpoint={connector.protocolUrl}
        contractDefinitions={openAssetData.contractDefinitions}
        assetIsOwned={counterPartyAddress === connector.protocolUrl}
        onClose={() => setIsDetailsModalOpen(false)}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
      />
      <SideDrawer title={<T string="catalog.title" />}>
        <div className="flex gap-x-4 py-4">
          <Input
            fullWidth={true}
            placeholder="Counter Party Address"
            slotProps={{
              input: {
                classes: { root: "flex-grow" },
                startAdornment: <SearchIcon />,
              }
            }}
            value={counterPartyAddress}
            onChange={(event) => setCounterPartyAddress(event.target.value)}
          />
        </div>
        <ContractOffersList managementUrl={connector.managementUrl} counterPartyAddress={counterPartyAddress}>
          <div className="flex flex-wrap gap-2.5">
            <ContractOffersList.Items
              limit={limit}
              offset={offset}
              sortOrder="DESC"
            >
              {({ item, index }) => (
                <AssetCard asset={dataSetToAsset(item) as any} key={index} onClick={() => openDetailsModal(dataSetToAsset(item) as any, connector.id, dataSetToContractDefinitions(item))} participantId={connector.id} />
              )}
            </ContractOffersList.Items>
          </div>
          <ContractOffersList.Loading>
            <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
              <span
                className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </span>
            </div>
          </ContractOffersList.Loading>
        </ContractOffersList>
      </SideDrawer>
    </>
  );
}
