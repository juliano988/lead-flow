import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto.js';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
