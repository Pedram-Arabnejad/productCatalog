import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mappers/UserMapper';

@Injectable()
export class PrismaUserRepository extends IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(prismaUser);
  }

  async update(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }
}
