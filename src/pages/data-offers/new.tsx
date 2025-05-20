import { Button } from "@/components/atoms/button";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";

import { enqueueSnackbar } from "notistack";
import { T, useTranslator } from "@/i18n";

import React, { useRef, useState } from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { ContractDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/contract-definition-form-wrapper";
import { fromContractDefinitionForm } from "@/utilities/contract_definition";
import { Input } from "@/components/atoms/input";
import { ContractDefinitionInput, CriterionInput } from "@think-it-labs/edc-connector-client";
import { defaultCreateContractDefinitionFormData } from "@/utilities/contract_definition";

export default function CreateContractDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<ContractDefinitionInput>(defaultCreateContractDefinitionFormData);
  const validateForm = () => true ;

  const { translator } = useTranslator();

  const onChange = (newFormData: ContractDefinitionInput) => {
    setFormData({ ...newFormData });
  }
  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    enqueueSnackbar(translator("policyDefinition.new.saveFail"));
  };

  const idSelector = (id: string): CriterionInput[] => {
    return [
      {
        operandLeft: "@id",
        operator: "=",
        operandRight: id
      }
    ]
  }

  return (
    <SideDrawer title={<T string="contractDefinitions.new.title" />}>
      <ContractDefinitionFormWrapper 
        managementUrl={managementUrl}
        formData={() => fromContractDefinitionForm(formData)}
        onSuccess={() => push("/data-offers")}
        onFailure={onFormSubmitFail}>
          <Input
            required
            name="assets-selector"
            id="asset-id"
            data-testid="asset-id"
            type="text"
            placeholder="asset id"
            value={formData.assetsSelector}
            onChange={(event) => onChange({ ...formData, assetsSelector: idSelector(event.target.value)})}
          />

          <Input
            required
            name="contract-policy-id"
            id="contract-policy-id"
            data-testid="contract-policy-id"
            type="text"
            placeholder="contract-policy-id"
            value={formData.contractPolicyId}
            onChange={(event) => onChange({ ...formData, contractPolicyId: event.target.value })}
          />

          <Input
            required
            name="contract-policy-id"
            id="access-policy-id"
            data-testid="access-policy-id"
            type="text"
            placeholder="access-policy-id"
            value={formData.accessPolicyId}
            onChange={(event) => onChange({ ...formData, accessPolicyId: event.target.value })}
          />
          <Button
            variant="secondary"
            onClick={() => push("/data-offers")}
          >
            <T string="buttonCancel" />
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={onSubmit}
          >
            <T string="buttonSave" />
          </Button>
      </ContractDefinitionFormWrapper>
    </SideDrawer>
  );
}
