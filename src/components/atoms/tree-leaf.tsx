import * as React from "react";
import { PropsWithChildren } from "react";

export function TreeLeaf({
  hidden,
  children,
}: PropsWithChildren<{ hidden?: boolean }>) {
  return (
    <div className="py-2 pl-0 w-full flex">
      <span
        className={`mt-1 mb-0.5 mr-2.5 h-5 size-3 inline-block ${!hidden && "border-b-2 border-black"}`}
      />

      <div className="flex-grow">{children}</div>
    </div>
  );
}
