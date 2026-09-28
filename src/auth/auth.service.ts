import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../user/dto/login.dto.js';
import { RegisterUserDto } from '../user/dto/register-user.dto.js';
import { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';
import Email from '../user/value-objects/email.vo.js';
import Id from '../user/value-objects/id.vo.js';
import Name from '../user/value-objects/name.vo.js';
import Password from '../user/value-objects/password.vo.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const password = new Password(registerUserDto.password);
    const passwordHash = await bcrypt.hash(password.value, 12);

    return this.userService.create({
      name: new Name(registerUserDto.firstName, registerUserDto.lastName),
      email: new Email(registerUserDto.email),
      passwordHash,
    });
  }

  async authenticate(login: LoginDto): Promise<string> {
    let user: User;
    try {
      user = await this.userService.findByEmail(login.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }

      throw error;
    }

    const passwordMatches = await bcrypt.compare(
      login.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return this.generateAccessToken(user);
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id.value,
      email: user.email.value,
    });
  }
}
