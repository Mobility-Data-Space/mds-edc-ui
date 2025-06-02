import {
  IdResponse,
  PolicyDefinitionInput,
} from "@think-it-labs/edc-connector-client";
import React, { PropsWithChildren, useCallback } from "react";
import {
  Form,
  FormInputProps,
  FormSelectProps,
  FormTextareaProps,
} from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface ContractDefinitionFormProps {
  id?: string;
  managementUrl: string;
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function PolicyDefinitionForm(
  { children, id: _id, managementUrl, onFailure, onSuccess }: PropsWithChildren<
    ContractDefinitionFormProps
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
    <Form<PolicyDefinitionInput>
      action={action}
      initialValues={{
        policy: {} as any,
      }}
    >
      {children}
    </Form>
  );
}

PolicyDefinitionForm.Id = function PolicyDefinitionId(
  props: Omit<FormInputProps, "name">,
) {
  return <Form.Input name="@id" {...props} />;
};

PolicyDefinitionForm.Policy = {
  Input: function PolicyDefinitionInput(
    { name, ...rest }: FormInputProps,
  ) {
    return <Form.Input {...rest} name={`policy.${name}`} />;
  },
  Textarea: function PolicyDefinitionTextarea(
    { name, ...rest }: FormTextareaProps,
  ) {
    return <Form.Textarea {...rest} name={`policy.${name}`} />;
  },
  Select: function PolicyDefinitionSelect(
    { name, ...rest }: FormSelectProps,
  ) {
    return <Form.Select {...rest} name={`policy.${name}`} />;
  },
};
