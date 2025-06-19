import React, { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton, Tooltip } from "@mui/material";
import { Dataset } from "@think-it-labs/edc-connector-client";
import { ContractOffersList } from "@think-it-labs/edc-connector-ui/contract-offers-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useDebounce } from "@/hooks/use-debounce";
import { T, useTranslator } from "@/i18n";
import { Input } from "@/components/atoms/input";
import SideDrawer from "@/components/organisms/side-drawer";
import { CounterPartyAddressDialog } from "@/components/molecules/counter-party-address-dialog";
import DataOfferDialog from "@/components/organisms/data-offer-dialog";
import DataOfferCard from "@/components/organisms/data-offer-card";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { useRouter } from "next/router";
import { List } from "@think-it-labs/edc-connector-ui/list";
import { MAX_ITEMS } from "../../constants/lists";

export default function CatalogPage() {
  const { query, push } = useRouter()
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();

  const [listKey, setListKey] = useState(1);
  const [isDataOfferDialogOpen, setIsDataOfferDialogOpen] = useState(false);
  const [isCounterPartyAddressDialogOpen, setIsCounterPartyAddressDialogOpen] = useState(false);

  const [counterPartyAddress, setCounterPartyAddress] = useState("");
  const [counterPartyAddressToSearch, setCounterPartyAddressToSearch] = useState("");
  const { debounce: debouncedSetCounterPartyAddress } = useDebounce((url) => {
    setCounterPartyAddressToSearch(url)
    fetchCatalogParticipantId(url)
  });

  const [catalogParticipantId, setCatalogParticipantId] = useState("");
  const [datasetToNegotiate, setDatasetToNegotiate] = useState<Dataset>({} as Dataset);

  const client = useEdcConnectorClient({ management: connector.managementUrl });
  const fetchCatalogParticipantId = (counterPartyAddress: string) => {
    client.management.catalog.request({
      counterPartyAddress
    })
      .then((catalog) => {
        setCatalogParticipantId(catalog["https://w3id.org/dspace/v0.8/participantId"][0]["@value"])
      })
      .catch((error) => {
      })
  }

  const openDataOfferDialog = (dataset: Dataset) => {
    setIsDataOfferDialogOpen(true);
    setDatasetToNegotiate(dataset);
  };

  const navigate = useCallback((newPage: number) => {
    push(
      {
        href: window.location.href,
        query: {
          ...query,
          page: newPage,
        },
      },
    );

  }, [])

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
        <div className="grid grid-cols-3 gap-x-3.5 py-4">
          <div>
            <Input
              id="catalog-url"
              fullWidth
              data-testid="catalog-url"
              type="text"
              label={<T string="catalog.connectorEndpoints" />}
              placeholder="https://other-connector.com/"
              value={counterPartyAddress}
              slotProps={{
                input: {
                  classes: { root: "flex-grow" },
                  startAdornment: <LinkIcon className="mr-2" />,
                  endAdornment: <Tooltip title={translator("catalog.clickForDetails")}>
                    <IconButton onClick={() => setIsCounterPartyAddressDialogOpen(true)}>
                      <InfoIcon color="primary" />
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
        </div>
        <ContractOffersList
          managementUrl={connector.managementUrl}
          counterPartyAddress={counterPartyAddressToSearch}
          usePagination
          navigate={navigate}
          currentPage={parseInt(query.page as string) || 0}
          firstPage={0}
        >
          <div className="flex justify-end items-center">
            <List.Pagination>
              {({ hasNext, incrementPage, hasPrev, decrementPage }) =>
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
                </div>}
            </List.Pagination>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <ContractOffersList.Items
              key={listKey}
              limit={MAX_ITEMS}
              sortOrder="DESC"
            >
              {({ item, index }) => (
                <DataOfferCard
                  key={index}
                  dataset={item}
                  participantId={catalogParticipantId}
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
