import { AssetInput, IdResponse } from "@think-it-labs/edc-connector-client";
import React from "react";
import { PropsWithChildren, useCallback } from "react";
import {
  Form,
  FormInputProps,
  FormSelectProps,
  FormTextareaProps,
} from "./form";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface AssetFormProps {
  id?: string;
  managementUrl: string;
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function AssetForm(
  { children, id: _id, managementUrl, onSuccess, onFailure }: PropsWithChildren<
    AssetFormProps
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
    <Form<AssetInput>
      action={action}
      initialValues={{
        properties: {
          language: "https://w3id.org/idsa/code/EN", // TODO: move to a better place
        },
        dataAddress: {
          type: "HttpData",
        },
      }}
    >
      {children}
    </Form>
  );
}

AssetForm.Id = function AssetFormDataAddressId(
  props: Omit<FormInputProps, "name">,
) {
  return <Form.Input name="@id" {...props} />;
};

AssetForm.DataAddress = {
  Input: function AssetFormDataAddressInput(
    { name, ...rest }: FormInputProps,
  ) {
    return <Form.Input {...rest} name={`dataAddress.${name}`} />;
  },
  Textarea: function AssetFormDataAddressTextarea(
    { name, ...rest }: FormTextareaProps,
  ) {
    return <Form.Textarea {...rest} name={`dataAddress.${name}`} />;
  },
  Select: function AssetFormDataAddressSelect(
    { name, ...rest }: FormSelectProps,
  ) {
    return <Form.Select {...rest} name={`dataAddress.${name}`} />;
  },
};

AssetForm.Properties = {
  Input: function AssetFormPropertiesInput(
    { name, ...rest }: FormInputProps,
  ) {
    return <Form.Input {...rest} name={`properties.${name}`} />;
  },
  Textarea: function AssetFormPropertiesTextarea(
    { name, ...rest }: FormTextareaProps,
  ) {
    return <Form.Textarea {...rest} name={`properties.${name}`} />;
  },
  Select: function AssetFormPropertiesSelect(
    { name, ...rest }: FormSelectProps,
  ) {
    return <Form.Select {...rest} name={`properties.${name}`} />;
  },
};

AssetForm.PrivateProperties = {
  Input: function AssetFormPrivatePropertiesInput(
    { name, ...rest }: FormInputProps,
  ) {
    return <Form.Input {...rest} name={`privateProperties.${name}`} />;
  },
  Textarea: function AssetFormPrivatePropertiesTextarea(
    { name, ...rest }: FormTextareaProps,
  ) {
    return <Form.Textarea {...rest} name={`privateProperties.${name}`} />;
  },
  Select: function AssetFormPrivatePropertiesSelect(
    { name, ...rest }: FormSelectProps,
  ) {
    return <Form.Select {...rest} name={`privateProperties.${name}`} />;
  },
};
