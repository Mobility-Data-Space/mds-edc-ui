import {
  ContractDefinitionInput,
  IdResponse,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { FormWrapper } from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface ContractDefinitionFormWrapperProps {
  id?: string;
  managementUrl: string;
  formData: () => ContractDefinitionInput;
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function ContractDefinitionFormWrapper(
  { children, id: _id, managementUrl, formData, onFailure, onSuccess }: PropsWithChildren<
    ContractDefinitionFormWrapperProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const action = useCallback(
    async (input: ContractDefinitionInput) => {
      try {
        const result = await client.management.contractDefinitions.create(
          input,
        );
        onSuccess?.(result);
      } catch (error) {
        onFailure?.(error as any);
      }
    },
    [client, onFailure, onSuccess],
  );

  return (
    <FormWrapper<ContractDefinitionInput>
      action={action}
      formData={formData}
    >
      {children}
    </FormWrapper>
  );
}
