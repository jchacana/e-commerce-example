import { Order, OrderItem } from './order';

describe('Order', () => {
  describe('placing an order', () => {
    it('creates an order with items', () => {
      const items = [new OrderItem('product-1', 2)];
      const order = Order.place('order-1', 'customer-1', items);

      expect(order.id).toBe('order-1');
      expect(order.customerId).toBe('customer-1');
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe('product-1');
      expect(order.items[0].quantity).toBe(2);
    });

    it('rejects an order with no items', () => {
      expect(() => Order.place('order-1', 'customer-1', [])).toThrow(
        'Order must have at least one item',
      );
    });

    it('rejects an order with no customer', () => {
      const items = [new OrderItem('product-1', 1)];
      expect(() => Order.place('order-1', '', items)).toThrow('Order must have a customer');
    });

    it('rejects a whitespace-only customer id', () => {
      const items = [new OrderItem('product-1', 1)];
      expect(() => Order.place('order-1', '   ', items)).toThrow('Order must have a customer');
    });
  });

  describe('OrderItem', () => {
    it('creates an item with a positive quantity', () => {
      const item = new OrderItem('product-1', 3);

      expect(item.productId).toBe('product-1');
      expect(item.quantity).toBe(3);
    });

    it('rejects zero quantity', () => {
      expect(() => new OrderItem('product-1', 0)).toThrow(
        'Order item quantity must be positive',
      );
    });

    it('rejects negative quantity', () => {
      expect(() => new OrderItem('product-1', -1)).toThrow(
        'Order item quantity must be positive',
      );
    });
  });
});
