import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { User } from './entities/user.entity.js';
import Email from './value-objects/email.vo.js';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';

export interface CresteUserInput {
  id: Id;
  name: Name;
  email: Email;
  passwordHash: string;
}
@Injectable()
export class UserService {
  private readonly users: Map<string, User> = new Map<string, User>();

  create(cresteUserInput: CresteUserInput): User {
    const emailExists = Array.from(this.users.values()).some((user) =>
      user.email.equals(cresteUserInput.email),
    );

    if (this.users.has(cresteUserInput.id.value) || emailExists) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const user = new User(
      cresteUserInput.id,
      cresteUserInput.name,
      cresteUserInput.email,
      cresteUserInput.passwordHash,
      new Date(),
      new Date(),
    );

    this.users.set(user.id.value, user);

    return user;
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
}
