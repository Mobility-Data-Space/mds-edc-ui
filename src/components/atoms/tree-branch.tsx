import * as React from "react";
import { PropsWithChildren } from "react";

export function TreeBranch({
  hidden = false,
  children,
}: PropsWithChildren<{ hidden?: boolean }> & {
  disableLine?: boolean;
}) {
  return (
    <div className={hidden ? "" : "ml-6 border-l-2 border-black w-full pr-6"}>
      {children}
      {hidden ? (
        ""
      ) : (
        <div
          className="border-solid border-0 border-black border-t-2 w-[1rem] mr-[1rem] bg-white mb-3.5"
          style={{
            marginTop: "calc(-2rem - 2px)",
            marginRight: "calc(0.5rem + 2px)",
          }}
        />
      )}
    </div>
  );
}
