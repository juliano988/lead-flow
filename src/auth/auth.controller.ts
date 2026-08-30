import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/register-user.dto.js';
import { AuthService } from './auth.service.js';
import { User } from '../user/entities/user.entity.js';
import { UserResponseDto } from '../user/dto/user-response.dto.js';
import { LoginDto } from '../user/dto/login.dto.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);

    return this.toUserResponse(user);
  }

  @Post('login')
  async authenticate(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.authenticate(loginDto);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'Login realizado com sucesso',
    };
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
