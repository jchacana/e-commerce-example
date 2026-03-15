import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup(): Promise<void> {
	const container = await new PostgreSqlContainer('postgres:16').start();
	process.env['INTEGRATION_DB_URL'] = container.getConnectionUri();
	(global as unknown as { __POSTGRES_CONTAINER__: unknown }).__POSTGRES_CONTAINER__ = container;
}
