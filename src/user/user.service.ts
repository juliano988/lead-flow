import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity.js';
import Email from './value-objects/email.vo.js';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';

export interface CreateUserInput {
  id: Id;
  name: Name;
  email: Email;
  passwordHash: string;
}
@Injectable()
export class UserService {
  private readonly users: Map<string, User> = new Map<string, User>();

  create(createUserInput: CreateUserInput): User {
    if (this.existById(createUserInput.id.value)) {
      throw new ConflictException('ID de usuário já cadastrado');
    }

    if (this.existByEmail(createUserInput.email.value)) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const user = new User(
      createUserInput.id,
      createUserInput.name,
      createUserInput.email,
      createUserInput.passwordHash,
      new Date(),
      new Date(),
    );

    this.users.set(user.id.value, user);

    return user;
  }

  find(page: number, pageSize: number): Array<User> {
    const skip = (page - 1) * pageSize;
    const limit = skip + pageSize;
    const usersKeys = Array.from(this.users.keys()).slice(skip, limit);

    return usersKeys.map((id) => this.users.get(id)) as Array<User>;
  }

  count(): number {
    return this.users.size;
  }

  findByEmail(email: string): User {
    const user = Array.from(this.users.values()).find((user) =>
      user.email.equals(new Email(email)),
    );

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return user;
  }

  findById(id: string): User {
    const user = this.users.get(id);

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return user;
  }

  existById(id: string): boolean {
    return this.users.has(id);
  }

  existByEmail(email: string): boolean {
    return Array.from(this.users.values()).some((user) =>
      user.email.equals(new Email(email)),
    );
  }
}
