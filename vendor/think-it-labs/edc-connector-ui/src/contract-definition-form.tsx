import {
  ContractDefinitionInput,
  IdResponse,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import { Form, FormInputProps } from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface ContractDefinitionFormProps {
  id?: string;
  managementUrl: string;
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function ContractDefinitionForm(
  { children, id: _id, managementUrl, onFailure, onSuccess }: PropsWithChildren<
    ContractDefinitionFormProps
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
    <Form<ContractDefinitionInput>
      action={action}
      initialValues={{
        accessPolicyId: "",
        contractPolicyId: "",
        assetsSelector: [],
      }}
    >
      {children}
    </Form>
  );
}

ContractDefinitionForm.Id = function AssetFormDataAddressId(
  props: Omit<FormInputProps, "name">,
) {
  return <Form.Input name="@id" {...props} />;
};

ContractDefinitionForm.AccessPolicyId = function AssetFormDataAddressId(
  props: Omit<FormInputProps, "name">,
) {
  return <Form.Input name="accessPolicyId" {...props} />;
};

ContractDefinitionForm.ContractPolicyId = function AssetFormDataAddressId(
  props: Omit<FormInputProps, "name">,
) {
  return <Form.Input name="contractPolicyId" {...props} />;
};
