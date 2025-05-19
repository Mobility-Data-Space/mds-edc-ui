import { Button } from "@/components/atoms/button";

import {
  ContractDefinitionView,
  useContractDefinitionContext,
} from "@think-it-labs/edc-connector-ui/contract-definition-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

function DeleteContractDefinition() {
  const { deleteItem } = useContractDefinitionContext();
  const { push } = useRouter();

  return (
    <Button
      variant="unstyled"
      onClick={async () => {
        await deleteItem();
        push("/assets");
      }}
    >
      Delete
    </Button>
  );
}

export default function ContractDefinitionViewPage() {
  const id = useRouter().query.id as string;
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <SideDrawer title={<T string="contractDefinitions.[id].title" />}>
      <ContractDefinitionView
        id={id}
        managementUrl={managementUrl}
      >
          <h3 className="text-lg font-bold text-gray-800">
            <ContractDefinitionView.Id />
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            <ContractDefinitionView.CreatedAt />
          </p>

          <DeleteContractDefinition />
      </ContractDefinitionView>
    </SideDrawer>
  );
}
