import {ContractAgreement, JsonLdObject, Policy} from "@think-it-labs/edc-connector-client";
import React, {ReactNode, useMemo} from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";
import { Local, useLocalContext } from "./local";
import { useViewContext, View } from "./view";

export const useContractAgreementContext = () =>
  useViewContext<ContractAgreement>();

interface ContractAgreementProps {
  id: string;
  managementUrl: string;
}

export function ContractAgreementView(
  { children, id, managementUrl }: PropsWithChildren<ContractAgreementProps>,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const get = useCallback(
    () => {
      if (id != undefined)
        return client.management.contractAgreements.get(id)

      return Promise.resolve(new ContractAgreement())
    },
    [client, id],
  );

  return (
    <View<ContractAgreement>
      get={get}
      managementUrl={managementUrl}
    >
      {children}
    </View>
  );
}

ContractAgreementView.Id = function ContractAgreementViewId() {
  const { item } = useContractAgreementContext();
  return <>{item?.id}</>;
};

ContractAgreementView.AssetId = function ContractAgreementViewAssetId() {
  const { item } = useContractAgreementContext();
  return <>{item?.assetId}</>;
};

ContractAgreementView.ConsumerId = function ContractAgreementViewConsumerId() {
  const { item } = useContractAgreementContext();
  return <>{item?.consumerId}</>;
};

ContractAgreementView.ProviderId = function ContractAgreementViewProviderId() {
  const { item } = useContractAgreementContext();
  return <>{item?.providerId}</>;
};

ContractAgreementView.Item = function ContractAgreementViewItem() {
  const { item } = useContractAgreementContext();
  return item;
};

ContractAgreementView.ContractSigningDate = function ContractAgreementViewContractSigningDate() {
  const { item } = useContractAgreementContext();
  return <>{item?.contractSigningDate && (new Date(item.contractSigningDate * 1000).toString())}</>;
};

ContractAgreementView.PolicyPermissions = function ContractAgreementViewContractSigningDate({ children }: { children: ({ item }: { item?: JsonLdObject[] }) => ReactNode }) {
  const { item } = useContractAgreementContext();
  return children({ item: item?.policy?.permissions });
};

ContractAgreementView.Loading = View.Loading;

interface ContractAgreementViewPolicyProps {
  policy?: Policy;
}

function ContractAgreementViewPolicy(
  { policy, children }: PropsWithChildren<
    ContractAgreementViewPolicyProps
  >,
) {
  return (
    <Local
      item={policy}
    >
      {children}
    </Local>
  );
}

ContractAgreementViewPolicy.Obbligations =
  function ContractAgreementViewPolicyObbligations(
    { children }: any,
  ) {
    const { item } = useLocalContext<Policy>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    return (<>
      {item?.obligations.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>);
  };

ContractAgreementViewPolicy.Prohibitions =
  function ContractAgreementViewPolicyProhibitions(
    { children }: any,
  ) {
    const { item } = useLocalContext<Policy>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    return (<>
      {item?.prohibitions.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>);
  };

ContractAgreementViewPolicy.Permissions =
  function ContractAgreementViewPolicyPermissions(
    { children }: any,
  ) {
    const { item } = useLocalContext<Policy>();

    const Item = useMemo(() => {
      return function Item(props: any) {
        return <>{children(props)}</>;
      };
    }, [children]);

    return (<>
      {item?.permissions.map((item, index) => (
        <Item
          key={item}
          item={item}
          index={index}
        />
      ))}
    </>);
  };

ContractAgreementView.Policy = ContractAgreementViewPolicy;
