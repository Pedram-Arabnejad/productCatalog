import { Role } from '../enums/Role';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: Role;
  provider: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): Role {
    return this.props.role;
  }

  get provider(): string {
    return this.props.provider;
  }

  get providerId(): string | undefined {
    return this.props.providerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isAdmin(): boolean {
    return this.props.role === Role.ADMIN;
  }
}
