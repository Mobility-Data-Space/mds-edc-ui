import {AssetInput, IdResponse} from "@think-it-labs/edc-connector-client";
import React, {FormEvent, PropsWithChildren, useCallback} from "react";
import {useEdcConnectorClient} from "./hooks/use-edc-connector-client";

interface AssetFormProps {
  id?: string;
  managementUrl: string;
  getFormDataToSubmit: () => AssetInput,
  onSuccess?: (response: IdResponse) => void;
  onFailure?: (error: Error) => void;
}

export function AssetForm(
  { children, id: _id, getFormDataToSubmit, managementUrl, onSuccess, onFailure }: PropsWithChildren<
    AssetFormProps
  >,
) {
  const client = useEdcConnectorClient({
    management: managementUrl,
  });

  const action = useCallback(
    async (formData: AssetInput) => {
      try {
        const result = await client.management.assets.create(formData);
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
        return action(getFormDataToSubmit())
      }}
    >
      {children}
    </form>
  );
}
