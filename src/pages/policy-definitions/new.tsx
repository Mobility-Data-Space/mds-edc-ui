import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { PolicyDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/policy-definition-form-wrapper";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { fromPolicyDefinitionForm } from "@/utilities/policy";
import PolicyExpression from "@/components/organisms/policy-expression";
import { MultiplicityConstraint } from "@/utilities/policy-constraints";
import { Input } from "@/components/atoms/input";

export default function CreatePolicyDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();

  const [formData, setFormData] = useState<(AtomicConstraint|MultiplicityConstraint)[]>([]);
  const [policyId, setPolicyId] = useState("") ;
  const [policyExpression, setPolicyExpression] = useState<(AtomicConstraint|MultiplicityConstraint)[]>([]);

  const validateForm = () => true ;
  const onChange = (newFormData: (AtomicConstraint|MultiplicityConstraint)[], policyId:string) => {
    console.log(newFormData)
    setFormData([ ...newFormData ]);
    setPolicyExpression([ ...newFormData ]);
    setPolicyId(policyId);
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
        <PolicyDefinitionFormWrapper
          managementUrl={connector.managementUrl}
          formData={() => fromPolicyDefinitionForm(formData, policyId)}
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
                    <T string="policyDefinitions.new.policyId"/>
                  </label>
                  <Input
                        required
                        name="policy-id"
                        id="policy-id"
                        data-testid="policy-id"
                        type="text"
                        placeholder={translator("policyDefinitions.new.policyId")}
                        value={policyId}
                        onChange={(event) => onChange(formData, event.target.value)}
                      />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="policyDefinitions.new.policyExpression"/>
                  </label>
                  <PolicyExpression
                    value={policyExpression}
                    onChange={(value) => { onChange(value, policyId) }}
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
