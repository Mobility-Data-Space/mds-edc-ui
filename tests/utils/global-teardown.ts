import { execSync } from 'child_process';

async function globalTeardown() {
  console.log('Stopping Docker Compose services...');
  execSync('docker compose -f ./docker-compose.e2e.yml down', { stdio: 'inherit' });
  console.log('Docker Compose services stopped.');
}

export default globalTeardown;
