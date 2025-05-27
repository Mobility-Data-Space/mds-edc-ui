import { useRouter } from "next/router";
import React from "react";
import {ContractDefinitionView,} from "@think-it-labs/edc-connector-ui/contract-definition-view";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";

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
        <ul>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractDefinitions.[id].fieldId"/></span>: <ContractDefinitionView.AccessPolicy.Id/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractDefinitions.[id].fieldAccessPolicyId"/></span>: <ContractDefinitionView.AccessPolicy.Id/>
          </li>
          <li className="mt-2">
            <span className="font-bold"><T
              string="contractDefinitions.[id].fieldContractPolicyId"/></span>: <ContractDefinitionView.ContractPolicy.Id/>
          </li>
          <li className="mt-2">
            <div className="flex gap-x-5">

            <span className="font-bold"><T
              string="contractDefinitions.[id].fieldAssetSelector"/>: </span>
              <ContractDefinitionView.AssetsSelector>
                {({item}) => removeJsonLdSchemaFromProperties(item)?.map((constraint: any) =>
                  (constraint.operandRight || constraint.rightOperand || [])[0]["@value"] || ""
                )}
              </ContractDefinitionView.AssetsSelector>
            </div>
          </li>
        </ul>
      </ContractDefinitionView>
    </SideDrawer>
  );
}
