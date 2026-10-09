import { Input } from "@/components/atoms/input";
import { CounterPartyAddressDialog } from "@/components/molecules/counter-party-address-dialog";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import DataOfferCard from "@/components/organisms/data-offer-card";
import DataOfferDialog from "@/components/organisms/data-offer-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useDebounce } from "@/hooks/use-debounce";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useSessionState } from "@/hooks/use-session-state";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { T, useTranslator } from "@/i18n";
import { Icon, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import {
  Dataset,
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "@think-it-labs/edc-connector-client";
import { ContractOffersList } from "@think-it-labs/edc-connector-ui/contract-offers-list";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";

import { useEffect, useState } from "react";
import { MAX_ITEMS } from "@/constants/lists";
import { counterPartyAddressWithDsp2025_1 } from "@/utilities/catalog";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { getId } from "@/jsonld/accessors";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { proxyConnectorDiscovery } from "@/constants/proxy";

type DiscoveredConnector = { id: string; protocolAddress: string };

// DAPS connectors don't check the counterparty id, so a catalog can still be
// browsed by address alone. DCP connectors require the provider's DID.
const ADDRESS_ONLY_COUNTERPARTY_ID = "MDS_ID";

export default function CatalogPage() {
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const updateQueryParams = useUpdateQueryParams();
  const [hasBadUrlError, setHasBadUrlError] = useState(false);

  const [listKey, setListKey] = useState(1);
  const [isDataOfferDialogOpen, setIsDataOfferDialogOpen] = useState(false);
  const [isCounterPartyAddressDialogOpen, setIsCounterPartyAddressDialogOpen] =
    useState(false);

  const { showSnackbar } = useAppSnackbar();
  const [counterPartyAddress, setCounterPartyAddress] = useSessionState(
    "counterPartyAddress",
    "",
  );
  const [counterPartyAddressToSearch, setCounterPartyAddressToSearch] =
    useState(counterPartyAddress);
  const [counterPartyId, setCounterPartyId] = useSessionState(
    "counterPartyId",
    "",
  );
  const [counterPartyIdToSearch, setCounterPartyIdToSearch] =
    useState(counterPartyId);
  const [discoveredConnectors, setDiscoveredConnectors] = useState<
    DiscoveredConnector[]
  >([]);
  const [discoveryError, setDiscoveryError] = useState("");

  useEffect(() => {
    setCounterPartyAddressToSearch(counterPartyAddress);
  }, [counterPartyAddress]);

  const { debounce: debouncedSetCounterPartyAddress } = useDebounce((url: string) => {
    updateQueryParams({ page: String(0) });
    setCounterPartyAddress(url);
    setHasBadUrlError(false);
  }, 1_200);

  const { debounce: debouncedSetCounterPartyId } = useDebounce((did: string) => {
    updateQueryParams({ page: String(0) });
    setCounterPartyId(did.trim());
  }, 1_200);

  useEffect(() => {
    setDiscoveredConnectors([]);
    setDiscoveryError("");
    if (!counterPartyId.startsWith("did:web:")) {
      return;
    }

    const controller = new AbortController();
    async function discover(did: string) {
      try {
        const response = await fetch(
          `${proxyConnectorDiscovery}?did=${encodeURIComponent(did)}`,
          { signal: controller.signal },
        );
        const body = await response.json();
        if (!response.ok) {
          setDiscoveryError(translator("catalog.discoveryFailed"));
          return;
        }
        const connectors: DiscoveredConnector[] = body.connectors ?? [];
        setDiscoveredConnectors(connectors);
        if (connectors.length === 0) {
          setDiscoveryError(translator("catalog.noAdvertisedConnectors"));
        } else if (connectors.length === 1) {
          setCounterPartyAddress(connectors[0].protocolAddress);
        }
      } catch {
        if (!controller.signal.aborted) {
          setDiscoveryError(translator("catalog.discoveryFailed"));
        }
      }
    }
    discover(counterPartyId);
    return () => controller.abort();
    // setCounterPartyAddress is recreated on every render; the effect should
    // only run when the DID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counterPartyId, translator]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("counterPartyAddress");
      sessionStorage.removeItem("counterPartyId");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [catalogParticipantId, setCatalogParticipantId] = useState("");
  const [datasetToNegotiate, setDatasetToNegotiate] = useState<Dataset>(
    {} as Dataset,
  );

  const effectiveCounterPartyId = counterPartyId || ADDRESS_ONLY_COUNTERPARTY_ID;

  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  useEffect(() => {
    async function showCatalog(counterPartyAddress: string) {
      try {
        const catalog = await client.management.catalog.request({
          counterPartyId: effectiveCounterPartyId,
          counterPartyAddress:
            counterPartyAddressWithDsp2025_1(counterPartyAddress),
        });
        setCatalogParticipantId(
          getId(catalog["https://w3id.org/dspace/2025/1/participantId"]) ?? "",
        );
        setHasBadUrlError(false);
      } catch (error) {
        const connectorError = error as EdcConnectorClientError;

        if (connectorError.type === EdcConnectorClientErrorType.BadGateway) {
          setHasBadUrlError(true);
        }

        const message = translator("common.catalogLoadError");
        showSnackbar({
          type: "error",
          message,
          persist: true,
        });
      }
    }

    if (counterPartyAddress) {
      showCatalog(counterPartyAddress);
    }
  }, [counterPartyAddress, effectiveCounterPartyId, client, translator, showSnackbar]);

  const openDataOfferDialog = (dataset: Dataset) => {
    setIsDataOfferDialogOpen(true);
    setDatasetToNegotiate(dataset);
  };

  const { currentPage, navigate } = useListPage();

  return (
    <>
      <DataOfferDialog
        open={isDataOfferDialogOpen}
        dataset={datasetToNegotiate}
        participantId={catalogParticipantId}
        counterPartyAddress={counterPartyAddressWithDsp2025_1(
          counterPartyAddress,
        )}
        assetIsOwned={counterPartyAddress === connector?.protocolUrl}
        onClose={() => setIsDataOfferDialogOpen(false)}
        contentStyle={{ maxWidth: "90vw", minWidth: "1000px" }}
        onNegotiateSuccess={() => setListKey((key) => key + 1)}
      />

      <CounterPartyAddressDialog
        open={isCounterPartyAddressDialogOpen}
        onClose={() => setIsCounterPartyAddressDialogOpen(false)}
        content={counterPartyAddress}
      />

      <div className="h-[70vh]">
        <ContractOffersList
          managementUrl={proxyConnectorManagement}
          counterPartyAddress={counterPartyAddressWithDsp2025_1(
            counterPartyAddress,
          )}
          counterPartyId={effectiveCounterPartyId}
          usePagination
          navigate={navigate}
          currentPage={currentPage}
          firstPage={0}
          shouldFetch={!!counterPartyAddress}
        >
          <div className="w-full grid grid-cols-2 gap-x-3.5 pt-4 items-start">
            <Input
              id="catalog-participant-id"
              fullWidth
              data-testid="catalog-participant-id"
              type="text"
              label={<T string="catalog.participantDid" />}
              placeholder="did:web:provider.example.com"
              value={counterPartyIdToSearch || null}
              error={discoveryError}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  classes: { root: "flex-grow" },
                  startAdornment: <Icon className="mr-2">badge</Icon>,
                },
              }}
              onChange={(event) => {
                setCounterPartyIdToSearch(event.target.value);
                debouncedSetCounterPartyId(event.target.value);
              }}
            />
            {discoveredConnectors.length > 1 && (
              <TextField
                select
                id="catalog-discovered-connector"
                data-testid="catalog-discovered-connector"
                color="secondary"
                fullWidth
                label={<T string="catalog.advertisedConnectors" />}
                value={
                  discoveredConnectors.find(
                    (entry) => entry.protocolAddress === counterPartyAddress,
                  )?.id ?? ""
                }
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(event) => {
                  const selected = discoveredConnectors.find(
                    (entry) => entry.id === event.target.value,
                  );
                  if (selected) {
                    updateQueryParams({ page: String(0) });
                    setCounterPartyAddress(selected.protocolAddress);
                  }
                }}
              >
                {discoveredConnectors.map((entry) => (
                  <MenuItem key={entry.id} value={entry.id}>
                    {`${entry.id.split("#").pop()} (${new URL(entry.protocolAddress).host})`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </div>
          <div className="w-full grid grid-rows-1 grid-cols-5 gap-x-3.5 py-4 items-center">
            <div className="col-span-2">
              <Input
                id="catalog-url"
                fullWidth
                data-testid="catalog-url"
                type="text"
                label={<T string="catalog.connectorEndpoints" />}
                placeholder="https://other-connector.com/api/dsp"
                value={counterPartyAddressToSearch || null}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  input: {
                    classes: { root: "flex-grow" },
                    startAdornment: <Icon className="mr-2">link</Icon>,
                    endAdornment: hasBadUrlError ? (
                      <Icon color="error">warning</Icon>
                    ) : (
                      <Tooltip title={translator("catalog.clickForDetails")}>
                        <IconButton aria-label={translator("catalog.clickForDetails")}
                          onClick={() =>
                            setIsCounterPartyAddressDialogOpen(true)
                          }
                        >
                          <Icon color="primary">info</Icon>
                        </IconButton>
                      </Tooltip>
                    ),
                  },
                }}
                onChange={(event) => {
                  setCounterPartyAddressToSearch(event.target.value);
                  debouncedSetCounterPartyAddress(event.target.value);
                }}
              />
            </div>
            <div className="col-span-2">
              <SearchBar
                searchTarget="http://purl.org/dc/terms/title"
                placeholder={translator("catalog.searchPlaceholder")}
                searchOperator="ilike"
              />
            </div>
            <div className="justify-self-center">
              <ContractOffersList.Pagination>{renderPagination}</ContractOffersList.Pagination>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5" data-testid="catalog-list">
            {counterPartyAddress ? (
              <ContractOffersList.Items key={listKey} limit={MAX_ITEMS}>
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
            ) : (
              <div
                className={
                  "size-full flex flex-col items-start justify-center"
                }
              >

                <Typography variant="h6" fontSize="16px" component="h6" color="info">
                  <T string="catalog.emptyCounterPartyUrl" />
                </Typography>
              </div>
            )}
            <ContractOffersList.Loading>
              <LoadingSpinner containerClassName="self-start" />
            </ContractOffersList.Loading>
          </div>
        </ContractOffersList>
      </div>
    </>
  );
}

CatalogPage.titleKey = "catalog.title";
