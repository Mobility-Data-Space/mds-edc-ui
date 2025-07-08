import {Participant} from "@/constants/dataspace.ts";

export const managementPrefix = "/connector/management";

export function connectorApiKey() {
  return process.env.EDC_MANAGEMENT_API_KEY || "";
}

export function participantConfig() {
  return {
    id: process.env.EDC_ID || "",
    name: process.env.EDC_NAME || "",
    description: process.env.EDC_DESCRIPTION || "",
    edcUrl: process.env.EDC_URL || "",
    managementUrl: managementPrefix,
    connectorManagementUrl: process.env.EDC_MANAGEMENT_URL || "",
    defaultUrl: process.env.EDC_DEFAULT_URL || "",
    protocolUrl: process.env.EDC_PROTOCOL_URL || "",
  };
}

export async function readEnvironment(): Promise<Participant> {
  return participantConfig();
}
