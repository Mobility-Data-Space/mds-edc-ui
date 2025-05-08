import * as React from "react";
import {PropsWithChildren} from "react";

export function ShowTreeLeaf({hidden, disablePadding = false, children}: PropsWithChildren<{ hidden?: boolean, disablePadding?: boolean }>) {
  return (
    <div className={`${disablePadding ? "" : "py-2"} relative pl-0 w-full flex`}>
      {hidden ? "" : <span
        className={`mt-1 mb-0 mr-2.5 h-5 size-3 inline-block border-b-2 border-black`}
      />}
      <div className="flex-grow justify-center flex flex-col">
        {children}
      </div>
    </div>
  );
}
