import { existsSync } from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

async function resolveDockerHost(): Promise<void> {
  if (process.env['DOCKER_HOST']) return;

  const socketCandidates = [
    path.join(homedir(), '.colima', 'default', 'docker.sock'),
    path.join(homedir(), '.colima', 'docker.sock'),
    path.join(homedir(), '.docker', 'run', 'docker.sock'),
    path.join(homedir(), '.docker', 'desktop', 'docker.sock'),
    '/var/run/docker.sock',
  ];

  const found = socketCandidates.find(existsSync);
  if (found) {
    process.env['DOCKER_HOST'] = `unix://${found}`;
    process.env['TESTCONTAINERS_RYUK_DISABLED'] = 'true';
  }
}

export default async function globalSetup(): Promise<void> {
  await resolveDockerHost();

  const container = await new PostgreSqlContainer('postgres:16').start();

  process.env['INTEGRATION_DB_HOST'] = container.getHost();
  process.env['INTEGRATION_DB_PORT'] = String(container.getPort());
  process.env['INTEGRATION_DB_USER'] = container.getUsername();
  process.env['INTEGRATION_DB_PASSWORD'] = container.getPassword();
  process.env['INTEGRATION_DB_NAME'] = container.getDatabase();

  (global as unknown as { __POSTGRES_CONTAINER__: unknown }).__POSTGRES_CONTAINER__ = container;
}
