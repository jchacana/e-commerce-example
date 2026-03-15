import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

async function buildApp(): Promise<INestApplication> {
	const module: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();
	const app = module.createNestApplication();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.init();
	return app;
}

describe('Products (acceptance)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		app = await buildApp();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('POST /products', () => {
		// Covers: create-product AC-001
		it('creates a product and returns 201 with the persisted resource', async () => {
			await request(app.getHttpServer())
				.post('/products')
				.send({ name: 'Widget', price: 9.99 })
				.expect(201)
				.expect(({ body }) => {
					expect(body.id).toBeDefined();
					expect(body.name).toBe('Widget');
					expect(body.price).toBe(9.99);
				});
		});

		// Covers: create-product AC-002
		it('returns 400 when name is missing', async () => {
			await request(app.getHttpServer()).post('/products').send({ price: 9.99 }).expect(400);
		});

		// Covers: create-product AC-003
		it('returns 400 when price is not positive', async () => {
			await request(app.getHttpServer()).post('/products').send({ name: 'Widget', price: 0 }).expect(400);
		});
	});

	describe('GET /products', () => {
		// Covers: get-products AC-002
		it('returns 200 with an empty array when no products exist', async () => {
			const freshApp = await buildApp();

			await request(freshApp.getHttpServer())
				.get('/products')
				.expect(200)
				.expect(({ body }) => {
					expect(body).toEqual([]);
				});

			await freshApp.close();
		});

		// Covers: get-products AC-001
		it('returns 200 with all products', async () => {
			const { body: created } = await request(app.getHttpServer())
				.post('/products')
				.send({ name: 'Widget', price: 9.99 })
				.expect(201);

			await request(app.getHttpServer())
				.get('/products')
				.expect(200)
				.expect(({ body }) => {
					expect(body).toEqual(
						expect.arrayContaining([expect.objectContaining({ id: created.id, name: 'Widget', price: 9.99 })]),
					);
				});
		});
	});

	describe('GET /products/:id', () => {
		// Covers: get-products AC-004
		it('returns 404 when the product does not exist', async () => {
			await request(app.getHttpServer()).get('/products/nonexistent-id').expect(404);
		});

		// Covers: get-products AC-003
		it('returns 200 with the product when it exists', async () => {
			const { body: created } = await request(app.getHttpServer())
				.post('/products')
				.send({ name: 'Gadget', price: 19.99 })
				.expect(201);

			await request(app.getHttpServer())
				.get(`/products/${created.id}`)
				.expect(200)
				.expect(({ body }) => {
					expect(body.id).toBe(created.id);
					expect(body.name).toBe('Gadget');
					expect(body.price).toBe(19.99);
				});
		});
	});
});
