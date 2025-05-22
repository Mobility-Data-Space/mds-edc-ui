import {
  IdResponse,
  PolicyDefinitionInput,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import {
  FormWrapper
} from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface PolicyDefinitionFormWrapperProps {
  id?: string;
  managementUrl: string;
  formData: () => PolicyDefinitionInput
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function PolicyDefinitionFormWrapper(
  { children, id: _id, managementUrl, formData, onFailure, onSuccess }: PropsWithChildren<
    PolicyDefinitionFormWrapperProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const action = useCallback(
    async (input: PolicyDefinitionInput) => {
      try {
        const result = await client.management.policyDefinitions.create(input);
        onSuccess?.(result);
      } catch (error) {
        onFailure?.(error as any);
      }
    },
    [client, onFailure, onSuccess],
  );

  return (
    <FormWrapper<PolicyDefinitionInput>
      action={action}
      formData={formData}
    >
      {children}
    </FormWrapper>
  );
}
