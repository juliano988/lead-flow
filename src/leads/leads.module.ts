import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';
import { LeadRecord, LeadSchema } from './schemas/lead.schema.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: LeadRecord.name, schema: LeadSchema }]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService, JwtAuthGuard],
})
export class LeadsModule {}
