import { Participant } from "@/constants/dataspace";
import { useRouter } from "next/router";

type ParticipantConnectorState = {
  connector: Participant;
  push: (href: string) => void;
};

function appendProxyPrefix(url: string = "") {
  return `${process.env.NEXT_PUBLIC_EDC_URL || ""}/api?path=${url}`;
}

export function useParticipantConnectorState(): ParticipantConnectorState {
  const router = useRouter();

  const connector: Participant = {
    id: process.env.NEXT_PUBLIC_EDC_ID || "",
    name: process.env.NEXT_PUBLIC_EDC_NAME || "",
    edcUrl: process.env.NEXT_PUBLIC_EDC_URL || "",
    managementUrl: appendProxyPrefix(process.env.NEXT_PUBLIC_EDC_MANAGEMENT_URL),
    defaultUrl: appendProxyPrefix(process.env.NEXT_PUBLIC_EDC_DEFAULT_URL),
    protocolUrl: process.env.NEXT_PUBLIC_EDC_PROTOCOL_URL || "",
  };

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
