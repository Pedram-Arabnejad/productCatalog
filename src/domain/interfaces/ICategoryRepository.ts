import { Category } from '../entities/Category';

export abstract class ICategoryRepository {
  abstract findById(id: string): Promise<Category | null>;
  abstract findBySlug(slug: string): Promise<Category | null>;
  abstract findAll(): Promise<Category[]>;
  abstract save(category: Category): Promise<Category>;
  abstract update(category: Category): Promise<Category>;
  abstract delete(id: string): Promise<void>;
  abstract existsBySlug(slug: string): Promise<boolean>;
}
