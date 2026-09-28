import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const users = await this.leadsService.find(page, pageSize);
    const count = await this.leadsService.count();

    return {
      page: page,
      pageSize: pageSize,
      pageCount: users.length,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      data: users.map((user) => this.toResponse(user)),
    };
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
    return this.toResponse(await this.leadsService.remove(id));
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
