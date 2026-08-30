import { PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto.js';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
