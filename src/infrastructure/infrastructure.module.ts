import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { PrismaCategoryRepository } from './repositories/PrismaCategoryRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { IProductRepository } from '../domain/interfaces/IProductRepository';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: ICategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [IUserRepository, IProductRepository, ICategoryRepository],
})
export class InfrastructureModule {}
