import {Participant} from "@/constants/dataspace.ts";

export function participantConfig() {
  return {
    id: process.env.EDC_ID || "",
    name: process.env.EDC_NAME || "",
    edcUrl: process.env.EDC_URL || "",
    managementUrl: process.env.EDC_MANAGEMENT_URL || "",
    defaultUrl: process.env.EDC_DEFAULT_URL || "",
    protocolUrl: process.env.EDC_PROTOCOL_URL || "",
  };
}

export async function readEnvironment(): Promise<Participant> {
  if (typeof window !== "undefined") {
    const response = await fetch("/api/config");
    return response.json();
  }

  return participantConfig();
}
