import { Participant } from "@/constants/dataspace";
import { useRouter } from "next/router";

type ConnectorDashboardState = {
  connector: Participant;
  push: (href: string) => void;
};

export function appendProxyPrefix(url: string = "") {
  return `${process.env.NEXT_PUBLIC_EDC_URL || ""}/api?path=${url}`;
}

export function removeProxyPrefix(url: string = "") {
  return url.replace(new RegExp(`(${process.env.NEXT_PUBLIC_EDC_URL || ""})?/api\\?path=`, 'i'), "");
}

export function useConnectorDashboardState(): ConnectorDashboardState {
  const router = useRouter();

  const connector: Participant = {
    id: process.env.NEXT_PUBLIC_EDC_ID || "",
    name: process.env.NEXT_PUBLIC_EDC_NAME || "",
    edcUrl: process.env.NEXT_PUBLIC_EDC_URL || "",
    managementUrl: appendProxyPrefix(process.env.NEXT_PUBLIC_EDC_MANAGEMENT_URL),
    defaultUrl: appendProxyPrefix(process.env.NEXT_PUBLIC_EDC_DEFAULT_URL),
    protocolUrl: appendProxyPrefix(process.env.NEXT_PUBLIC_EDC_PROTOCOL_URL),
  };

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
