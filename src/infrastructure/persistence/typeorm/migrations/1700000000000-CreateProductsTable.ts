import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1700000000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "products" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "price" decimal NOT NULL,
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "products"`);
	}
}
