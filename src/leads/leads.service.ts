import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
import Company from './value-objects/company.vo.js';
import CPF from './value-objects/cpf.vo.js';
import Email from './value-objects/email.vo.js';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';
import Score from './value-objects/score.vo.js';
import Source from './value-objects/source.vo.js';
import Status, { StatusValues } from './value-objects/status.vo.js';

@Injectable()
export class LeadsService {
  private readonly leads: Map<string, Lead> = new Map<string, Lead>();

  create(createLeadDto: CreateLeadDto): Lead {
    const lead = new Lead(
      new Id(crypto.randomUUID()),
      new Name(createLeadDto.firstName, createLeadDto.lastName),
      new Email(createLeadDto.email),
      new CPF(createLeadDto.cpf),
      new Company(createLeadDto.companyName, createLeadDto.cnpj),
      new Source(createLeadDto.source),
      new Status(StatusValues.New),
      new Score(0),
      new Date(),
      new Date(),
    );

    this.leads.set(lead.id.value, lead);

    return lead;
  }

  findAll(): Lead[] {
    return Array.from(this.leads.values());
  }

  findOne(id: string): Lead {
    return this.findLead(id);
  }

  update(id: string, updateLeadDto: UpdateLeadDto): Lead {
    const lead = this.findLead(id);

    const updatedLead = new Lead(
      lead.id,
      new Name(
        updateLeadDto.firstName ?? lead.name.firstName,
        updateLeadDto.lastName ?? lead.name.lastName,
      ),
      new Email(updateLeadDto.email ?? lead.email.value),
      new CPF(updateLeadDto.cpf ?? lead.cpf.value),
      new Company(
        updateLeadDto.companyName ?? lead.company.name,
        updateLeadDto.cnpj ?? lead.company.cnpj.value,
      ),
      new Source(updateLeadDto.source ?? lead.source.value),
      new Status(lead.status.value),
      new Score(lead.score.value),
      lead.createdAt,
      new Date(),
    );

    this.leads.set(id, updatedLead);

    return updatedLead;
  }

  remove(id: string): void {
    this.findLead(id);
    this.leads.delete(id);
  }

  private findLead(id: string): Lead {
    const lead = this.leads.get(id);

    if (!lead) {
      throw new NotFoundException('Lead nao encontrado');
    }

    return lead;
  }
}
