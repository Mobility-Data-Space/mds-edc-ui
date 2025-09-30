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
    .then((response) => response.json())
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
  const [connector, setConnector] = useState<Participant>(
    cachedConnector || ({} as Participant),
  );

  useEffect(() => {
    fetchConnectorConfig().then(setConnector);
  }, []);

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  };
};
