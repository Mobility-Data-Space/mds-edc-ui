import {ContractDefinition, Criterion, PolicyDefinition} from "@think-it-labs/edc-connector-client";
import React, {ReactNode} from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { PolicyDefinitionView } from "./policy-definition-view";
import { Timestamp, TimestampProps } from "./timestamp";
import { useViewContext, View } from "./view";

export const useContractDefinitionContext = () =>
  useViewContext<ContractDefinition>();

interface ContractDefinitionViewProps {
  id: string;
  managementUrl: string;
}

export function ContractDefinitionView(
  { children, id, managementUrl }: PropsWithChildren<
    ContractDefinitionViewProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => {
      if (id != undefined)
        return client.management.contractDefinitions.get(id)

      return Promise.resolve(new ContractDefinition())
    },
    [client, id],
  );

  const del = useCallback(
    () => client.management.contractDefinitions.delete(id),
    [client, id],
  );

  return (
    <View<ContractDefinition>
      get={get}
      delete={del}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

ContractDefinitionView.Id = function PolicyDefinitionViewId() {
  const { item } = useContractDefinitionContext();
  return <>{item?.id}</>;
};

ContractDefinitionView.CreatedAt = function ContractDefinitionViewCreatedAt(
  props: Omit<TimestampProps, "seconds" | "milliseconds">,
) {
  const { item } = useContractDefinitionContext();
  return <Timestamp {...props} milliseconds={item?.createdAt} />;
};

ContractDefinitionView.AssetsSelector = function PolicyDefinitionViewId({ children }: { children: ({ item }: { item?: Criterion[] }) => ReactNode }) {
  const { item } = useContractDefinitionContext();
  return children({ item: item?.assetsSelector });
};

ContractDefinitionView.Loading = View.Loading;

function ContractDefinitionViewAccessPolicy({ children }: PropsWithChildren) {
  const { item, managementUrl } = useContractDefinitionContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => client.management.policyDefinitions.get(item!.accessPolicyId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, item?.accessPolicyId],
  );

  if (!item?.accessPolicyId) {
    return null;
  }

  return (
    <View<PolicyDefinition> managementUrl={managementUrl} get={get}>
      {children}
    </View>
  );
}

ContractDefinitionViewAccessPolicy.Id = PolicyDefinitionView.Id;
ContractDefinitionViewAccessPolicy.Policy = PolicyDefinitionView.Policy;
ContractDefinitionViewAccessPolicy.CreatedAt = PolicyDefinitionView.CreatedAt;
ContractDefinitionViewAccessPolicy.Loading = View.Loading;

ContractDefinitionView.AccessPolicy = ContractDefinitionViewAccessPolicy;

function ContractDefinitionViewContractPolicy({ children }: PropsWithChildren) {
  const { item, managementUrl } = useContractDefinitionContext();
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => client.management.policyDefinitions.get(item!.contractPolicyId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, item?.contractPolicyId],
  );

  if (!item?.accessPolicyId) {
    return null;
  }

  return (
    <View<PolicyDefinition> managementUrl={managementUrl} get={get}>
      {children}
    </View>
  );
}

ContractDefinitionViewContractPolicy.Id = PolicyDefinitionView.Id;
ContractDefinitionViewContractPolicy.Policy = PolicyDefinitionView.Policy;
ContractDefinitionViewContractPolicy.CreatedAt = PolicyDefinitionView.CreatedAt;
ContractDefinitionViewContractPolicy.Loading = View.Loading;

ContractDefinitionView.ContractPolicy = ContractDefinitionViewContractPolicy;
