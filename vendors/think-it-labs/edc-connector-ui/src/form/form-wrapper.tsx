import React, { FormEvent, PropsWithChildren, useCallback } from "react";

interface FormProps<I> {
  action: (input: I) => Promise<void>;
  formData: () => I;
}

export function FormWrapper<I extends Record<string, any>>(
  { children, action, formData }: PropsWithChildren<
    FormProps<I>
  >,
) {
  const handleSubmit = useCallback(
    (input: I) => action(input),
    [action],
  );

  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        return handleSubmit(formData())
      }}
    >
      {children}
    </form>
  );
}

