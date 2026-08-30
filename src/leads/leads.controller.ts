import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
import LeadResponseDto from './dto/lead-response.dto.js';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.toResponse(this.leadsService.create(createLeadDto));
  }

  @Get()
  findAll() {
    return this.leadsService.findAll().map((lead) => this.toResponse(lead));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toResponse(this.leadsService.findOne(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.toResponse(this.leadsService.update(id, updateLeadDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  private toResponse(lead: Lead): LeadResponseDto {
    return {
      id: lead.id.value,
      firstName: lead.name.firstName,
      lastName: lead.name.lastName,
      email: lead.email.value,
      cpf: lead.cpf.value,
      company: {
        name: lead.company.name,
        cnpj: lead.company.cnpj.value,
      },
      source: lead.source.value,
      status: lead.status.value,
      score: {
        value: lead.score.value,
        classification: lead.score.classification,
      },
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }
}
