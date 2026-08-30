import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../user/dto/register-user.dto.js';
import { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';
import Email from '../user/value-objects/email.vo.js';
import Id from '../user/value-objects/id.vo.js';
import Name from '../user/value-objects/name.vo.js';
import Password from '../user/value-objects/password.vo.js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = this.userService.findByEmail(registerUserDto.email);

    if (user) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const password = new Password(registerUserDto.password);
    const passwordHash = await bcrypt.hash(password.value, 12);

    return this.userService.create({
      id: new Id(crypto.randomUUID()),
      name: new Name(registerUserDto.firstName, registerUserDto.lastName),
      email: new Email(registerUserDto.email),
      passwordHash,
    });
  }
}
