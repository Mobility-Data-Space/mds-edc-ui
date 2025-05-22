import {
  PolicyDefinitionView,
  usePolicyDefinitionContext,
} from "@think-it-labs/edc-connector-ui/policy-definition-view";

import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { useRouter } from "next/router";
import React from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import {convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {ConstraintShow} from "@/components/molecules/constraint-show.tsx";
import {Constraint} from "@think-it-labs/edc-connector-client";
import {Button} from "@mui/material";

function DeletePolicyDefinition() {
  const { deleteItem } = usePolicyDefinitionContext();
  const { push } = useRouter();

  return (
    <div>
      <Button
        variant="contained"
        color="error"
        onClick={async () => {
          await deleteItem();
          push("/policy-definitions");
        }}
      >
        Delete
      </Button>
    </div>
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
        <div className="flex flex-col gap-y-4">
          <h3 className="text-lg font-bold text-gray-800">
            <PolicyDefinitionView.Id/>
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500">
            <PolicyDefinitionView.CreatedAt/>
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            <PolicyDefinitionView.Policy.Permissions>
              {({ item }: { item: Constraint }) => <ConstraintShow
                  data={convertOdrlToJsonHtml(removeJsonLdSchemaFromProperties(item)?.constraint, ",")}
              />}
            </PolicyDefinitionView.Policy.Permissions>
          </p>
        </div>
      </PolicyDefinitionView>
    </SideDrawer>
  );
}
