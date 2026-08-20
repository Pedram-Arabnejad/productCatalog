import { DomainError } from './DomainError';

export class InsufficientStockError extends DomainError {
  readonly statusCode = 400;
  readonly code = 'INSUFFICIENT_STOCK';

  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}: requested ${requested}, available ${available}`,
    );
  }
}
