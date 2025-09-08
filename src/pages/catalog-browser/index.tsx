import { Input } from "@/components/atoms/input";
import { CounterPartyAddressDialog } from "@/components/molecules/counter-party-address-dialog";
import { ErrorPopup } from "@/components/molecules/error-popup";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import DataOfferCard from "@/components/organisms/data-offer-card";
import DataOfferDialog from "@/components/organisms/data-offer-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useDebounce } from "@/hooks/use-debounce";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useSessionState } from "@/hooks/use-session-state";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { T, useTranslator } from "@/i18n";
import { Badge, Icon, IconButton, Tooltip, Typography } from "@mui/material";
import { Dataset } from "@think-it-labs/edc-connector-client";
import { ContractOffersList } from "@think-it-labs/edc-connector-ui/contract-offers-list";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { useRouter } from "next/router";

import { useCallback, useEffect, useState } from "react";
import { MAX_ITEMS } from "../../constants/lists";

export default function CatalogPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const { query } = useRouter();
  const updateQueryParams = useUpdateQueryParams()
  const [hasBadUrlError, setHasBadUrlError] = useState(false);

  const [listKey, setListKey] = useState(1);
  const [isDataOfferDialogOpen, setIsDataOfferDialogOpen] = useState(false);
  const [isCounterPartyAddressDialogOpen, setIsCounterPartyAddressDialogOpen] = useState(false);

  const [counterPartyAddress, setCounterPartyAddress] = useSessionState("counterPartyAddress", "");
  const [counterPartyAddressToSearch, setCounterPartyAddressToSearch] = useState(counterPartyAddress);

  const { debounce: debouncedSetCounterPartyAddress } = useDebounce((url) => {
    setCounterPartyAddress(url)
    updateQueryParams({ page: String(0) })
    setHasBadUrlError(false);
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("counterPartyAddress");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const [catalogParticipantId, setCatalogParticipantId] = useState("");
  const [datasetToNegotiate, setDatasetToNegotiate] = useState<Dataset>({} as Dataset);

  const client = useEdcConnectorClient({ management: proxyConnectorManagement });
  useEffect(() => {
    if (counterPartyAddress) {
      client.management.catalog.request({ counterPartyAddress }).then((catalog) => {
        setCatalogParticipantId(catalog["https://w3id.org/dspace/v0.8/participantId"][0]["@value"])
      })
    }
  }, [client, counterPartyAddress])

  const openDataOfferDialog = (dataset: Dataset) => {
    setIsDataOfferDialogOpen(true);
    setDatasetToNegotiate(dataset);
  };

  const navigateToPage = useCallback((newPage: number) => {
    updateQueryParams({ page: String(newPage) })
  }, [updateQueryParams])

  return (
    <>
      <DataOfferDialog
        open={isDataOfferDialogOpen}
        dataset={datasetToNegotiate}
        participantId={catalogParticipantId}
        counterPartyAddress={counterPartyAddress}
        assetIsOwned={counterPartyAddress === connector.protocolUrl}
        onClose={() => setIsDataOfferDialogOpen(false)}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        onNegotiateSuccess={() => setListKey(key => key + 1)}
      />

      <CounterPartyAddressDialog
        open={isCounterPartyAddressDialogOpen}
        onClose={() => setIsCounterPartyAddressDialogOpen(false)}
        content={counterPartyAddress}
      />

      <SideDrawer title={<T string="catalog.title" />}>
        <div className="h-[70vh]">
          <ContractOffersList
            managementUrl={proxyConnectorManagement}
            counterPartyAddress={counterPartyAddress}
            usePagination
            navigate={navigateToPage}
            currentPage={parseInt(query.page as string) || 0}
            firstPage={0}
            shouldFetch={!!counterPartyAddress}
          >
            <div className="w-full grid grid-rows-1 grid-cols-5 gap-x-3.5 py-4 items-center">
              <Badge badgeContent={1} color="error" invisible={!hasBadUrlError} className="col-span-2">
                <Input
                  id="catalog-url"
                  fullWidth
                  data-testid="catalog-url"
                  type="text"
                  label={<T string="catalog.connectorEndpoints" />}
                  placeholder="https://other-connector.com/api/dsp"
                  value={counterPartyAddressToSearch ? counterPartyAddressToSearch : null}
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      classes: { root: "flex-grow" },
                      startAdornment: <Icon className="mr-2">link</Icon>,
                      endAdornment: hasBadUrlError ?
                        <Icon color="error">warning</Icon> :
                        <Tooltip title={translator("catalog.clickForDetails")}>
                          <IconButton onClick={() => setIsCounterPartyAddressDialogOpen(true)}>
                            <Icon color="primary">info</Icon>
                          </IconButton>
                        </Tooltip>
                    }
                  }}
                  onChange={(event) => {
                    setCounterPartyAddressToSearch(event.target.value);
                    debouncedSetCounterPartyAddress(event.target.value);
                  }}
                />
              </Badge>
              <div className="col-span-2">
                <SearchBar searchTarget="http://purl.org/dc/terms/title" placeholder={translator("catalog.searchPlaceholder")} searchOperator="ilike" />
              </div>
              <div className="justify-self-center">
                <ContractOffersList.Pagination>
                  {({ decrementPage, hasPrev, hasNext, incrementPage, page, itemsCount }) =>
                    <PaginationControls
                      page={page}
                      hasPrev={hasPrev}
                      hasNext={hasNext}
                      decrementPage={decrementPage}
                      incrementPage={incrementPage}
                      maxItems={MAX_ITEMS}
                      itemsCount={itemsCount}
                    />
                  }
                </ContractOffersList.Pagination>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 h-full" data-testid="catalog-list">
              {counterPartyAddress ? <ContractOffersList.Items
                key={listKey}
                limit={MAX_ITEMS}
              >
                {({ item, index }) => (
                  <DataOfferCard
                    key={index}
                    dataset={item}
                    participantId={catalogParticipantId}
                    onClick={() => openDataOfferDialog(item)}
                    dataTestId="catalog-item"
                  />
                )}
              </ContractOffersList.Items>
                : <div className={"size-full flex flex-col items-center justify-center"}>

                  <Icon style={{ fontSize: "0px" }}>info</Icon>

                  <Typography variant="h6" component="h6" color="info">

                    <T string="catalog.emptyCounterPartyUrl" />

                  </Typography>

                </div>}
              {hasBadUrlError && <div className={"size-full flex flex-col items-center justify-center"}>

                <Icon color="error" style={{ fontSize: "80px" }}>error</Icon>

                <Typography variant="h5" component="h5" color="error">

                  <T string="catalog.failedFetchingCatalog" />

                </Typography>

              </div>}
              <ContractOffersList.Loading>
                <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 self-start">
                  <span
                    className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </span>
                </div>
              </ContractOffersList.Loading>
            </div>

            <ContractOffersList.Error>
              {({ errors }) => (
                <ErrorPopup
                  errors={errors}
                  errorMessageKey="common.catalogLoadError"
                />
              )}
            </ContractOffersList.Error>
          </ContractOffersList>
        </div>
      </SideDrawer>
    </>);
}
