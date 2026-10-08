import { removeEmptyFields } from "@/utilities/form";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export type MdsContractDefinitionInput = ContractDefinitionInput & {
  privateProperties: { manualApproval: boolean };
};

export const fromContractDefinitionForm = (
  formData: MdsContractDefinitionInput,
): MdsContractDefinitionInput => {
  const cleanFormDataObject = removeEmptyFields(formData);
  // Management v4 rejects create bodies without an explicit @type.
  return {
    "@type": "ContractDefinition",
    ...cleanFormDataObject,
  } as MdsContractDefinitionInput;
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

