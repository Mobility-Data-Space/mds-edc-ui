import { HealthStatus } from "@think-it-labs/edc-connector-client";
import { Context, createContext, useContext } from "react";

export type ConnectorContext = Context<
  ConnectorContextType
>;

export type ConnectorContextType = {
  loading: {
    health: boolean;
    readiness: boolean;
    liveness: boolean;
    startup: boolean;
  };
  status: {
    health: HealthStatus | null;
    readiness: HealthStatus | null;
    liveness: HealthStatus | null;
    startup: HealthStatus | null;
  };
  errors: {
    health: Error | null;
    readiness: Error | null;
    liveness: Error | null;
    startup: Error | null;
  };
};

function createConnectorContext(): ConnectorContext {
  return createContext<ConnectorContextType | null>(null) as any;
}

export const ConnectorContext = createConnectorContext();

export function useConnectorContext(): ConnectorContextType {
  const context = useContext(
    ConnectorContext,
  ) as ConnectorContextType;

  if (!context) {
    throw new Error(
      "Components must be used within a <Connector />",
    );
  }

  return context;
}
