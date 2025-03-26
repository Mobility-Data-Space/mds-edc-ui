import { Participant } from "@/constants/dataspace";
import { USE_CASES } from "@/constants/use-cases";
import { useRouter } from "next/router";

type ConnectorDashboardState = {
  connector: Participant;
  push: (href: string) => void;
};

export function useConnectorDashboardState(): ConnectorDashboardState {
  const router = useRouter();

  const connector: Participant = {
    id: process.env.NEXT_PUBLIC_EDC_ID || "",
    name: process.env.NEXT_PUBLIC_EDC_NAME || "",
    managementUrl: process.env.NEXT_PUBLIC_EDC_MANAGEMENT_URL || "",
    defaultUrl: process.env.NEXT_PUBLIC_EDC_DEFAULT_URL || "",
    protocolUrl: process.env.NEXT_PUBLIC_EDC_PROTOCOL_URL || "",
  };

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
