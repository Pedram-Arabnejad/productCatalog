export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'USD',
  ) {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
  }

  static create(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  format(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
