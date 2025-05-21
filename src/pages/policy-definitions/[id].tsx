import { Button } from "@/components/atoms/button";

import {
  PolicyDefinitionView,
  usePolicyDefinitionContext,
} from "@think-it-labs/edc-connector-ui/policy-definition-view";

import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { List } from "@think-it-labs/edc-connector-ui/list";

function DeletePolicyDefinition() {
  const { deleteItem } = usePolicyDefinitionContext();
  const { push } = useRouter();

  return (
    <Button
      variant="unstyled"
      onClick={async () => {
        await deleteItem();
        push("/policy-definitions");
      }}
    >
      Delete
    </Button>
  );
}

export default function PolicyDefinitionPage() {
  const id = useRouter().query.id as string;

  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;

  return (
    <SideDrawer title={<T string="policyDefinitions.[id].title" />}>
      <PolicyDefinitionView
        id={id}
        managementUrl={managementUrl}
      >
        <h3 className="text-lg font-bold text-gray-800">
          <PolicyDefinitionView.Id />
        </h3>
        <p className="mt-1 text-xs font-medium uppercase text-gray-500">
          <PolicyDefinitionView.CreatedAt />
        </p>
        <p className="mt-1 text-xs font-medium uppercase text-gray-500">
          <PolicyDefinitionView.Policy.Permissions>
            {() => {
              (
                <p>Permission</p>
              )
            }}
          </PolicyDefinitionView.Policy.Permissions>
        </p>
        <DeletePolicyDefinition />
      </PolicyDefinitionView>
    </SideDrawer>
  );
}
