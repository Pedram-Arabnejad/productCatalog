import { User } from '../entities/User';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract exists(email: string): Promise<boolean>;
}
