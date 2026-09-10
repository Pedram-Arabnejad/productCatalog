import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CategoryService } from '../../application/services/CategoryService';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '../../application/dtos/category/CategoryDtos';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() body: Record<string, unknown>) {
    const dto = CreateCategoryDto.fromBody(body);
    const error = dto.validate();
    if (error) {
      throw new BadRequestException(error);
    }
    const category = await this.categoryService.create(dto);
    return CategoryResponseDto.fromDomain(category);
  }

  @Get()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return {
      data: categories.map((c) => CategoryResponseDto.fromDomain(c)),
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.categoryService.findById(id);
    return CategoryResponseDto.fromDomain(category);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const dto = UpdateCategoryDto.fromBody(body);
    const error = dto.validate();
    if (error) {
      throw new BadRequestException(error);
    }
    const category = await this.categoryService.update(id, dto);
    return CategoryResponseDto.fromDomain(category);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
