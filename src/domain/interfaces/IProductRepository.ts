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

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(options?: FindProductsOptions): Promise<Product[]>;
  count(options?: FindProductsOptions): Promise<number>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  existsBySlug(slug: string): Promise<boolean>;
  getPopularProducts(limit: number): Promise<Product[]>;
}
