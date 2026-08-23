import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/enums/Role';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      role: prismaUser.role as Role,
      provider: prismaUser.provider,
      providerId: prismaUser.providerId ?? undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      providerId: user.providerId ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
