import {removeEmptyFields} from "@/utilities/form";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export const fromContractDefinitionForm = (formData: ContractDefinitionInput): ContractDefinitionInput => {
  // DEBUG console.log(formData);
  const cleanFormDataObject = removeEmptyFields(formData);
  // DEBUG console.log(cleanFormDataObject);

  return cleanFormDataObject as ContractDefinitionInput
};

export const defaultCreateContractDefinitionFormData: ContractDefinitionInput = {
  "@id": "",
  accessPolicyId: "",
  contractPolicyId: "",
  assetsSelector: [],
};
