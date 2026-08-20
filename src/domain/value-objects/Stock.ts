export class Stock {
  private constructor(private readonly quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('Stock quantity must be a non-negative integer');
    }
  }

  static create(quantity: number): Stock {
    return new Stock(quantity);
  }

  static zero(): Stock {
    return new Stock(0);
  }

  getQuantity(): number {
    return this.quantity;
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  isAvailable(quantity: number): boolean {
    return this.quantity >= quantity;
  }

  decrease(quantity: number): Stock {
    if (quantity < 0) {
      throw new Error('Decrease quantity must be positive');
    }
    if (!this.isAvailable(quantity)) {
      throw new Error('Insufficient stock');
    }
    return new Stock(this.quantity - quantity);
  }

  increase(quantity: number): Stock {
    if (quantity < 0) {
      throw new Error('Increase quantity must be positive');
    }
    return new Stock(this.quantity + quantity);
  }

  equals(other: Stock): boolean {
    return this.quantity === other.quantity;
  }
}
