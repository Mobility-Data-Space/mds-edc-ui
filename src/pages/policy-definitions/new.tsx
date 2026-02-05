import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { PolicyDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/policy-definition-form-wrapper";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { fromPolicyDefinitionForm } from "@/utilities/policy";
import PolicyExpression from "@/components/organisms/policy-expression";
import { MultiplicityConstraint } from "@/utilities/policy-constraints";
import { Input } from "@/components/atoms/input";
import { proxyConnectorManagement } from "@/constants/proxy";
import { Snackbar } from "@/components/molecules/snackbar";
import { useSnackbar } from "notistack";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";

export default function CreatePolicyDefinitionPage() {
  const { push, connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { showSnackbar }  = useAppSnackbar();

  const { translator } = useTranslator();

  const [formData, setFormData] = useState<
    (AtomicConstraint | MultiplicityConstraint)[]
  >([]);
  const [policyId, setPolicyId] = useState("");
  const [policyExpression, setPolicyExpression] = useState<
    (AtomicConstraint | MultiplicityConstraint)[]
  >([]);

  const validateForm = () => true;
  const onChange = (
    newFormData: (AtomicConstraint | MultiplicityConstraint)[],
    policyId: string,
  ) => {
    setFormData([...newFormData]);
    setPolicyExpression([...newFormData]);
    setPolicyId(policyId);
  };
  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    const match = /"message":"(.*?)"/.exec(error.message);

    showSnackbar({
      type: 'error',
      message:  (match && match[1]) || translator("policyDefinition.new.saveFail"),
      persist: true
    })
  };

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="policyDefinitions.new.title" />}>
      <div>
        <PolicyDefinitionFormWrapper
          managementUrl={proxyConnectorManagement}
          formData={() => fromPolicyDefinitionForm(formData, policyId)}
          onSuccess={() => {

            showSnackbar({
              type: "success",
              message: translator("policyDefinitions.new.successCreate"),
              persist: true
            })
            window.dispatchEvent(new Event("policy-definitions-list-refetch"));
            setTimeout(() => push("/policy-definitions"), 4_000);
          }}
          onFailure={onFormSubmitFail}
        >
          <div className="flex flex-col gap-y-6 p-5">
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-6">
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label className="inline-block text-sm text-black font-medium mb-2">
                    <T string="policyDefinitions.new.policyId" />
                  </label>
                  <Input
                    required
                    name="policy-id"
                    id="policy-id"
                    data-testid="policy-id-input"
                    type="text"
                    placeholder={translator("policyDefinitions.new.policyId")}
                    value={policyId}
                    onChange={(event) => onChange(formData, event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-6">
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label className="inline-block text-sm text-black font-medium mb-4">
                    <T string="policyDefinitions.new.policyExpression" />
                  </label>
                  <PolicyExpression
                    value={policyExpression}
                    onChange={(value) => {
                      onChange(value, policyId);
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
