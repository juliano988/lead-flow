import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { User } from './entities/user.entity.js';
import { UserService } from './user.service.js';
import Email from './value-objects/email.vo.js';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.create({
      id: new Id(randomUUID()),
      name: new Name(registerUserDto.firstName, registerUserDto.lastName),
      email: new Email(registerUserDto.email),
      passwordHash: registerUserDto.password,
    });
  }

  @Get()
  find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const users = this.userService.find(page, pageSize);
    const count = this.userService.count();

    return {
      page: page,
      pageSize: pageSize,
      pageCount: users.length,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      data: users.map((user) => this.toUserResponse(user)),
    };
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.toUserResponse(this.userService.findById(id));
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.toUserResponse(this.userService.findByEmail(email));
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
