#!/usr/bin/env node
// Verifies every AC-XXX ID declared in docs/specs/ has at least one
// corresponding `// AC-XXX` comment in a test file, and vice versa.

'use strict';

const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');

function filesIn(dir, ext) {
	const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
	return entries
		.filter((e) => e.isFile() && e.name.endsWith(ext))
		.map((e) => join(e.parentPath ?? e.path, e.name));
}

// Extract AC-XXX IDs from spec tables: | AC-012 | ...
function acsInSpecs() {
	const ids = new Map(); // id → spec file
	for (const file of filesIn(join(root, 'docs/specs'), '.md')) {
		const content = readFileSync(file, 'utf8');
		for (const [, id] of content.matchAll(/\|\s*(AC-\d{3})\s*\|/g)) {
			ids.set(id, file.replace(root + '/', ''));
		}
	}
	return ids;
}

// Extract AC-XXX IDs from test comments: // ... AC-012 ...
function acsInTests() {
	const ids = new Map(); // id → test file
	const dirs = [join(root, 'src'), join(root, 'test')];
	for (const dir of dirs) {
		for (const file of filesIn(dir, '.spec.ts')) {
			const content = readFileSync(file, 'utf8');
			for (const [, id] of content.matchAll(/\/\/.*?(AC-\d{3})/g)) {
				if (!ids.has(id)) ids.set(id, file.replace(root + '/', ''));
			}
		}
	}
	return ids;
}

const specAcs = acsInSpecs();
const testAcs = acsInTests();

const missing = [...specAcs.keys()].filter((id) => !testAcs.has(id));
const orphaned = [...testAcs.keys()].filter((id) => !specAcs.has(id));

if (missing.length) {
	console.error('❌  ACs declared in specs but not referenced in any test:');
	for (const id of missing) console.error(`   ${id}  (${specAcs.get(id)})`);
}

if (orphaned.length) {
	console.error('❌  ACs referenced in tests but not declared in any spec:');
	for (const id of orphaned) console.error(`   ${id}  (${testAcs.get(id)})`);
}

if (missing.length || orphaned.length) process.exit(1);

console.log(`✓  AC coverage OK — ${specAcs.size} AC(s) declared, all referenced in tests`);
