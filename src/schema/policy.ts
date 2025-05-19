export const POLICY_ID = "@id"
export const POLICY_PERMISSIONS = "permission"
export const POLICY_OBLIGATIONS = "obligation"
export const POLICY_PROHIBITIONS = "prohibition"
export const POLICY_ASSIGNER = "http://www.w3.org/ns/odrl/2/assigner";
export const POLICY_TARGET = "http://www.w3.org/ns/odrl/2/target";


export const defaultCreatePolicyFormData = {
  [POLICY_ID]: "",
  policy: {
    "@context": "http://www.w3.org/ns/odrl.jsonld",
    "@type": "",
    [POLICY_PERMISSIONS]: [] as any,
    [POLICY_OBLIGATIONS]: [] as any,
    [POLICY_PROHIBITIONS]: [] as any,
  }
};

export type CreatePolicyFormData = typeof defaultCreatePolicyFormData;
