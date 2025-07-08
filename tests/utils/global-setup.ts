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
  const serviceName = 'seed_dataspace';
  const interval = 5000; // 5 seconds

  console.log(`Checking status of service: ${serviceName}`);
  while(!checkInitStatus(serviceName)){
    if (checkInitStatus(serviceName)) {
      console.log(`Service ${serviceName} completed execution.`);
      break;
    }
    console.log(`Service ${serviceName} is not ready yet. Retrying in ${interval / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  await new Promise((resolve) => setTimeout(resolve, interval));
  console.log('Docker Compose services started.');
}

export default globalSetup;
