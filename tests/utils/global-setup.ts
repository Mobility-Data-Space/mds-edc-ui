import { execSync } from "child_process";
import {
  create_pending_negotiations,
  initiate_transfers,
  publish_offers,
  seed_dead_provider,
} from "./seed.ts";
import {
  participantConfig,
  counterPartyParticipantConfig,
  deadProviderConfig,
  SERVICES,
} from "./tests-config.ts";
import { type Participant } from "../../src/utilities/participant.ts";

const checkApiReadiness = async (
  managementUrl: string,
  apiKey: string,
  maxRetries = 30,
  intervalMs = 2000,
): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${managementUrl}/v3/assets/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({}),
      });
      if (response.ok || response.status === 400) {
        // 400 is acceptable - API is responding, just rejecting empty request
        return true;
      }
    } catch {
      // API not ready yet
    }
    console.log(
      `API at ${managementUrl} not ready yet. Retrying in ${intervalMs / 1000}s... (${i + 1}/${maxRetries})`,
    );
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
};

const checkInitStatus = (serviceName: string): boolean => {
  try {
    const containerId = execSync(
      `docker ps --filter "name=${serviceName}" --format "{{.ID}}"`,
    )
      .toString()
      .trim();
    if (!containerId) {
      console.error(`No container found for service ${serviceName}`);
      return false;
    }
    const result = execSync(
      `docker inspect --format='{{.State.Status}}' ${containerId}`,
    )
      .toString()
      .trim();
    return result === "running";
  } catch (error) {
    console.error(
      `Error checking status for service ${serviceName}:`,
      (error as Error).message,
    );
    return false;
  }
};

async function globalSetup() {
  const interval = 5000; // 5 seconds

  const isCI = process.env.CI === "true";

  if (!isCI) {
    console.log("Waiting for services to become healthy...");
    for (const service of SERVICES) {
      while (!checkInitStatus(service)) {
        console.log(
          `Service ${service} is not healthy yet. Retrying in ${interval / 1000} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      console.log(`Service ${service} is ready.`);
    }
  } else {
    console.log("Running in CI environment. Skipping Docker health checks.");
  }

  // Wait for EDC APIs to be ready before seeding
  const apiKey = process.env.TEST_API_KEY || "default-test-api-key";
  console.log("Checking EDC API readiness...");

  const participantReady = await checkApiReadiness(
    participantConfig.EDC_MANAGEMENT_URL,
    apiKey,
  );
  if (!participantReady) {
    throw new Error(
      `EDC API at ${participantConfig.EDC_MANAGEMENT_URL} failed to become ready`,
    );
  }
  console.log("Participant EDC API is ready.");

  const counterPartyReady = await checkApiReadiness(
    counterPartyParticipantConfig.EDC_MANAGEMENT_URL,
    apiKey,
  );
  if (!counterPartyReady) {
    throw new Error(
      `EDC API at ${counterPartyParticipantConfig.EDC_MANAGEMENT_URL} failed to become ready`,
    );
  }
  console.log("Counter-party EDC API is ready.");

  const deadProviderReady = await checkApiReadiness(
    deadProviderConfig.EDC_MANAGEMENT_URL,
    apiKey,
  );
  if (!deadProviderReady) {
    throw new Error(
      `EDC API at ${deadProviderConfig.EDC_MANAGEMENT_URL} failed to become ready`,
    );
  }
  console.log("Dead-provider EDC API is ready.");

  console.log("Seeding dataspace ...");
  try {
    const participant: Participant = {
      id: participantConfig.EDC_ID,
      name: participantConfig.EDC_NAME,
      description: participantConfig.EDC_DESCRIPTION,
      publicUrl: participantConfig.EDC_PUBLIC_URL,
      managementUrl: participantConfig.EDC_MANAGEMENT_URL,
      defaultUrl: participantConfig.EDC_DEFAULT_URL,
      protocolUrl: participantConfig.EDC_PROTOCOL_URL,
      curatorName: participantConfig.EDC_CURATOR_ORGANIZATION,
      curatorUrl: participantConfig.EDC_CURATOR_URL,
      maintainerName: participantConfig.EDC_MAINTAINER_ORGANIZATION,
      maintainerUrl: participantConfig.EDC_MAINTAINER_URL,
      dapsUrl: participantConfig.MDS_DAPS_URL,
      dapsJwksUrl: participantConfig.MDS_DAPS_JWKS_URL,
    };

    const counterPartyParticipant: Participant = {
      id: counterPartyParticipantConfig.EDC_ID,
      name: counterPartyParticipantConfig.EDC_NAME,
      description: counterPartyParticipantConfig.EDC_DESCRIPTION,
      publicUrl: counterPartyParticipantConfig.EDC_PUBLIC_URL,
      managementUrl: counterPartyParticipantConfig.EDC_MANAGEMENT_URL,
      defaultUrl: counterPartyParticipantConfig.EDC_DEFAULT_URL,
      protocolUrl: counterPartyParticipantConfig.EDC_PROTOCOL_URL,
      curatorName: counterPartyParticipantConfig.EDC_CURATOR_ORGANIZATION,
      curatorUrl: counterPartyParticipantConfig.EDC_CURATOR_URL,
      maintainerName: counterPartyParticipantConfig.EDC_MAINTAINER_ORGANIZATION,
      maintainerUrl: counterPartyParticipantConfig.EDC_MAINTAINER_URL,
      dapsUrl: counterPartyParticipantConfig.MDS_DAPS_URL,
      dapsJwksUrl: counterPartyParticipantConfig.MDS_DAPS_JWKS_URL,
    };

    const deadProvider: Participant = {
      id: deadProviderConfig.EDC_ID,
      name: deadProviderConfig.EDC_NAME,
      description: deadProviderConfig.EDC_DESCRIPTION,
      publicUrl: deadProviderConfig.EDC_PUBLIC_URL,
      managementUrl: deadProviderConfig.EDC_MANAGEMENT_URL,
      defaultUrl: deadProviderConfig.EDC_DEFAULT_URL,
      protocolUrl: deadProviderConfig.EDC_PROTOCOL_URL,
      curatorName: deadProviderConfig.EDC_CURATOR_ORGANIZATION,
      curatorUrl: deadProviderConfig.EDC_CURATOR_URL,
      maintainerName: deadProviderConfig.EDC_MAINTAINER_ORGANIZATION,
      maintainerUrl: deadProviderConfig.EDC_MAINTAINER_URL,
      dapsUrl: deadProviderConfig.MDS_DAPS_URL,
      dapsJwksUrl: deadProviderConfig.MDS_DAPS_JWKS_URL,
    };

    await publish_offers(participant);
    await publish_offers(counterPartyParticipant);

    await initiate_transfers(participant, counterPartyParticipant);
    await create_pending_negotiations(participant, counterPartyParticipant);

    await seed_dead_provider(participant, deadProvider);

    // Stop edc-3 so the UI sees a permanently-unreachable counterparty.
    // Try the compose service label (local) first, then fall back to a name
    // match (CI uses GitHub `services:` blocks which don't carry that label).
    const findContainer = (filter: string) =>
      execSync(`docker ps --filter "${filter}" --format "{{.ID}}"`)
        .toString()
        .trim()
        .split("\n")
        .filter(Boolean)[0];

    const deadId =
      findContainer("label=com.docker.compose.service=edc-3") ||
      findContainer("name=edc-3");
    if (!deadId) {
      throw new Error("edc-3 container not found; cannot stop dead provider");
    }
    execSync(`docker stop ${deadId}`, { stdio: "pipe" });
    console.log("edc-3 stopped; dead-provider state ready.");

    console.log("Dataspace seeding completed successfully.");
  } catch (error) {
    console.error("Error during dataspace seeding:", (error as Error).message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  globalSetup();
}

export default globalSetup;
