import {removeEmptyFields} from "@/utilities/form.ts";
import { ContractDefinitionInput } from "@think-it-labs/edc-connector-client";

export const fromContractDefinitionForm = (formData: ContractDefinitionInput): ContractDefinitionInput => {
  console.log(formData);
  const cleanFormDataObject = removeEmptyFields(formData);
  console.log(cleanFormDataObject);
  return {
    ["@id"]: cleanFormDataObject["@id"],
    accessPolicyId: cleanFormDataObject.accessPolicyId,
    contractPolicyId: cleanFormDataObject.contractPolicyId,
    assetsSelector: cleanFormDataObject.assetsSelector,
  };
};

export const defaultCreateContractDefinitionFormData: ContractDefinitionInput = {
  "@id": "",
  accessPolicyId: "",
  contractPolicyId: "",
  assetsSelector: [],
};