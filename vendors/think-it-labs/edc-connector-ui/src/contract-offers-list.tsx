import { Dataset, Offer, QuerySpec } from "@think-it-labs/edc-connector-client";
import React, {
  Context,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { AssetView } from "./asset-view";
import { ContractDefinitionView } from "./contract-definition-view";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List } from "./list";
import { ListProps } from "./types";

export type ContractOffersListProps = ListProps & {
  counterPartyAddress: string;
  managementUrl: string;
}

export function ContractOffersList({
  children,
  managementUrl,
  counterPartyAddress,
  ...props
}: PropsWithChildren<ContractOffersListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) =>
      client.management.catalog
        .request({
          counterPartyAddress,
          querySpec,
        })
        .then((catalog) => catalog.datasets),
    [client, counterPartyAddress],
  );

  if (props.usePagination) {
    return (
      <List<Dataset>
        queryAll={queryAll}
        getId={(dataset: Dataset) => dataset.id}
        managementUrl={managementUrl}
        navigate={props.navigate}
        page={props.currentPage}
        usePagination={props.usePagination}
        firstPage={props.firstPage}
      >
        {children}
      </List>)
  }

  return (
    <List<Dataset>
      queryAll={queryAll}
      getId={(dataset: Dataset) => dataset.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

ContractOffersList.Items = List.Items<Dataset>;

ContractOffersList.Loading = List.Loading;

ContractOffersList.Search = List.Search;

ContractOffersList.SearchTrigger = List.SearchTrigger;

ContractOffersList.Pagination = List.Pagination

ContractOffersList.Error = List.Error;

interface ContractOffersListOfferContextType {
  offer: Offer;
}

const ContractOffersListOfferContext = createContext<
  ContractOffersListOfferContextType | null
>(null) as Context<ContractOffersListOfferContextType>;

interface ContractOffersListOfferProps {
  offer: Offer;
}

function useContractOffersListOfferContext() {
  return useContext(ContractOffersListOfferContext);
}

function ContractOffersListOffer(
  { offer, children }: PropsWithChildren<ContractOffersListOfferProps>,
) {
  return (
    <ContractOffersListOfferContext.Provider value={{ offer }}>
      {children}
    </ContractOffersListOfferContext.Provider>
  );
}

ContractOffersListOffer.ContractDefinitionId =
  function ContractOffersListOfferContractDefinitionId() {
    const { offer } = useContractOffersListOfferContext();
    const contractDefinitionId = useMemo(
      () => atob(offer.id.split(":").at(0)!),
      [offer.id],
    );
    return <>{contractDefinitionId}</>;
  };

interface ContractOffersListOfferContractDefinitionProps {
  managementUrl: string;
}

function ContractOffersListOfferContractDefinition(
  props: PropsWithChildren<ContractOffersListOfferContractDefinitionProps>,
) {
  const { offer } = useContractOffersListOfferContext();
  const contractDefinitionId = useMemo(
    () => atob(offer.id.split(":").at(0)!),
    [offer.id],
  );
  return <ContractDefinitionView id={contractDefinitionId} {...props} />;
}

interface ContractOffersListOfferContractDefinitionsProps {
  offers: Offer[];
  children: (props: { contractDefinitionId: string }) => JSX.Element;
}

function ContractOffersListOfferContractDefinitions(
  { offers, children }: ContractOffersListOfferContractDefinitionsProps,
) {
  const contractDefinitions = useMemo(
    () => [...new Set(offers.map((offer) => atob(offer.id.split(":").at(0)!)))],
    [offers],
  );
  return (
    <>
      {contractDefinitions.map((contractDefinitionId) =>
        children({
          contractDefinitionId,
        })
      )}
    </>
  );
}

ContractOffersListOffer.ContractDefinitions =
  ContractOffersListOfferContractDefinitions;

ContractOffersListOfferContractDefinition.Id = ContractDefinitionView.Id;
ContractOffersListOfferContractDefinition.CreatedAt =
  ContractDefinitionView.CreatedAt;
ContractOffersListOfferContractDefinition.Loading =
  ContractDefinitionView.Loading;
ContractOffersListOffer.ContractDefinition =
  ContractOffersListOfferContractDefinition;

ContractOffersListOffer.AssetId = function ContractOffersListOfferAssetId() {
  const { offer } = useContractOffersListOfferContext();
  const assetId = useMemo(() => atob(offer.id.split(":").at(1)!), [offer.id]);
  return <>{assetId}</>;
};

function ContractOffersListOfferAsset(
  props: PropsWithChildren<ContractOffersListOfferContractDefinitionProps>,
) {
  const { offer } = useContractOffersListOfferContext();
  const contractDefinitionId = useMemo(
    () => atob(offer.id.split(":").at(1)!),
    [offer.id],
  );
  return <AssetView id={contractDefinitionId} {...props} />;
}

interface ContractOffersListOfferAssetsProps {
  offers: Offer[];
  children: (props: { assetId: string }) => JSX.Element;
}

function ContractOffersListOfferAssets(
  { offers, children }: ContractOffersListOfferAssetsProps,
) {
  const assets = useMemo(
    () => [...new Set(offers.map((offer) => atob(offer.id.split(":").at(1)!)))],
    [offers],
  );
  return (
    <>
      {assets.map((assetId) =>
        children({
          assetId,
        })
      )}
    </>
  );
}

ContractOffersListOffer.Assets = ContractOffersListOfferAssets;

ContractOffersListOfferAsset.Id = AssetView.Id;
ContractOffersListOfferAsset.Name = AssetView.Name;
ContractOffersListOfferAsset.ContentType = AssetView.ContentType;
ContractOffersListOfferAsset.DataAddress = AssetView.DataAddress;
ContractOffersListOfferAsset.Loading = AssetView.Loading;
ContractOffersListOffer.Asset = ContractOffersListOfferAsset;

ContractOffersListOffer.Salt = function ContractOffersListOfferSalt() {
  const { offer } = useContractOffersListOfferContext();
  const salt = useMemo(() => atob(offer.id.split(":").at(2)!), [offer.id]);
  return <>{salt}</>;
};

ContractOffersList.Offer = ContractOffersListOffer;
