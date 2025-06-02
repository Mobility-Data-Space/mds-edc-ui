import { HealthStatus } from "@think-it-labs/edc-connector-client";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useEdcConnectorClient } from "../hooks/use-edc-connector-client";
import { ConnectorContext, useConnectorContext } from "./connector-context";

interface ConnectorProps {
  defaultUrl: string;
}

interface UseStatusHookOptions {
  check: () => Promise<HealthStatus>;
  interval?: number;
}

function useStatusHook({
  check,
  interval: intervalValue = 30000,
}: UseStatusHookOptions): [
  HealthStatus | null,
  boolean,
  Error | null,
] {
  const [healthStatus, setHealthStatus_] = useState<HealthStatus | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const setHealthStatus = useCallback(
    (value: HealthStatus) => setHealthStatus_(value),
    [],
  );
  useEffect(() => {
    check().then(setHealthStatus);

    const interval = setInterval(async () => {
      try {
        setLoading(true);
        const healthStatus = await check();
        setHealthStatus(healthStatus);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }, intervalValue);
    return () => {
      clearInterval(interval);
    };
  }, [check, intervalValue, setHealthStatus]);

  return [
    healthStatus,
    isLoading,
    error,
  ];
}

export function Connector(
  { defaultUrl, children }: PropsWithChildren<ConnectorProps>,
) {
  const client = useEdcConnectorClient({
    default: defaultUrl,
  });

  const checkReadiness = useCallback(
    () => client.observability.checkReadiness(),
    [client],
  );
  const [
    healthStatusReadiness,
    isLoadingReadiness,
    errorReadiness,
  ] = useStatusHook({
    check: checkReadiness,
  });

  const checkLiveness = useCallback(
    () => client.observability.checkLiveness(),
    [client],
  );
  const [
    healthStatusLiveness,
    isLoadingLiveness,
    errorLiveness,
  ] = useStatusHook({
    check: checkLiveness,
  });

  const checkStartup = useCallback(
    () => client.observability.checkStartup(),
    [client],
  );
  const [
    healthStatusStartup,
    isLoadingStartup,
    errorStartup,
  ] = useStatusHook({
    check: checkStartup,
  });

  const checkHealth = useCallback(
    () => client.observability.checkHealth(),
    [client],
  );
  const [
    healthStatusHealth,
    isLoadingHealth,
    errorHealth,
  ] = useStatusHook({
    check: checkHealth,
  });

  return (
    <ConnectorContext.Provider
      value={{
        loading: {
          health: isLoadingHealth,
          readiness: isLoadingReadiness,
          liveness: isLoadingLiveness,
          startup: isLoadingStartup,
        },
        status: {
          health: healthStatusHealth,
          readiness: healthStatusReadiness,
          liveness: healthStatusLiveness,
          startup: healthStatusStartup,
        },
        errors: {
          health: errorHealth,
          readiness: errorReadiness,
          liveness: errorLiveness,
          startup: errorStartup,
        },
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
}

export interface ConnectorStatusChildProps {
  status: HealthStatus | null;
  isLoading: boolean;
  error: Error | null;
}

interface ConnectorStatusProps {
  children: (props: ConnectorStatusChildProps) => JSX.Element;
}

Connector.Health = function ConnectorHealth({
  children,
}: ConnectorStatusProps) {
  const { errors, loading, status } = useConnectorContext();

  const Status = useMemo(() => {
    return function Item(props: ConnectorStatusChildProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return (
    <Status
      status={status.health}
      error={errors.health}
      isLoading={loading.health}
    />
  );
};

Connector.Liveness = function ConnectorLiveness(
  { children }: ConnectorStatusProps,
) {
  const { errors, loading, status } = useConnectorContext();

  const Status = useMemo(() => {
    return function Item(props: ConnectorStatusChildProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return (
    <Status
      status={status.liveness}
      error={errors.liveness}
      isLoading={loading.liveness}
    />
  );
};

Connector.Readiness = function ConnectorReadiness(
  { children }: ConnectorStatusProps,
) {
  const { errors, loading, status } = useConnectorContext();

  const Status = useMemo(() => {
    return function Item(props: ConnectorStatusChildProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return (
    <Status
      status={status.readiness}
      error={errors.readiness}
      isLoading={loading.readiness}
    />
  );
};

Connector.Startup = function ConnectorStartup(
  { children }: ConnectorStatusProps,
) {
  const { errors, loading, status } = useConnectorContext();

  const Status = useMemo(() => {
    return function Item(props: ConnectorStatusChildProps) {
      return <>{children(props)}</>;
    };
  }, [children]);

  return (
    <Status
      status={status.startup}
      error={errors.startup}
      isLoading={loading.startup}
    />
  );
};
