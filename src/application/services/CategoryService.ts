import { Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { DuplicateSlugError } from '../../domain/errors/DuplicateSlugError';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category/CategoryDtos';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ?? this.generateSlug(dto.name);
    const exists = await this.categoryRepository.existsBySlug(slug);
    if (exists) {
      throw new DuplicateSlugError(slug);
    }

    const category = Category.create({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      slug,
      description: dto.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new CategoryNotFoundError(slug);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    const updated = Category.create({
      id: category.id,
      name: dto.name !== undefined ? dto.name.trim() : category.name,
      slug: category.slug,
      description: dto.description !== undefined ? dto.description : category.description,
      createdAt: category.createdAt,
      updatedAt: new Date(),
    });

    return this.categoryRepository.update(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    await this.categoryRepository.delete(id);
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
