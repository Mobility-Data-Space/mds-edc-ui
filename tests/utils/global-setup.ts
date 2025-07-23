import { execSync } from 'child_process';

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
  const services = ['edc-1', 'edc-2'];
  const interval = 5000; // 5 seconds

  console.log('Waiting for services to become healthy...');
  for (const service of services) {
    while (!checkInitStatus(service)) {
      console.log(`Service ${service} is not healthy yet. Retrying in ${interval / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    console.log(`Service ${service} is ready.`);
  }

  console.log('Seeding dataspace using seed_dataspace.sh...');
  try {
    execSync(`./tests/utils/seed_dataspace.sh http://127.0.0.1:8182/api/management http://127.0.0.1:9182/api/management`, { stdio: 'inherit' });
    console.log('Dataspace seeding completed successfully.');
  } catch (error) {
    console.error('Error during dataspace seeding:', (error as Error).message);
    process.exit(1);
  }
}

export default globalSetup;
