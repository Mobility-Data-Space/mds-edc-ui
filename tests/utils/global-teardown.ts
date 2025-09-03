import { execSync } from 'child_process';

async function globalTeardown() {
  const isCI = process.env.CI === 'true';
  
  if (!isCI) {
    console.log('Stopping Docker Compose services...');
    execSync('docker compose -f ./docker-compose.e2e.yml down', { stdio: 'inherit' });
    console.log('Docker Compose services stopped.');
  } else {
    console.log('Running in CI environment. Skipping Docker Compose teardown.');
  }
}

export default globalTeardown;
