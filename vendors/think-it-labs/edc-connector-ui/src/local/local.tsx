import React, { PropsWithChildren } from "react";
import { LocalContext } from "./local-context";

export interface LocalProps<T> {
  item?: T | null;
  delete?: () => Promise<void>;
}

export function Local<T>({
  children,
  item = null,
  delete: del = async () => {
    console.warn("delete method not defined");
  },
}: PropsWithChildren<LocalProps<T>>) {
  return (
    <LocalContext.Provider
      value={{
        item,
        deleteItem: del,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}
