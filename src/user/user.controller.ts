import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { User, type UserSummary } from './entities/user.entity.js';
import { UserService } from './user.service.js';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const users = await this.userService.find(page, pageSize);
    const count = await this.userService.count();

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
  async findById(@Param('id') id: string) {
    return this.toUserResponse(await this.userService.findById(id));
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.toUserResponse(await this.userService.findByEmail(email));
  }

  private toUserResponse(user: UserSummary): UserResponseDto {
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
