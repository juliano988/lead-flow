import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/register-user.dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerUserDto: RegisterUserDto) {
    // 1. verificar se email ja existe
    // 2. validar Password VO
    // 3. gerar hash com bcrypt
    // 4. criar Id, Name e Email VOs
    // 5. chamar userService.create(...)
    // 6. retornar dados seguros do usuário
  }
}
