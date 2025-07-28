import { Participant } from "@/utilities/participant";
import { useRouter } from "next/router";
import {useEffect, useState, useRef} from "react";

export const useParticipantConnectorState = () => {
  const router = useRouter();
  const [connector, setConnector] = useState({} as Participant);

  const isFetched = useRef(false);

  useEffect(() => {
    const fetchConnectorConfig = async () => {
      const config = await fetch("/connector/config");
      setConnector(await config.json());
    };

    if (!isFetched.current) {
      fetchConnectorConfig();
      isFetched.current = true;
    }
  }, []);

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  };
}
