import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup(): Promise<void> {
  // On Colima, the Docker socket is a macOS host path (e.g. ~/.colima/docker.sock),
  // but Ryuk must bind-mount the socket path as seen from inside the Linux VM.
  process.env['TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE'] ??= '/var/run/docker.sock';
  const container = await new PostgreSqlContainer('postgres:16').start();
  process.env['INTEGRATION_DB_URL'] = container.getConnectionUri();
  (global as unknown as { __POSTGRES_CONTAINER__: unknown }).__POSTGRES_CONTAINER__ = container;
}
