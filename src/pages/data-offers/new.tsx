import React, {useEffect, useRef, useState} from "react";
import { enqueueSnackbar } from "notistack";
import {Button} from "@mui/material";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { ContractDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/contract-definition-form-wrapper";
import { useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { fromContractDefinitionForm, MdsContractDefinitionInput } from "@/utilities/contract-definition";
import { defaultCreateContractDefinitionFormData } from "@/utilities/contract-definition";
import {MuiSelect} from "@/components/atoms/mui-select";
import { Input } from "@/components/atoms/input";
import {Checkbox} from "@/components/atoms/checkbox";
import {idReader, idSelector} from "@/utilities/data-offer";

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

  const [formData, setFormData] = useState<MdsContractDefinitionInput>(defaultCreateContractDefinitionFormData);
  const validateForm = () => true ;

  const { translator } = useTranslator();

  const onChange = (newFormData: MdsContractDefinitionInput) => {
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
    <SideDrawer title={<T string="contractDefinitions.new.publishNewDataOffer" />} >
      <ContractDefinitionFormWrapper
        managementUrl={managementUrl}
        formData={() => fromContractDefinitionForm(formData)}
        onSuccess={() => push("/data-offers")}
        onFailure={onFormSubmitFail}
      >
        <div className="flex flex-col gap-y-5">
          <div>
            <Input
              required
              name="contract-definition-id"
              id="contract-definition-id"
              data-testid="contract-definition-id"
              label={translator("contractDefinitions.new.id")}
              value={formData["@id"]}
              onChange={(event) => onChange({...formData, ["@id"]: event.target.value})}
            />
          </div>
          <MuiSelect
            multiple
            required
            name="assets-selector"
            id="asset-id"
            data-testid="asset-id"
            label={translator("contractDefinitions.new.assets")}
            options={assetIds}
            value={idReader(formData.assetsSelector)}
            onChange={(event) => onChange({ ...formData, assetsSelector: idSelector(event.target.value)})}
          />

          <MuiSelect
            required
            name="contract-policy-id"
            id="contract-policy-id"
            data-testid="contract-policy-id"
            label={translator("contractDefinitions.new.contractPolicy")}
            options={policyIds}
            value={formData.contractPolicyId}
            onChange={(event) => onChange({ ...formData, contractPolicyId: event.target.value })}
          />

          <MuiSelect
            required
            name="access-policy-id"
            id="access-policy-id"
            data-testid="access-policy-id"
            label={translator("contractDefinitions.new.accessPolicy")}
            options={policyIds}
            value={formData.accessPolicyId}
            onChange={(event) => onChange({ ...formData, accessPolicyId: event.target.value })}
          />

          <Checkbox
            label={translator("contractDefinitions.new.manualApproval")}
            value={formData.privateProperties.manualApproval}
            onChange={(event) => {
              console.log("checkbox : ", {
                value: event.target.checked,
                manualApproval: formData.privateProperties.manualApproval,
                formData
              })
              onChange({ ...formData, privateProperties: { manualApproval: event.target.checked }})
            }}
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
