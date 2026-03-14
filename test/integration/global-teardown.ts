export default async function globalTeardown(): Promise<void> {
  const container = (global as unknown as { __POSTGRES_CONTAINER__?: { stop: () => Promise<void> } }).__POSTGRES_CONTAINER__;
  await container?.stop();
}
