import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LeadsController } from './leads.controller.js';
import { LeadsService } from './leads.service.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
