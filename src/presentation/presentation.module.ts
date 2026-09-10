import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ProductService } from '../application/services/ProductService';
import { CategoryService } from '../application/services/CategoryService';
import { ProductController } from './controllers/ProductController';
import { CategoryController } from './controllers/CategoryController';
import { GlobalExceptionFilter } from './filters/GlobalExceptionFilter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [InfrastructureModule],
  controllers: [ProductController, CategoryController],
  providers: [
    ProductService,
    CategoryService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class PresentationModule {}
