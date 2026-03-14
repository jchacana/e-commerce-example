import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup(): Promise<void> {
  // Ryuk is disabled because globalTeardown handles container cleanup explicitly.
  process.env['TESTCONTAINERS_RYUK_DISABLED'] = 'true';
  const container = await new PostgreSqlContainer('postgres:16').start();
  process.env['INTEGRATION_DB_URL'] = container.getConnectionUri();
  (global as unknown as { __POSTGRES_CONTAINER__: unknown }).__POSTGRES_CONTAINER__ = container;
}
