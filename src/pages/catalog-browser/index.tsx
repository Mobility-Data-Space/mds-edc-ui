import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import { Input } from "@/components/atoms/input";
import React, {useState} from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

import {datasetToAsset, datasetToContractDefinitions} from "@/utilities/catalog";
import {Asset, ContractDefinition, Dataset, Policy} from "@think-it-labs/edc-connector-client";

import { ContractOffersList } from "@think-it-labs/edc-connector-ui/contract-offers-list";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import {IconButton, Pagination, Tooltip} from "@mui/material";
import {CounterPartyAddressDialog} from "@/components/molecules/counter-party-address-dialog.tsx";
import {useDebounce} from "@/hooks/use-debounce.ts";
import DataOfferDialog from "@/components/organisms/data-offer-dialog";
import DataOfferCard from "@/components/organisms/data-offer-card";
import SearchIcon from "@mui/icons-material/Search";

import {ChevronLeft, ChevronRight} from "lucide-react";

export default function CatalogPage() {
  const { connector } = useParticipantConnectorState();
  const { decrementPage, incrementPage, offset, limit, hasPrev } = usePagination();
  const { translator } = useTranslator();

  const [isDataOfferDialogOpen, setIsDataOfferDialogOpen] = useState(false);
  const [isCounterPartyAddressDialogOpen, setIsCounterPartyAddressDialogOpen] = useState(false);


  const [shrinkSearch, setShrinkSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("") ;
  const [searchValueToSearch, setSearchValueToSearch] = useState("") ;
  const { debounce: debounceSetSearchValueToSearch } = useDebounce(setSearchValueToSearch);
  const [counterPartyAddress, setCounterPartyAddress] = useState("") ;
  const [counterPartyAddressToSearch, setCounterPartyAddressToSearch] = useState("") ;
  const { debounce: debouncedSetCounterPartyAddress } = useDebounce((url) => setCounterPartyAddressToSearch(url));

  const [datasetToNegotiate, setDatasetToNegotiate] = useState<Dataset>({} as Dataset);
  
  const openDataOfferDialog = (dataset: Dataset) => {
    setIsDataOfferDialogOpen(true);
    setDatasetToNegotiate(dataset);
  };

  return (
    <>
      <DataOfferDialog
        open={isDataOfferDialogOpen}
        dataset={datasetToNegotiate}
        participantId={connector.id}
        counterPartyAddress={counterPartyAddress}
        assetIsOwned={counterPartyAddress === connector.protocolUrl}
        onClose={() => setIsDataOfferDialogOpen(false)}
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
              id="catalog-search"
              fullWidth
              data-testid="catalog-search"
              type="text"
              label={<T string="catalog.search"/>}
              value={searchValue}
              onFocus={() => setShrinkSearch(true)}
              onBlur={(e) => setShrinkSearch(!!e.target.value)}
              slotProps={{
                input: {
                  classes: {root: "flex-grow"},
                  startAdornment: <SearchIcon className="mr-2"/>,
                },
                inputLabel: {
                  shrink: shrinkSearch,
                  className: shrinkSearch ? "" : "ml-7",
                }
              }}
              onChange={(event) => {
                setSearchValue(event.target.value);
                debounceSetSearchValueToSearch(event.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="catalog-url"
              fullWidth
              data-testid="catalog-url"
              type="text"
              label={<T string="catalog.connectorEndpoints"/>}
              placeholder="https://other-connector.com/"
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
          <div className="flex justify-end items-center">
            <div className="inline-flex float-right gap-x-2">
              <IconButton
                onClick={decrementPage}
                disabled={!hasPrev}
              >
                <ChevronLeft className="size-6"/>
              </IconButton>
              <IconButton
                onClick={incrementPage}
              >
                <ChevronRight className="size-6"/>
              </IconButton>
            </div>
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
                <DataOfferCard
                  key={index}
                  dataset={item}
                  participantId={connector.id}
                  onClick={() => openDataOfferDialog(item)}
                />
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
