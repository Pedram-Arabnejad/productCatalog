import { Product } from '../../../domain/entities/Product';
import { ProductStatus } from '../../../domain/enums/ProductStatus';

export class CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock: number;
  status?: ProductStatus;
  categoryId: string;
  imageUrl?: string;

  validate(): string | null {
    if (!this.name || this.name.trim().length < 2) {
      return 'name is required (min 2 characters)';
    }
    if (this.price === undefined || this.price === null) {
      return 'price is required';
    }
    if (typeof this.price !== 'number' || this.price < 0) {
      return 'price must be a non-negative number';
    }
    if (this.stock === undefined || this.stock === null) {
      return 'stock is required';
    }
    if (!Number.isInteger(this.stock) || this.stock < 0) {
      return 'stock must be a non-negative integer';
    }
    if (this.status && !Object.values(ProductStatus).includes(this.status)) {
      return `status must be one of: ${Object.values(ProductStatus).join(', ')}`;
    }
    if (!this.categoryId) {
      return 'categoryId is required';
    }
    if (this.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug)) {
      return 'slug must be kebab-case (e.g. wireless-headphones)';
    }
    if (
      this.imageUrl !== undefined &&
      this.imageUrl !== null &&
      this.imageUrl.length > 2048
    ) {
      return 'imageUrl is too long (max 2048 characters)';
    }
    return null;
  }

  static fromBody(body: Record<string, unknown>): CreateProductDto {
    const dto = new CreateProductDto();
    dto.name = body.name as string;
    dto.slug = body.slug as string | undefined;
    dto.description = body.description as string | undefined;
    dto.price = body.price as number;
    dto.stock = body.stock as number;
    dto.status = body.status as ProductStatus | undefined;
    dto.categoryId = body.categoryId as string;
    dto.imageUrl = body.imageUrl as string | undefined;
    return dto;
  }
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: ProductStatus;
  categoryId?: string;
  imageUrl?: string;

  validate(): string | null {
    if (this.name !== undefined && this.name.trim().length < 2) {
      return 'name must be at least 2 characters';
    }
    if (this.price !== undefined && (typeof this.price !== 'number' || this.price < 0)) {
      return 'price must be a non-negative number';
    }
    if (this.stock !== undefined && (!Number.isInteger(this.stock) || this.stock < 0)) {
      return 'stock must be a non-negative integer';
    }
    if (this.status !== undefined && !Object.values(ProductStatus).includes(this.status)) {
      return `status must be one of: ${Object.values(ProductStatus).join(', ')}`;
    }
    return null;
  }

  static fromBody(body: Record<string, unknown>): UpdateProductDto {
    const dto = new UpdateProductDto();
    dto.name = body.name as string | undefined;
    dto.description = body.description as string | undefined;
    dto.price = body.price as number | undefined;
    dto.stock = body.stock as number | undefined;
    dto.status = body.status as ProductStatus | undefined;
    dto.categoryId = body.categoryId as string | undefined;
    dto.imageUrl = body.imageUrl as string | undefined;
    return dto;
  }
}

export class ProductQueryDto {
  categoryId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page: number;
  limit: number;

  validate(): string | null {
    if (this.status !== undefined && !Object.values(ProductStatus).includes(this.status)) {
      return `status must be one of: ${Object.values(ProductStatus).join(', ')}`;
    }
    if (this.page !== undefined && (!Number.isInteger(this.page) || this.page < 1)) {
      return 'page must be an integer >= 1';
    }
    if (this.limit !== undefined && (!Number.isInteger(this.limit) || this.limit < 1 || this.limit > 100)) {
      return 'limit must be an integer between 1 and 100';
    }
    if (
      this.minPrice !== undefined &&
      this.maxPrice !== undefined &&
      this.minPrice > this.maxPrice
    ) {
      return 'minPrice cannot be greater than maxPrice';
    }
    return null;
  }

  static fromQuery(query: Record<string, unknown>): ProductQueryDto {
    const dto = new ProductQueryDto();
    dto.categoryId = query.categoryId as string | undefined;
    dto.status = query.status as ProductStatus | undefined;
    dto.minPrice = query.minPrice !== undefined ? Number(query.minPrice) : undefined;
    dto.maxPrice = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;
    dto.search = query.search as string | undefined;
    dto.page = query.page !== undefined ? Number(query.page) : 1;
    dto.limit = query.limit !== undefined ? Number(query.limit) : 20;
    return dto;
  }
}

export class ProductResponseDto {
  static fromDomain(product: Product) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? null,
      price: {
        amount: product.price.getAmount(),
        formatted: product.price.format(),
      },
      stock: product.stock.getQuantity(),
      inStock: product.stock.isInStock(),
      status: product.status,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
