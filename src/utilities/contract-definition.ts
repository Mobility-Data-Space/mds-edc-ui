import { removeEmptyFields } from "@/utilities/form";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export type MdsContractDefinitionInput = ContractDefinitionInput & {
  privateProperties: { manualApproval: boolean };
};

export const fromContractDefinitionForm = (
  formData: MdsContractDefinitionInput,
): MdsContractDefinitionInput => {
  console.log("before cleanup:", formData);
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log("after cleanup:", formData);
  return cleanFormDataObject as MdsContractDefinitionInput;
};

export const defaultCreateContractDefinitionFormData: MdsContractDefinitionInput =
  {
    "@id": "",
    accessPolicyId: "",
    contractPolicyId: "",
    assetsSelector: [],
    privateProperties: {
      manualApproval: false,
    },
  };

export const createDefaultContractDefinitionFormData = (
  id: string,
): MdsContractDefinitionInput => ({
  ...defaultCreateContractDefinitionFormData,
  "@id": id,
});
