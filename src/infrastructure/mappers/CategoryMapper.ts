import { Category as PrismaCategory } from '@prisma/client';
import { Category } from '../../domain/entities/Category';

export class CategoryMapper {
  static toDomain(prismaCategory: PrismaCategory): Category {
    return Category.create({
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description ?? undefined,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    });
  }

  static toPersistence(category: Category) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
