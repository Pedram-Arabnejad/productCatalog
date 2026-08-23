import { Product } from '../entities/Product';
import { ProductStatus } from '../enums/ProductStatus';

export interface FindProductsOptions {
  categoryId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export abstract class IProductRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findBySlug(slug: string): Promise<Product | null>;
  abstract findAll(options?: FindProductsOptions): Promise<Product[]>;
  abstract count(options?: FindProductsOptions): Promise<number>;
  abstract save(product: Product): Promise<Product>;
  abstract update(product: Product): Promise<Product>;
  abstract delete(id: string): Promise<void>;
  abstract existsBySlug(slug: string): Promise<boolean>;
  abstract getPopularProducts(limit: number): Promise<Product[]>;
}
