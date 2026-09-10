import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import { Product } from '../../domain/entities/Product';
import { Money } from '../../domain/value-objects/Money';
import { Stock } from '../../domain/value-objects/Stock';
import { ProductStatus } from '../../domain/enums/ProductStatus';
import { ProductNotFoundError } from '../../domain/errors/ProductNotFoundError';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';
import { DuplicateSlugError } from '../../domain/errors/DuplicateSlugError';
import { InsufficientStockError } from '../../domain/errors/InsufficientStockError';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from '../dtos/product/ProductDtos';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(dto.categoryId);
    }

    const slug = dto.slug ?? this.generateSlug(dto.name);
    const exists = await this.productRepository.existsBySlug(slug);
    if (exists) {
      throw new DuplicateSlugError(slug);
    }

    const product = Product.create({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      slug,
      description: dto.description,
      price: Money.create(dto.price),
      stock: Stock.create(dto.stock),
      status: dto.status ?? ProductStatus.DRAFT,
      categoryId: dto.categoryId,
      imageUrl: dto.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.productRepository.save(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new ProductNotFoundError(slug);
    }
    return product;
  }

  async findAll(query: ProductQueryDto): Promise<{ products: Product[]; total: number }> {
    const options = {
      categoryId: query.categoryId,
      status: query.status,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      search: query.search,
      page: query.page,
      limit: query.limit,
    };

    const [products, total] = await Promise.all([
      this.productRepository.findAll(options),
      this.productRepository.count(options),
    ]);

    return { products, total };
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new CategoryNotFoundError(dto.categoryId);
      }
    }

    if (dto.name !== undefined) {
      // slug follows name when the name changes and slug isn't set explicitly
      const newSlug = this.generateSlug(dto.name);
      if (newSlug !== product.slug) {
        const exists = await this.productRepository.existsBySlug(newSlug);
        if (exists) {
          throw new DuplicateSlugError(newSlug);
        }
      }
    }

    const updated = this.applyUpdate(product, dto);
    return this.productRepository.update(updated);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    await this.productRepository.delete(id);
  }

  async adjustStock(id: string, delta: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (delta > 0) {
      product.increaseStock(delta);
    } else if (delta < 0) {
      const requested = Math.abs(delta);
      if (!product.stock.isAvailable(requested)) {
        throw new InsufficientStockError(
          id,
          requested,
          product.stock.getQuantity(),
        );
      }
      product.decreaseStock(requested);
    }

    return this.productRepository.update(product);
  }

  private applyUpdate(product: Product, dto: UpdateProductDto): Product {
    const props = {
      id: product.id,
      name: dto.name !== undefined ? dto.name.trim() : product.name,
      slug: product.slug,
      description: dto.description !== undefined ? dto.description : product.description,
      price: dto.price !== undefined ? Money.create(dto.price) : product.price,
      stock: dto.stock !== undefined ? Stock.create(dto.stock) : product.stock,
      status: dto.status !== undefined ? dto.status : product.status,
      categoryId: dto.categoryId !== undefined ? dto.categoryId : product.categoryId,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: new Date(),
    };

    return Product.create(props);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
