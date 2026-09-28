import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
import Status from './value-objects/status.vo.js';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(LeadRecord.name)
    private readonly leadModel: Model<LeadRecord>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const name = new Name(createLeadDto.firstName, createLeadDto.lastName);
    const company = new Company(createLeadDto.companyName, createLeadDto.cnpj);

    const lead = await this.leadModel.create({
      firstName: name.firstName,
      lastName: name.lastName,
      email: new Email(createLeadDto.email).value,
      cpf: new CPF(createLeadDto.cpf).value,
      source: new Source(createLeadDto.source).value,
      company: {
        name: company.name,
        cnpj: company.cnpj.value,
      },
    });

    return this.toDomain(lead);
  }

  async find(page: number, pageSize: number): Promise<Lead[]> {
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1
    ) {
      throw new BadRequestException(
        'Página e tamanho devem ser inteiros positivos',
      );
    }

    const skip = (page - 1) * pageSize;

    const users = await this.leadModel.find().skip(skip).limit(pageSize).lean();

    return users.map((user) => this.toDomain(user));
  }

  async count(): Promise<number> {
    return this.leadModel.countDocuments().exec();
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

    const update = mongoose.omitUndefined({
      firstName: updateLeadDto.firstName,
      lastName: updateLeadDto.lastName,
      email: updateLeadDto.email,
      cpf: updateLeadDto.cpf,
      source: updateLeadDto.source,
      'company.name': updateLeadDto.companyName,
      'company.cnpj': updateLeadDto.cnpj,
    });

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(
        lead.id.value,
        { $set: update },
        {
          new: true,
          runValidators: true,
        },
      )
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
      new Id(lead._id.toString()),
      new Name(lead.firstName, lead.lastName),
      new Email(lead.email),
      new CPF(lead.cpf),
      new Company(lead.company.name, lead.company.cnpj),
      new Source(lead.source),
      new Status(lead.status),
      new Score(lead.score),
      lead.createdAt,
      lead.updatedAt,
    );
  }
}
