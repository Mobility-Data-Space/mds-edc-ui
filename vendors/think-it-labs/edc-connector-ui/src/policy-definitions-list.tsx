import {
  PolicyDefinition,
  QuerySpec,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { List, useListContext } from "./list";
import { Local, useLocalContext } from "./local";

interface PolicyDefinitionsListProps {
  managementUrl: string;
}

export function PolicyDefinitionsList({
  children,
  managementUrl,
}: PropsWithChildren<PolicyDefinitionsListProps>) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const queryAll = useCallback(
    (querySpec: QuerySpec) => {
      if (Object.keys(querySpec).length != 0) {
        return client.management.policyDefinitions.queryAll(querySpec);
      }

      return Promise.resolve([new PolicyDefinition()]) ;
    },
    [client],
  );

  const del = useCallback(
    (id: string) => client.management.policyDefinitions.delete(id),
    [client],
  );

  return (
    <List<PolicyDefinition>
      queryAll={queryAll}
      delete={del}
      getId={(policyDefinition: PolicyDefinition) => policyDefinition.id}
      managementUrl={managementUrl}
    >
      {children}
    </List>
  );
}

PolicyDefinitionsList.Items = List.Items<PolicyDefinition>;

PolicyDefinitionsList.Loading = List.Loading;

PolicyDefinitionsList.Search = List.Search;

PolicyDefinitionsList.SearchTrigger = List.SearchTrigger;

interface PolicyDefinitionsListPolicyDefinitionProps {
  policyDefinition?: PolicyDefinition;
}

function PolicyDefinitionsListPolicyDefinition(
  { policyDefinition, children }: PropsWithChildren<
    PolicyDefinitionsListPolicyDefinitionProps
  >,
) {
  const { managementUrl } = useListContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  return (
    <Local
      item={policyDefinition}
      delete={async () => {
        if (policyDefinition?.id) {
          await client.management.policyDefinitions.delete(
            policyDefinition?.id,
          );
        }
      }}
    >
      {children}
    </Local>
  );
}

PolicyDefinitionsList.PolicyDefinition = PolicyDefinitionsListPolicyDefinition;

PolicyDefinitionsListPolicyDefinition.Id = function PolicyDefinitionViewId() {
  const { item } = useLocalContext<PolicyDefinition>();
  return <>{item?.id}</>;
};

PolicyDefinitionsListPolicyDefinition.Policy = {
  Obbligations: function PolicyDefinitionViewPolicyObbligations(
    { children }: any,
  ) {
    const { item } = useLocalContext<PolicyDefinition>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {item?.policy.obligations.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>;
  },
  Permissions: function PolicyDefinitionViewPolicyPermissions(
    { children }: any,
  ) {
    const { item } = useLocalContext<PolicyDefinition>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {item?.policy.permissions.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>;
  },
  Prohibitions: function PolicyDefinitionViewPolicyProhibitions(
    { children }: any,
  ) {
    const { item } = useLocalContext<PolicyDefinition>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {item?.policy.prohibitions.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>;
  },
};
