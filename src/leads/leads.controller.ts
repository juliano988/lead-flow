import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import LeadResponseDto from './dto/lead-response.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
import { LeadsService } from './leads.service.js';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.toResponse(await this.leadsService.create(createLeadDto));
  }

  @Get()
  async findAll() {
    return (await this.leadsService.find()).map((lead) =>
      this.toResponse(lead),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.toResponse(await this.leadsService.findById(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.toResponse(await this.leadsService.update(id, updateLeadDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
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
