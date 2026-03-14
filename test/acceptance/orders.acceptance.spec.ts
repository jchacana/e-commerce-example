import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

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
    // Covers: place-order AC-001
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

    // Covers: place-order AC-002
    it('returns 400 when customerId is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ items: [{ productId: 'product-1', quantity: 1 }] })
        .expect(400);
    });

    // Covers: place-order AC-003
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
