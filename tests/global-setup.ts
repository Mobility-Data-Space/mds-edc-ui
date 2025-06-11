import { execSync } from 'child_process';

async function globalSetup() {
  console.log('Starting Docker Compose services...');
  execSync('docker compose -f ./docker-compose.e2e.yml up -d', { stdio: 'inherit' });
  console.log('Docker Compose services started.');
}

export default globalSetup;
