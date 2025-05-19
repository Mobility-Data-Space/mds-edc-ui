export const CONTRACT_DEFINITION_ID = "@id"
export const ACCESS_POLICY_ID = "https://w3id.org/edc/v0.0.1/ns/accessPolicyId"
export const CONTRACT_POLICY_ID = "https://w3id.org/edc/v0.0.1/ns/contractPolicyId"
export const ASSETS_SELECTOR = "https://w3id.org/edc/v0.0.1/ns/assetsSelector"

export const defaultCreateContractDefinitionFormData = {
  [CONTRACT_DEFINITION_ID]: "",
  [ACCESS_POLICY_ID]: "",
  [CONTRACT_POLICY_ID]: "",
  [ASSETS_SELECTOR]: [""],
};

export type CreateContractDefinitionFormData = typeof defaultCreateContractDefinitionFormData;