import { Category } from '../../../domain/entities/Category';

export class CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;

  validate(): string | null {
    if (!this.name || this.name.trim().length < 2) {
      return 'name is required (min 2 characters)';
    }
    if (this.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug)) {
      return 'slug must be kebab-case (e.g. home-kitchen)';
    }
    if (this.description !== undefined && this.description.length > 500) {
      return 'description is too long (max 500 characters)';
    }
    return null;
  }

  static fromBody(body: Record<string, unknown>): CreateCategoryDto {
    const dto = new CreateCategoryDto();
    dto.name = body.name as string;
    dto.slug = body.slug as string | undefined;
    dto.description = body.description as string | undefined;
    return dto;
  }
}

export class UpdateCategoryDto {
  name?: string;
  description?: string;

  validate(): string | null {
    if (this.name !== undefined && this.name.trim().length < 2) {
      return 'name must be at least 2 characters';
    }
    if (this.description !== undefined && this.description.length > 500) {
      return 'description is too long (max 500 characters)';
    }
    return null;
  }

  static fromBody(body: Record<string, unknown>): UpdateCategoryDto {
    const dto = new UpdateCategoryDto();
    dto.name = body.name as string | undefined;
    dto.description = body.description as string | undefined;
    return dto;
  }
}

export class CategoryResponseDto {
  static fromDomain(category: Category) {
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
