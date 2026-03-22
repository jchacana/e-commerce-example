import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1700000000001 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" varchar NOT NULL,
        "customer_id" varchar NOT NULL,
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      )
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "orders"`);
	}
}
