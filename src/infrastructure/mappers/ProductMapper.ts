import { Product as PrismaProduct } from '@prisma/client';
import { Product } from '../../domain/entities/Product';
import { ProductStatus } from '../../domain/enums/ProductStatus';
import { Money } from '../../domain/value-objects/Money';
import { Stock } from '../../domain/value-objects/Stock';

export class ProductMapper {
  static toDomain(prismaProduct: PrismaProduct): Product {
    return Product.create({
      id: prismaProduct.id,
      name: prismaProduct.name,
      slug: prismaProduct.slug,
      description: prismaProduct.description ?? undefined,
      price: Money.create(Number(prismaProduct.price)),
      stock: Stock.create(prismaProduct.stock),
      status: prismaProduct.status as ProductStatus,
      categoryId: prismaProduct.categoryId,
      imageUrl: prismaProduct.imageUrl ?? undefined,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    });
  }

  static toPersistence(product: Product) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? null,
      price: product.price.getAmount(),
      stock: product.stock.getQuantity(),
      status: product.status,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
