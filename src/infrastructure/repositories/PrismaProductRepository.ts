import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IProductRepository,
  FindProductsOptions,
} from '../../domain/interfaces/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductMapper } from '../mappers/ProductMapper';

@Injectable()
export class PrismaProductRepository extends IProductRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findAll(options: FindProductsOptions = {}): Promise<Product[]> {
    const {
      categoryId,
      status,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
    } = options;

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        (where.price as Record<string, number>).gte = minPrice;
      }
      if (maxPrice !== undefined) {
        (where.price as Record<string, number>).lte = maxPrice;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ProductMapper.toDomain(p));
  }

  async count(options: FindProductsOptions = {}): Promise<number> {
    const { categoryId, status, minPrice, maxPrice, search } = options;

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        (where.price as Record<string, number>).gte = minPrice;
      }
      if (maxPrice !== undefined) {
        (where.price as Record<string, number>).lte = maxPrice;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.count({ where });
  }

  async save(product: Product): Promise<Product> {
    const prismaProduct = await this.prisma.product.create({
      data: ProductMapper.toPersistence(product),
    });
    return ProductMapper.toDomain(prismaProduct);
  }

  async update(product: Product): Promise<Product> {
    const prismaProduct = await this.prisma.product.update({
      where: { id: product.id },
      data: ProductMapper.toPersistence(product),
    });
    return ProductMapper.toDomain(prismaProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.product.count({ where: { slug } });
    return count > 0;
  }

  async getPopularProducts(limit: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return products.map((p) => ProductMapper.toDomain(p));
  }
}
