import { Participant } from "@/utilities/participant";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

let cachedConnector: Participant | null = null;
let fetchPromise: Promise<Participant> | null = null;

const fetchConnectorConfig = async (): Promise<Participant> => {
  if (cachedConnector) {
    return cachedConnector;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetch("/connector/config")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load connector config: ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((data) => {
      cachedConnector = data;
      fetchPromise = null;
      return data;
    })
    .catch((error) => {
      fetchPromise = null;
      throw error;
    });

  return fetchPromise;
};

export const useParticipantConnectorState = () => {
  const router = useRouter();
  const [connector, setConnector] = useState<Participant | null>(
    cachedConnector,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchConnectorConfig()
      .then((data) => {
        if (!cancelled) setConnector(data);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        console.error(reason);
        setError(reason instanceof Error ? reason : new Error(String(reason)));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    connector,
    error,
    push: (href: string) => router.push(`${href}`),
  };
};
