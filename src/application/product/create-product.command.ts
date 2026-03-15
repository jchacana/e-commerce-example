export class CreateProductCommand {
	constructor(
		readonly name: string,
		readonly price: number,
	) {}
}
