import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemsTable1700000000002 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" serial NOT NULL,
        "product_id" varchar NOT NULL,
        "quantity" int NOT NULL,
        "order_id" varchar,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "order_items"`);
	}
}
