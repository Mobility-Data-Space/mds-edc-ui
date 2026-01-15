import clsx from "clsx";
import React, { PropsWithChildren, SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { text: string; value: string }[];
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  unstyled?: boolean;
  value?: string;
}

export function Select({
  options,
  onChange,
  className,
  unstyled = false,
  value,
  ...rest
}: PropsWithChildren<Props>): React.ReactElement {
  return (
    <select
      className={clsx(
        "placeholder:text-edc-subtitle bg-transparent text-sm",
        unstyled && "p-0 border-0 rounded-none pr-6",
        !unstyled &&
        "px-3 py-3 pr-9 border border-edc-border rounded-md text-sm",
        className,
      )}
      onChange={onChange}
      {...rest}
    >
      {options.map((option, index) => (
        <option
          selected={value === option.value}
          key={index}
          value={option.value}
          label={option.text}
        >
          {option.text}
        </option>
      ))}
    </select>
  );
}
