import { Constraint, PolicyBuilder, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";

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
    // Management v4 rejects create bodies without an explicit @type.
    "@type": "PolicyDefinition",
    policy: policy
  };

  if(id && id !== "")
    policyDefinition["@id"] = id

  return policyDefinition;
};
