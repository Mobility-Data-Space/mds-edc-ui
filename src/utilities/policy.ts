import { POLICY_ID, CreatePolicyFormData, POLICY_PERMISSIONS } from "@/schema/policy";
import {removeEmptyFields} from "@/utilities/form.ts";

export const policyFormDataToSubmitData = (formData: CreatePolicyFormData) => {
  console.log(formData);
  formData.policy["@type"] = "Set" ;
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log(cleanFormDataObject);
  return {
    [POLICY_ID]: cleanFormDataObject.id,
    policy: cleanFormDataObject.policy
  };
};
