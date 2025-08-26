import { execSync } from 'child_process';
import { initiate_transfers, publish_offers } from './seed';
import { participantConfig, counterPartyParticipantConfig, SERVICES } from './tests-config'
import { Participant } from '@/utilities/participant';

const checkInitStatus = (serviceName: string): boolean => {
  try {
    const containerId = execSync(`docker ps --filter "name=${serviceName}" --format "{{.ID}}"`).toString().trim();
    if (!containerId) {
      console.error(`No container found for service ${serviceName}`);
      return false;
    }
    const result = execSync(`docker inspect --format='{{.State.Status}}' ${containerId}`).toString().trim();
    return result === 'running';
  } catch (error) {
    console.error(`Error checking status for service ${serviceName}:`, (error as Error).message);
    return false;
  }
};

async function globalSetup() {
  const interval = 5000; // 5 seconds

  const isCI = process.env.CI === 'true';

  if (!isCI) {
    console.log('Waiting for services to become healthy...');
    for (const service of SERVICES) {
      while (!checkInitStatus(service)) {
        console.log(`Service ${service} is not healthy yet. Retrying in ${interval / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      console.log(`Service ${service} is ready.`);
    }
  } else {
    console.log('Running in CI environment. Skipping Docker health checks.');
  }

  console.log('Seeding dataspace ...');
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
      dapsJwksUrl: participantConfig.MDS_DAPS_JWKS_URL
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
      dapsJwksUrl: counterPartyParticipantConfig.MDS_DAPS_JWKS_URL
    };

    await publish_offers(participant);
    await publish_offers(counterPartyParticipant);

    await initiate_transfers(participant, counterPartyParticipant);

    console.log('Dataspace seeding completed successfully.');
  } catch (error) {
    console.error('Error during dataspace seeding:', (error as Error).message);
    process.exit(1);
  }
}

export default globalSetup;
