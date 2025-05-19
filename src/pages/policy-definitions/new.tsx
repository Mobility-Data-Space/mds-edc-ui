import { T, useTranslator } from "@/i18n";
import React, { useRef, useState } from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";


import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { PolicyDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/policy-definition-form-wrapper";
import { policyFormDataToSubmitData } from "@/utilities/policy";
import { CreatePolicyFormData, defaultCreatePolicyFormData, POLICY_PERMISSIONS } from "@/schema/policy";
import PolicyExpression from "@/components/organisms/policy-expression";

export default function CreatePolicyDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();
  const [formData, setFormData] = useState<CreatePolicyFormData>(defaultCreatePolicyFormData);
  const [errors, setErrors] = useState({ title: false, content: false });

  const validateForm = () => true ;
  const onChange = (newFormData: CreatePolicyFormData) => {
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

  if (!connector) {
    return "No connector";
  }
    
  return (
    <SideDrawer title={<T string="policyDefinitions.new.title" />}>
      <div>
        <div className="text-3xl">
          <span data-testid="policy-definition-create-modal-title">
            <T string="policyDefinition.new.title" />
          </span>
        </div>
  
        <PolicyDefinitionFormWrapper
          managementUrl={connector.managementUrl}
          formData={() => policyFormDataToSubmitData(formData)}
          onSuccess={() => push("/policy-definitions")}
          onFailure={onFormSubmitFail}
        >
          <div className="flex flex-col gap-y-6 p-5">
            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="dataOffer.new.policyExpression"/>
                  </label>
                  <PolicyExpression
                    value={formData.policy[POLICY_PERMISSIONS] as []}
                    onChange={(value) => {
                      console.log(formData);
                      formData.policy[POLICY_PERMISSIONS] = [...value] ;
                      console.log(formData);
                      onChange(formData);
                    }}
                  />
                </div>
              </div>
            </div>
  
            <div className="flex justify-end gap-x-2">
              <Button
                color="secondary"
                onClick={() => push("/policy-definitions")}
              >
                <T string="common.cancel" />
              </Button>
              <Button
                data-testid="policy-definition-create-submit"
                variant="contained"
                ref={submitButtonRef}
                onClick={onSubmit}
              >
                <T string="common.create" />
              </Button>
            </div>
          </div>
        </PolicyDefinitionFormWrapper>
      </div>
    </SideDrawer>
  );
}
