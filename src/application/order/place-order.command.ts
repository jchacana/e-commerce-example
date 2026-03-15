export class PlaceOrderCommand {
	constructor(
		readonly customerId: string,
		readonly items: Array<{ productId: string; quantity: number }>,
	) {}
}
