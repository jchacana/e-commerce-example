import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

/**
 * RED — these tests drive your first outside-in TDD cycle for the Orders slice.
 *
 * Cycle:
 *   1. Run: npm run test:acceptance  → see 404 here
 *   2. Unit-test OrderController (RED) → implement (GREEN)
 *   3. Unit-test PlaceOrderUseCase (RED) → implement (GREEN)
 *   4. Wire OrderModule into AppModule
 *   5. Run: npm run test:acceptance  → GREEN ✓
 */
describe('Orders (acceptance)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders', () => {
    // Covers: US1, FR-001..005, SC-001
    it('places an order and returns 201 with the persisted resource', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          customerId: 'customer-1',
          items: [{ productId: 'product-1', quantity: 2 }],
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.customerId).toBe('customer-1');
          expect(body.items).toHaveLength(1);
          expect(body.items[0].productId).toBe('product-1');
          expect(body.items[0].quantity).toBe(2);
        });
    });

    // Covers: US2, FR-006, SC-002
    it('returns 400 when customerId is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ items: [{ productId: 'product-1', quantity: 1 }] })
        .expect(400);
    });

    // Covers: US2, FR-007, SC-003
    it('returns 400 when items list is empty', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ customerId: 'customer-1', items: [] })
        .expect(400);
    });

    // Covers: AC-004
    it('returns 400 when an item has a zero or negative quantity', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ customerId: 'customer-1', items: [{ productId: 'product-1', quantity: 0 }] })
        .expect(400);
    });
  });
});
