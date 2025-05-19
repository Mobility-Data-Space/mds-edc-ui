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
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import {IconButton, Tooltip} from "@mui/material";
import {CounterPartyAddressDialog} from "@/components/molecules/counter-party-address-dialog.tsx";
import {useDebounce} from "@/hooks/use-debounce.ts";

export default function CatalogPage() {
  const { connector } = useParticipantConnectorState();
  const { offset, limit } = usePagination();
  const { translator } = useTranslator();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCounterPartyAddressDialogOpen, setIsCounterPartyAddressDialogOpen] = useState(false);

  const [counterPartyAddress, setCounterPartyAddress] = useState(connector.protocolUrl) ;
  const [counterPartyAddressToSearch, setCounterPartyAddressToSearch] = useState(connector.protocolUrl) ;
  const { debounce: debouncedSetCounterPartyAddress } = useDebounce((url) => setCounterPartyAddressToSearch(url));

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
        connectorEndpoint={counterPartyAddress}
        contractDefinitions={openAssetData.contractDefinitions}
        assetIsOwned={counterPartyAddress === connector.protocolUrl}
        onClose={() => setIsDetailsModalOpen(false)}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
      />

      <CounterPartyAddressDialog
        open={isCounterPartyAddressDialogOpen}
        onClose={() => setIsCounterPartyAddressDialogOpen(false)}
        content={counterPartyAddress}
      />
      <SideDrawer title={<T string="catalog.title"/>}>
        <div className="grid grid-cols-3 gap-x-3.5 py-4">
          <div>
            <Input
              id="catalog-url"
              data-testid="catalog-url"
              type="text"
              label={<T string="catalog.connectorEndpoints"/>}
              placeholder="https://other-connector.com/co"
              value={counterPartyAddress}
              slotProps={{
                input: {
                  classes: {root: "flex-grow"},
                  startAdornment: <LinkIcon className="mr-2"/>,
                  endAdornment: <Tooltip title={translator("catalog.clickForDetails")}>
                    <IconButton onClick={() => setIsCounterPartyAddressDialogOpen(true)}>
                      <InfoIcon color="primary"/>
                    </IconButton>
                  </Tooltip>
                }
              }}
              onChange={(event) => {
                setCounterPartyAddress(event.target.value);
                debouncedSetCounterPartyAddress(event.target.value);
              }}
            />
          </div>
          <div>
            {/* TODO: move pagination here */}
          </div>
          </div>
          <ContractOffersList managementUrl={connector.managementUrl} counterPartyAddress={counterPartyAddressToSearch}>
            <div className="flex flex-wrap gap-2.5">
              <ContractOffersList.Items
                limit={limit}
                offset={offset}
                sortOrder="DESC"
              >
                {({item, index}) => (
                  <AssetCard asset={dataSetToAsset(item) as any} key={index}
                             onClick={() => openDetailsModal(dataSetToAsset(item) as any, counterPartyAddress, dataSetToContractDefinitions(item))}
                             participantId={connector.id}/>
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
