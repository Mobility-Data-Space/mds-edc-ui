import { PolicyDefinition } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { Timestamp, TimestampProps } from "./timestamp";
import { useViewContext, View } from "./view";

export const usePolicyDefinitionContext = () =>
  useViewContext<PolicyDefinition>();

interface PolicyDefinitionViewProps {
  id: string;
  managementUrl: string;
}

export function PolicyDefinitionView(
  { children, id, managementUrl }: PropsWithChildren<PolicyDefinitionViewProps>,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => client.management.policyDefinitions.get(id),
    [client, id],
  );

  const del = useCallback(
    () => client.management.policyDefinitions.delete(id),
    [client, id],
  );

  return (
    <View<PolicyDefinition>
      get={get}
      delete={del}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

PolicyDefinitionView.Id = function PolicyDefinitionViewId() {
  const { item } = usePolicyDefinitionContext();
  return <>{item?.id}</>;
};

PolicyDefinitionView.Policy = {
  Obbligations: function PolicyDefinitionViewPolicyObbligations(
    { children }: any,
  ) {
    const { item, isLoading } = usePolicyDefinitionContext();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {!isLoading && item?.policy.obligations.map((item, index) => (
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
    const { item, isLoading } = usePolicyDefinitionContext();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {!isLoading && item?.policy.permissions.map((item, index) => (
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
    const { item, isLoading } = usePolicyDefinitionContext();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    <>
      {!isLoading && item?.policy.prohibitions.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>;
  },
};

PolicyDefinitionView.CreatedAt = function PolicyDefinitionCreatedAt(
  props: Omit<TimestampProps, "seconds" | "milliseconds">,
) {
  const { item } = usePolicyDefinitionContext();

  return <Timestamp {...props} seconds={item?.createdAt} />;
};

PolicyDefinitionView.Loading = View.Loading;
