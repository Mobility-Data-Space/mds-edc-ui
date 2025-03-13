import { PropsWithChildren, useMemo } from "react";

interface Props {
  variant?: string;
}

export function Indicator({ variant, children }: PropsWithChildren<Props>) {
  const color = useMemo(() => {
    switch (variant) {
      case "success": {
        return "bg-green-500";
      }
      case "danger": {
        return "bg-red-500";
      }
      case "warning": {
        return "bg-yellow-500";
      }
      default: {
        return "bg-gray";
      }
    }
  }, [variant]);

  return (
    <div className="inline-flex items-center">
      <span className={`size-2 inline-block rounded-full ${color}`} />
      <span className="text-gray-600 sr-only">
        {children}
      </span>
    </div>
  );
}
