import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from '../../application/services/ProductService';
import { ProductResponseDto } from '../../application/dtos/product/ProductDtos';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from '../../application/dtos/product/ProductDtos';
import { BadRequestException } from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() body: Record<string, unknown>) {
    const dto = CreateProductDto.fromBody(body);
    const error = dto.validate();
    if (error) {
      throw new BadRequestException(error);
    }
    const product = await this.productService.create(dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Get()
  async findAll(@Query() query: Record<string, unknown>) {
    const dto = ProductQueryDto.fromQuery(query);
    const error = dto.validate();
    if (error) {
      throw new BadRequestException(error);
    }
    const { products, total } = await this.productService.findAll(dto);
    return {
      data: products.map((p) => ProductResponseDto.fromDomain(p)),
      meta: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productService.findById(id);
    return ProductResponseDto.fromDomain(product);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const dto = UpdateProductDto.fromBody(body);
    const error = dto.validate();
    if (error) {
      throw new BadRequestException(error);
    }
    const product = await this.productService.update(id, dto);
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.delete(id);
    return { message: 'Product deleted successfully' };
  }

  @Put(':id/stock')
  async adjustStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { delta?: number },
  ) {
    const delta = Number(body.delta);
    if (!Number.isInteger(delta) || delta === 0) {
      throw new BadRequestException(
        'delta must be a non-zero integer (positive to add stock, negative to reduce)',
      );
    }
    const product = await this.productService.adjustStock(id, delta);
    return ProductResponseDto.fromDomain(product);
  }
}
