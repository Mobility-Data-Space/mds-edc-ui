import {
  ErrorMessage,
  Field,
  FieldValidator,
  Form as FormikForm,
  Formik,
} from "formik";
import React, { PropsWithChildren, useCallback } from "react";

interface FormProps<I> {
  action: (input: I) => Promise<void>;
  initialValues: I;
}

export function Form<I extends Record<string, any>>(
  { children, action, initialValues }: PropsWithChildren<
    FormProps<I>
  >,
) {
  const handleSubmit = useCallback(
    (input: I) => action(input),
    [action],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {() => (
        <FormikForm>
          {children}
        </FormikForm>
      )}
    </Formik>
  );
}

export interface FormInputProps {
  name: string;
  id?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  validator?: FieldValidator;
}

Form.Input = function FormInput(
  { name, ...rest }: FormInputProps,
) {
  return <Field name={name} {...rest} />;
};

export interface FormTextareaProps extends Omit<FormInputProps, "type"> {
  rows?: number;
}

Form.Textarea = function FormTextarea(
  { name, ...rest }: FormInputProps,
) {
  return <Field as="textarea" name={name} {...rest} />;
};

export interface FormSelectProps extends Omit<FormInputProps, "type"> {
  options: { value: string; text?: string }[];
}

Form.Select = function FormSelect(
  { name, options, ...rest }: FormSelectProps,
) {
  return (
    <Field as="select" name={name} {...rest}>
      {options.map(({ value, text = value }) => (
        <option key={`${text}:${value}`} value={value}>{text}</option>
      ))}
    </Field>
  );
};

Form.Error = ErrorMessage;
