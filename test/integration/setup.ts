import { existsSync } from 'fs';
import { homedir } from 'os';
import * as path from 'path';

const socketCandidates = [
  path.join(homedir(), '.colima', 'default', 'docker.sock'),
  path.join(homedir(), '.colima', 'docker.sock'),
  path.join(homedir(), '.docker', 'run', 'docker.sock'),
  path.join(homedir(), '.docker', 'desktop', 'docker.sock'),
  '/var/run/docker.sock',
];

if (!process.env['DOCKER_HOST']) {
  const found = socketCandidates.find(existsSync);
  if (found) {
    process.env['DOCKER_HOST'] = `unix://${found}`;
    process.env['TESTCONTAINERS_RYUK_DISABLED'] = 'true';
  }
}
