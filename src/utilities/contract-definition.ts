import {removeEmptyFields} from "@/utilities/form";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export type MdsContractDefinitionInput = ContractDefinitionInput & { manualApproval: boolean };

export const fromContractDefinitionForm = (formData: MdsContractDefinitionInput): MdsContractDefinitionInput => {
  // DEBUG console.log(formData);
  const cleanFormDataObject = removeEmptyFields(formData);
  // DEBUG console.log(cleanFormDataObject);

  return cleanFormDataObject as MdsContractDefinitionInput
};

export const defaultCreateContractDefinitionFormData: MdsContractDefinitionInput = {
  "@id": "",
  accessPolicyId: "",
  contractPolicyId: "",
  assetsSelector: [],
  manualApproval: false,
};
