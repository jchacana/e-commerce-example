# Architecture — Implemented Slices

> Keep this file current. Update as part of the commit that moves a slice from RED to GREEN.

## Products — full CRUD read slice (all tests GREEN)

Endpoints: `POST /products`, `GET /products`, `GET /products/:id`

- `src/domain/product/product.ts` — `Product` entity with `Product.create()`
- `src/application/product/create-product.use-case.ts` — `CreateProductUseCase`
- `src/application/product/get-all-products.use-case.ts` — `GetAllProductsUseCase`
- `src/application/product/get-product.use-case.ts` — `GetProductUseCase`
- `src/infrastructure/http/product/product.controller.ts` — controller
- `src/infrastructure/product.module.ts` — NestJS wiring
- `test/acceptance/products.acceptance.spec.ts` — 7 scenarios GREEN ✓

## Orders — Place Order slice (all tests GREEN)

Endpoints: `POST /orders`

- `src/domain/order/order.ts` — `Order` + `OrderItem` entities
- `src/domain/order/order.repository.ts` — `IOrderRepository` interface + token
- `src/application/order/place-order.use-case.ts` — `PlaceOrderUseCase`
- `src/infrastructure/http/order/order.controller.ts` — controller
- `src/infrastructure/http/order/dto/place-order.dto.ts` — `PlaceOrderDto`
- `src/infrastructure/persistence/in-memory/in-memory-order.repository.ts` — in-memory impl
- `src/infrastructure/order.module.ts` — NestJS wiring
- `test/acceptance/orders.acceptance.spec.ts` — 3 scenarios GREEN ✓
