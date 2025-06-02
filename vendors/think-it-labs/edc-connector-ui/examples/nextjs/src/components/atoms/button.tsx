import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "unstyled";
}

export function Button({ children, className, variant, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        variant !== "unstyled" &&
          "py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border",
        variant === "primary" &&
          "font-semibold border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none",
        variant === "secondary" &&
          "font-medium border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}
