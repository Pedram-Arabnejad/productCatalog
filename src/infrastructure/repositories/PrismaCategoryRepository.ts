import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { CategoryMapper } from '../mappers/CategoryMapper';

@Injectable()
export class PrismaCategoryRepository extends ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => CategoryMapper.toDomain(c));
  }

  async save(category: Category): Promise<Category> {
    const prismaCategory = await this.prisma.category.create({
      data: CategoryMapper.toPersistence(category),
    });
    return CategoryMapper.toDomain(prismaCategory);
  }

  async update(category: Category): Promise<Category> {
    const prismaCategory = await this.prisma.category.update({
      where: { id: category.id },
      data: CategoryMapper.toPersistence(category),
    });
    return CategoryMapper.toDomain(prismaCategory);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.category.count({ where: { slug } });
    return count > 0;
  }
}
