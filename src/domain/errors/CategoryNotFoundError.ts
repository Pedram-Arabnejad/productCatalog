import { DomainError } from './DomainError';

export class CategoryNotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = 'CATEGORY_NOT_FOUND';

  constructor(identifier: string) {
    super(`Category not found: ${identifier}`);
  }
}
