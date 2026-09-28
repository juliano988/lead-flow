import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
import { LeadRecord } from './schemas/lead.schema.js';
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
  constructor(
    @InjectModel(LeadRecord.name)
    private readonly leadModel: Model<LeadRecord>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = await this.leadModel.create({
      firstName: createLeadDto.firstName,
      lastName: createLeadDto.lastName,
      email: createLeadDto.email,
      cpf: createLeadDto.cpf,
      source: new Source(createLeadDto.source).value,
      company: {
        name: createLeadDto.companyName,
        cnpj: createLeadDto.cnpj,
      },
    });

    return this.toDomain(lead);
  }

  async find(): Promise<Array<Lead>> {
    return (await this.leadModel.find().lean()).map((lead) =>
      this.toDomain(lead),
    );
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).lean();

    if (!lead) {
      throw new NotFoundException('Lead nao encontrado');
    }

    return this.toDomain(lead);
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findById(id);

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(lead.id, {
        firstName: updateLeadDto.firstName,
        lastName: updateLeadDto.lastName,
        email: updateLeadDto.email,
        cpf: updateLeadDto.cpf,
        companyName: updateLeadDto.companyName,
        cnpj: updateLeadDto.cnpj,
        source: updateLeadDto.source,
      })
      .lean();

    return this.toDomain(updatedLead as LeadRecord);
  }

  async remove(id: string): Promise<Lead> {
    const lead = await this.leadModel.findByIdAndDelete(id).lean();

    if (!lead) {
      throw new NotFoundException('Lead nao encontrado');
    }

    return this.toDomain(lead);
  }

  private toDomain(lead: LeadRecord): Lead {
    return new Lead(
      new Id(crypto.randomUUID()),
      new Name(lead.firstName, lead.lastName),
      new Email(lead.email),
      new CPF(lead.cpf),
      new Company(lead.company.name, lead.company.cnpj),
      new Source(lead.source),
      new Status(StatusValues.New),
      new Score(0),
      new Date(),
      new Date(),
    );
  }
}
