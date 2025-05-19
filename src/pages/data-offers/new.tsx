import { Button } from "@/components/atoms/button";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";

import { enqueueSnackbar } from "notistack";
import { T, useTranslator } from "@/i18n";

import React, { useRef, useState } from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { ContractDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/contract-definition-form-wrapper";
import { contractDefinitionFormDataToSubmitData } from "@/utilities/contract_definition";
import { ASSETS_SELECTOR, ACCESS_POLICY_ID, CONTRACT_POLICY_ID, CreateContractDefinitionFormData, defaultCreateContractDefinitionFormData } from "@/schema/contract_definition";
import { Input } from "@/components/atoms/input";

export default function CreateContractDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<CreateContractDefinitionFormData>(defaultCreateContractDefinitionFormData);
  const validateForm = () => true ;

  const { translator } = useTranslator();

  const onChange = (newFormData: CreateContractDefinitionFormData) => {
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

  return (
    <SideDrawer title={<T string="contractDefinitions.new.title" />}>
      <ContractDefinitionFormWrapper 
        managementUrl={managementUrl}
        formData={() => contractDefinitionFormDataToSubmitData(formData)}
        onSuccess={() => push("/data-offers")}
        onFailure={onFormSubmitFail}>
          <Input
            required
            name={ASSETS_SELECTOR}
            id="asset-id"
            data-testid="asset-id"
            type="text"
            placeholder="asset id"
            value={formData[ASSETS_SELECTOR]}
            onChange={(event) => onChange({ ...formData, [ASSETS_SELECTOR]: [event.target.value] })}
          />

          <Input
            required
            name={CONTRACT_POLICY_ID}
            id="contract-policy-id"
            data-testid="contract-policy-id"
            type="text"
            placeholder="contract-policy-id"
            value={formData[CONTRACT_POLICY_ID]}
            onChange={(event) => onChange({ ...formData, [CONTRACT_POLICY_ID]: event.target.value })}
          />

          <Input
            required
            name={ACCESS_POLICY_ID}
            id="access-policy-id"
            data-testid="access-policy-id"
            type="text"
            placeholder="access-policy-id"
            value={formData[ACCESS_POLICY_ID]}
            onChange={(event) => onChange({ ...formData, [ACCESS_POLICY_ID]: event.target.value })}
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
