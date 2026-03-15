import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

async function buildApp(): Promise<INestApplication> {
	const module: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();
	const app = module.createNestApplication();
	await app.init();
	return app;
}

describe('Health (acceptance)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		app = await buildApp();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('GET /health', () => {
		it('returns 200 with status ok', async () => {
			await request(app.getHttpServer())
				.get('/health')
				.expect(200)
				.expect(({ body }) => {
					expect(body.status).toBe('ok');
				});
		});
	});
});
