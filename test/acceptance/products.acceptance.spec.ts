import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Products (acceptance)', () => {
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

  describe('POST /products', () => {
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

    it('returns 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({ price: 9.99 })
        .expect(400);
    });

    it('returns 400 when price is not positive', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({ name: 'Widget', price: 0 })
        .expect(400);
    });
  });
});
