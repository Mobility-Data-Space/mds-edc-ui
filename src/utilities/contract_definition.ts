import { ACCESS_POLICY_ID, ASSETS_SELECTOR, CONTRACT_DEFINITION_ID, CONTRACT_POLICY_ID, CreateContractDefinitionFormData } from "@/schema/contract_definition";
import {removeEmptyFields} from "@/utilities/form.ts";

export const contractDefinitionFormDataToSubmitData = (formData: CreateContractDefinitionFormData) => {
  console.log(formData);
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log(cleanFormDataObject);
  return {
    [CONTRACT_DEFINITION_ID]: cleanFormDataObject[CONTRACT_DEFINITION_ID],
    accessPolicyId: cleanFormDataObject[ACCESS_POLICY_ID],
    contractPolicyId: cleanFormDataObject[CONTRACT_POLICY_ID],
    assetsSelector: [cleanFormDataObject[ASSETS_SELECTOR]],
  };
};
