import { DomainError } from './DomainError';

export class ProductNotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = 'PRODUCT_NOT_FOUND';

  constructor(identifier: string) {
    super(`Product not found: ${identifier}`);
  }
}
