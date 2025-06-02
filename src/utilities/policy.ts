import { Constraint, PolicyBuilder, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";

const defaultPolicy = new PolicyBuilder().type("Set").raw({
  permission: [],
  obligation: [],
  prohibition: []
}).build() ;

export const defaultCreatePolicyFormData: PolicyDefinitionInput = {
  policy: defaultPolicy
};

export const fromPolicyDefinitionForm = (formData: Constraint[], id:string) : PolicyDefinitionInput => {
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

  const policyDefinition: PolicyDefinitionInput = {
    policy: policy
  };

  if(id && id !== "")
    policyDefinition["@id"] = id

  return policyDefinition;
};
