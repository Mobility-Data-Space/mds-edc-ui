import { AssetInput, IdResponse } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback } from "react";
import {
  FormWrapper
} from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface AssetFormWrapperProps {
  id?: string;
  managementUrl: string;
  formData: () => AssetInput;
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function AssetFormWrapper(
  { children, id: _id, managementUrl, formData, onSuccess, onFailure }: PropsWithChildren<
    AssetFormWrapperProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const action = useCallback(
    async (input: AssetInput) => {
      try {
        const result = await client.management.assets.create(input);
        onSuccess?.(result);
      } catch (error) {
        onFailure?.(error as any);
      }
    },
    [client],
  );

  return (
    <FormWrapper<AssetInput>
      action={action}
      formData={formData}
    >
      {children}
    </FormWrapper>
  );
}
