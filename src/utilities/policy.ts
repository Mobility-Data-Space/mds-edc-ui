import {removeEmptyFields} from "@/utilities/form";
import { Constraint, PolicyBuilder, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";

const defaultPolicy = new PolicyBuilder().type("Set").raw({
    permission: [],
    obligation: [],
    prohibition: []
  }).build() ;

export const defaultCreatePolicyFormData: PolicyDefinitionInput = {
  "@id": "",
  policy: defaultPolicy
};

export const fromPolicyDefinitionForm = (formData: Constraint[], id:string) : PolicyDefinitionInput => {
  // DEBUG console.log(formData);
  const policy = new PolicyBuilder().type("Set").raw({
    permission: [
      {
        action: "use",
        constraint: formData
      }
    ],
    obligation: [],
    prohibition: []
  }).build() ;
  
  const cleanFormDataObject = removeEmptyFields(formData);
  
  // DEBUG console.log(cleanFormDataObject);
  return {
    "@id": id,
    policy: policy
  };
};
