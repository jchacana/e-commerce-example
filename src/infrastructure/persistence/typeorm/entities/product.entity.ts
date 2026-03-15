import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
	@PrimaryColumn({ type: 'varchar' })
	id: string;

	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'decimal' })
	price: number;
}
