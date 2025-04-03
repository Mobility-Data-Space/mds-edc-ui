import { AssetInput, IdResponse } from "@think-it-labs/edc-connector-client";
import React, {FormEvent} from "react";
import { PropsWithChildren, useCallback } from "react";
import { useEdcConnectorClient } from "./hooks/use-edc-connector-client";

interface AssetFormProps {
  id?: string;
  managementUrl: string;
  formData: AssetInput,
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

// TODO: move to another place
const cleanFormData = (formData: { [key: string]: any }) => {
  const newFormData: { [key: string]: any } = {};
  for (const key in formData) {
    if (typeof formData[key] === "boolean") {
      newFormData[key] = "" + formData[key];
      continue;
    }

    if ((Array.isArray(formData[key]))) {
      if (formData[key].length > 0) {
        newFormData[key] = formData[key];
      }
      continue;
    }

    if (typeof formData[key] === "object") {
      newFormData[key] = cleanFormData(formData[key]);
      continue;
    }

    if (formData[key]) {
      newFormData[key] = formData[key];
      continue;
    }
  }
  return newFormData;
};

export function AssetForm(
  { children, id: _id, formData, managementUrl, onSuccess, onFailure }: PropsWithChildren<
    AssetFormProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const action = useCallback(
    async (formData: AssetInput) => {
      const cleanFormDataObject = cleanFormData(formData);
      const formDataToSubmit = { "@id": cleanFormDataObject.properties["@id"], properties: { ...cleanFormDataObject.properties, ...cleanFormDataObject.advancedInfo }, dataAddress: cleanFormDataObject.dataAddress };

      try {
        const result = await client.management.assets.create(formDataToSubmit);
        onSuccess?.(result);
      } catch (error: any) {
        const badRequestPrefix = 'request was malformed: ';
        if (0 === error.message.indexOf(badRequestPrefix)) {
          error.stack = JSON.parse(error.message.replace(badRequestPrefix, ''));
        }
        onFailure?.(error);
      }
    },
    [client],
  );

  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        return action(formData)
      }}
    >
      {children}
    </form>
  );
}
