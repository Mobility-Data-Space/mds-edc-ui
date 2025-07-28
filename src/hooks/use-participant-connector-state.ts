import { Participant } from "@/utilities/participant";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";

export const useParticipantConnectorState = () => {
  const router = useRouter();
  const [connector, setConnector] = useState({} as Participant);

  useEffect(() => {
    const fetchConnectorConfig = async () => {
      const config = await fetch("/connector/config");
      setConnector(await config.json());
    };

    fetchConnectorConfig() ;
  }, [])

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  };
}
