import React, {useEffect, useRef, useState} from "react";
import { enqueueSnackbar } from "notistack";
import {Button} from "@mui/material";
import {ContractDefinitionInput, CriterionInput} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { ContractDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/contract-definition-form-wrapper";
import { useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { fromContractDefinitionForm } from "@/utilities/contract_definition";
import { defaultCreateContractDefinitionFormData } from "@/utilities/contract_definition";
import {MuiSelect} from "@/components/atoms/mui-select";
import {operatorIn} from "@/utilities/policy-constraints";
import { Input } from "@/components/atoms/input";

const optionsGenerator = (data: { "@id": string }[]) => {
  return data.map(entry => ({
    value: entry["@id"]
  }));
};

export default function CreateContractDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [assetIds, setAssetIds] = useState<{ value: string }[]>([]);
  const [policyIds, setPolicyIds] = useState<{ value: string }[]>([]);

  const edcClient = useEdcConnectorClient({management: connector.managementUrl});
  
  useEffect(() => {
    edcClient.management.assets.queryAll({ offset: 0 })
      .then(result => setAssetIds(optionsGenerator(result)))
      .catch(error => setAssetIds([]));

    edcClient.management.policyDefinitions.queryAll({ offset: 0 })
      .then(result => setPolicyIds(optionsGenerator(result)))
      .catch(error => setPolicyIds([]));
  }, []);

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
        operator: operatorIn.value,
        operandRight: id
      }
    ]
  };

  const idReader = (criteria: CriterionInput[]) => {
    return criteria[0]?.operandRight || "";
  }

  return (
    <SideDrawer title={<T string="contractDefinitions.new.title" />}>
      <ContractDefinitionFormWrapper
        managementUrl={managementUrl}
        formData={() => fromContractDefinitionForm(formData)}
        onSuccess={() => push("/data-offers")}
        onFailure={onFormSubmitFail}
      >   
        <div className="flex flex-col gap-y-5">
          <div>
            <label
              className="inline-block text-sm text-black font-medium mb-2"
            >
              <T string="policyDefinitions.new.policyId"/>
            </label>
            <Input
                  required
                  name="contract-definition-id"
                  id="contract-definition-id"
                  data-testid="contract-definition-id"
                  type="text"
                  placeholder="contract definition id"
                  value={formData["@id"]}
                  onChange={(event) => onChange({...formData, ["@id"]: event.target.value})}
                />
          </div>
          <MuiSelect
            multiple
            name="assets-selector"
            id="asset-id"
            data-testid="asset-id"
            type="text"
            placeholder="asset id"
            options={assetIds}
            value={idReader(formData.assetsSelector)}
            onChange={(event) => onChange({ ...formData, assetsSelector: idSelector(event.target.value)})}
          />

          <MuiSelect
            name="contract-policy-id"
            id="contract-policy-id"
            data-testid="contract-policy-id"
            type="text"
            placeholder="contract-policy-id"
            options={policyIds}
            value={formData.contractPolicyId}
            onChange={(event) => onChange({ ...formData, contractPolicyId: event.target.value })}
          />

          <MuiSelect
            name="access-policy-id"
            id="access-policy-id"
            data-testid="access-policy-id"
            type="text"
            placeholder="access-policy-id"
            options={policyIds}
            value={formData.accessPolicyId}
            onChange={(event) => onChange({ ...formData, accessPolicyId: event.target.value })}
          />

          <div className="flex flex-row self-end gap-x-5">
            <Button
              color="secondary"
              onClick={() => push("/data-offers")}
            >
              <T string="common.cancel" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={onSubmit}
            >
              <T string="common.create" />
            </Button>
          </div>
        </div>
      </ContractDefinitionFormWrapper>
    </SideDrawer>
  );
}
