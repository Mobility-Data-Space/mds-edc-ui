import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useEffect, useState } from "react";
import { proxyConnectorManagement } from "@/constants/proxy";

export interface EdcEntitiesCount {
  dataOffers: number;
  assets: number;
  policies: number;
  preconfiguredCatalogs: number;
  contractAgreements: number;
}

const defaultEdcEntitiesCount = {
  dataOffers: 0,
  assets: 0,
  policies: 0,
  preconfiguredCatalogs: 0,
  contractAgreements: 0,
};

type CountedEndpoint =
  | "contractDefinitions"
  | "assets"
  | "policyDefinitions"
  | "contractAgreements";

const endpoints: [string, CountedEndpoint][] = Object.entries({
  dataOffers: "contractDefinitions",
  assets: "assets",
  policies: "policyDefinitions",
  contractAgreements: "contractAgreements",
});

export const useEdcEntitiesCount = (): EdcEntitiesCount => {
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });
  const [count, setCount] = useState<EdcEntitiesCount>(defaultEdcEntitiesCount);

  useEffect(() => {
    endpoints.forEach(([countEntryName, endpoint]) => {
      edcClient.management[endpoint]
        .queryAll({ offset: 0 })
        .then((result: unknown[]) =>
          setCount((count) => ({ ...count, [countEntryName]: result.length })),
        )
        .catch(() => setCount((count) => ({ ...count, [countEntryName]: 0 })));
    });
  }, [edcClient]);

  return count;
};
