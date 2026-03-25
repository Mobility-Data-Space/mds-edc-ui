import "server-only";

import { Participant } from "./participant";

export function getConnectorFromEnv(): Participant & { apiKey: string } {
  const required = {
    EDC_ID: process.env.EDC_ID,
    EDC_MANAGEMENT_URL: process.env.EDC_MANAGEMENT_URL,
    EDC_MANAGEMENT_API_KEY: process.env.EDC_MANAGEMENT_API_KEY,
    EDC_PROTOCOL_URL: process.env.EDC_PROTOCOL_URL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const optional: Record<string, string | undefined> = {
    EDC_NAME: process.env.EDC_NAME,
    EDC_DESCRIPTION: process.env.EDC_DESCRIPTION,
    EDC_PUBLIC_URL: process.env.EDC_PUBLIC_URL,
    EDC_DEFAULT_URL: process.env.EDC_DEFAULT_URL,
    EDC_CURATOR_ORGANIZATION: process.env.EDC_CURATOR_ORGANIZATION,
    EDC_CURATOR_URL: process.env.EDC_CURATOR_URL,
    EDC_MAINTAINER_ORGANIZATION: process.env.EDC_MAINTAINER_ORGANIZATION,
    EDC_MAINTAINER_URL: process.env.EDC_MAINTAINER_URL,
    MDS_DAPS_URL: process.env.MDS_DAPS_URL,
    MDS_DAPS_JWKS_URL: process.env.MDS_DAPS_JWKS_URL,
  };

  const missingOptional = Object.entries(optional)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingOptional.length) {
    console.warn(
      `Missing optional environment variables: ${missingOptional.join(", ")}`,
    );
  }

  return {
    id: required.EDC_ID!,
    name: optional.EDC_NAME || "",
    description: optional.EDC_DESCRIPTION || "",
    publicUrl: optional.EDC_PUBLIC_URL || "",
    managementUrl: required.EDC_MANAGEMENT_URL!,
    defaultUrl: optional.EDC_DEFAULT_URL || "",
    protocolUrl: required.EDC_PROTOCOL_URL!,
    curatorName: optional.EDC_CURATOR_ORGANIZATION || "",
    curatorUrl: optional.EDC_CURATOR_URL || "",
    maintainerName: optional.EDC_MAINTAINER_ORGANIZATION || "",
    maintainerUrl: optional.EDC_MAINTAINER_URL || "",
    dapsUrl: optional.MDS_DAPS_URL || "",
    dapsJwksUrl: optional.MDS_DAPS_JWKS_URL || "",
    apiKey: required.EDC_MANAGEMENT_API_KEY!,
  };
}

// !IMPORTANT: Do Not Import To Client
export function getConnectorConfig(): Participant & { apiKey: string } {
  return getConnectorFromEnv();
}
