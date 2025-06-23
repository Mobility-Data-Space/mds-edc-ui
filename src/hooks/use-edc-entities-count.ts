import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import {useEffect, useState} from "react";
import {ManagementController} from "@think-it-labs/edc-connector-client/dist/src/facades/management";

export interface EdcEntitiesCount {
  dataOffers: number,
  assets: number,
  policies: number,
  preconfiguredCatalogs: number,
  contractAgreements: number,
}

const defaultEdcEntitiesCount = {
  dataOffers: 0,
  assets: 0,
  policies: 0,
  preconfiguredCatalogs: 0,
  contractAgreements: 0,
}

const endpoints: [string, keyof ManagementController][] = Object.entries({
  dataOffers: "contractDefinitions",
  assets: "assets",
  policies: "policyDefinitions",
  contractAgreements: "contractAgreements",
});

export const useEdcEntitiesCount = (): EdcEntitiesCount => {
  const { connector } = useParticipantConnectorState();

  const edcClient = useEdcConnectorClient({ management: connector.managementUrl });
  const [count, setCount] = useState<EdcEntitiesCount>(defaultEdcEntitiesCount);

  useEffect(() => {
    endpoints.forEach(([countEntryName, endpoint]) => {
      (edcClient.management[endpoint] as any).queryAll({ offset: 0 })
      .then((result: any[]) => setCount(
        count => ({ ...count, [countEntryName]: result.length })
      ))
      .catch((error: any) => setCount(
        count => ({ ...count, [countEntryName]: 0 })
      ));
    });

  }, [edcClient]);

  return count;
};
