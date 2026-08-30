import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/register-user.dto.js';
import { AuthService } from './auth.service.js';
import { User } from '../user/entities/user.entity.js';
import { UserResponseDto } from '../user/dto/user-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);

    return this.toUserResponse(user);
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id.value,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
