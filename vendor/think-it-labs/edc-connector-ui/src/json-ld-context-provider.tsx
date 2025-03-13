import React, { createContext, PropsWithChildren, useContext } from "react";

const JsonLdContextContext = createContext({} as Record<string, string>);

interface Props {
  additionalJsonLdContext: Record<string, string>;
}

export function useJsonLdContext() {
  const context = useContext(JsonLdContextContext);
  return context || {};
}

export function JsonLdContextProvider(
  { additionalJsonLdContext, children }: PropsWithChildren<Props>,
) {
  return (
    <JsonLdContextContext.Provider value={additionalJsonLdContext}>
      {children}
    </JsonLdContextContext.Provider>
  );
}
