import {removeEmptyFields} from "@/utilities/form";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export type MdsContractDefinitionInput = ContractDefinitionInput & { privateProperties: { manualApproval: boolean } };

export const fromContractDefinitionForm = (formData: MdsContractDefinitionInput): MdsContractDefinitionInput => {
  const cleanFormDataObject = removeEmptyFields(formData);
  return cleanFormDataObject as MdsContractDefinitionInput
};

export const defaultCreateContractDefinitionFormData: MdsContractDefinitionInput = {
  "@id": "",
  accessPolicyId: "",
  contractPolicyId: "",
  assetsSelector: [],
  privateProperties: {
    manualApproval: false
  }
};
