import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRecord, UserSchema } from './schemas/user.schema.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}
