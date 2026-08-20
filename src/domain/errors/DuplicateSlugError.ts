import { DomainError } from './DomainError';

export class DuplicateSlugError extends DomainError {
  readonly statusCode = 409;
  readonly code = 'DUPLICATE_SLUG';

  constructor(slug: string) {
    super(`Slug already exists: ${slug}`);
  }
}
