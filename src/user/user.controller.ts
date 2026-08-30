import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { randomUUID } from 'crypto';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';
import Email from './value-objects/email.vo.js';

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

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
