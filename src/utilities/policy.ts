import {removeEmptyFields} from "@/utilities/form.ts";
import { Constraint, Permission, PolicyBuilder, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";

export const fromPolicyDefinitionForm = (formData: Constraint[]) : PolicyDefinitionInput => {
  console.log(formData);
  const policy = new PolicyBuilder().type("Set").raw({
    permission: [
      {
        action: "use",
        constraint: formData
      }
    ]
  }).build() ;
  
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log(cleanFormDataObject);
  return {
    "@id": cleanFormDataObject.id,
    policy: policy
  };
};

const policy = new PolicyBuilder().type("Set").raw({
    permission: []
  }).build() ;

export const defaultCreatePolicyFormData: PolicyDefinitionInput = {
  "@id": "",
  policy: policy
};